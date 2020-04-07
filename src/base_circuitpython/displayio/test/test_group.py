import sys
import os
import pytest
import pathlib

from unittest import mock

from common import utils

from ..tile_grid import TileGrid
from ..group import Group
from ..palette import Palette
from ..bitmap import Bitmap
from .. import constants as CONSTANTS
from PIL import Image


class TestGroup(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()
        self.dummy_bitmap = Bitmap(500, 500)
        self.dummy_palette = Palette(5)
        self.dummy_pos = (0, 0)

        utils.send_to_simulator = mock.Mock()

    def test_append_tilegrid_group_to_group(self):
        tg1 = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            position=self.dummy_pos,
        )

        tg2 = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            position=self.dummy_pos,
        )

        g1 = Group(max_size=10)
        g2 = Group(max_size=10)

        g2.append(g1)
        g2.append(tg1)
        g2.append(tg2)

        assert len(g2._Group__contents) == 3
        assert len(g1._Group__contents) == 0

    @pytest.mark.parametrize("group_item", [(""), (5), ((4, 5))])
    def test_incorr_subclass(self, group_item):
        g1 = Group(max_size=10)
        with pytest.raises(ValueError, match=CONSTANTS.INCORR_SUBCLASS):
            g1.append(group_item)

    def test_layer_already_in_group(self):
        g1 = Group(max_size=4)

        tg1 = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            position=self.dummy_pos,
        )

        tg2 = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            position=self.dummy_pos,
        )

        g1.append(tg1)

        # should allow this, since it checks equality by reference:
        g1.append(tg2)

        # should throw error for same group by reference
        with pytest.raises(ValueError, match=CONSTANTS.LAYER_ALREADY_IN_GROUP):
            g1.append(tg1)

    def test_group_full(self):
        g1 = Group(max_size=1)

        tg1 = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            position=self.dummy_pos,
        )

        tg2 = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            position=self.dummy_pos,
        )

        g1.append(tg1)

        with pytest.raises(RuntimeError, match=CONSTANTS.GROUP_FULL):
            g1.append(tg2)

    @pytest.mark.parametrize(
        "size_w,size_h,draw_w,draw_h,accent_colors,x_offset,y_offset,scale_sub,scale_main",
        [
            (
                (30, 27),
                (63, 34),
                (10, 11),
                (40, 20),
                ((244, 266, 23), (134, 26, 3)),
                3,
                9,
                2,
                3,
            )
        ],
    )
    def test_draw_group(
        self,
        size_w,
        size_h,
        draw_w,
        draw_h,
        accent_colors,
        x_offset,
        y_offset,
        scale_sub,
        scale_main,
    ):
        palette = Palette(3)
        palette[1] = accent_colors[0]
        palette[2] = accent_colors[1]

        bmp_1 = Bitmap(size_w[0], size_h[0])
        bmp_2 = Bitmap(size_w[1], size_h[1])

        for i in range(draw_h[0]):
            for j in range(draw_w[0]):
                try:
                    bmp_1[j, i] = 1
                except IndexError:
                    continue

        for i in range(draw_h[1]):
            for j in range(draw_w[1]):
                try:
                    bmp_2[j, i] = 2
                except IndexError:
                    continue

        tg = TileGrid(bitmap=bmp_1, pixel_shader=palette, position=(0, 0))
        tg2 = TileGrid(bitmap=bmp_2, pixel_shader=palette, position=(50, 50))

        group_main = Group(max_size=10, scale=scale_main, check_active_group_ref=False)
        group_sub = Group(max_size=10, scale=scale_sub)

        group_sub.append(tg)
        group_main.append(group_sub)
        group_main.append(tg2)
        img = group_main._Group__draw()

        img.putalpha(255)
        expected = Image.open(
            os.path.join(self.abs_path, "img", "group_test_result.bmp")
        )
        expected.putalpha(255)
        bmp_img_expected = expected.load()
        bmp_img = img.load()
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                assert bmp_img_expected[j, i] == bmp_img[j, i]
