import pytest
from ..tile_grid import TileGrid, img, bmp_img
from ..palette import Palette
from ..bitmap import Bitmap
from .. import constants as CONSTANTS


class TestTileGrid(object):
    def setup_method(self):
        self.dummy_bitmap = Bitmap(500, 500)
        self.dummy_palette = Palette(5)
        self.dummy_pos = (0, 0)

    @pytest.mark.parametrize(
        "bitmap_w,bitmap_h,palette_num,tile_width,tile_height,position",
        [(1, 1, 3, 1, 1, (0, 5)), (5, 7, 4, 2, 3, (0, 5))],
    )
    def test_basic_constructor(
        self, bitmap_w, bitmap_h, palette_num, tile_width, tile_height, position
    ):
        # constructor with position tuple
        tg1 = TileGrid(
            bitmap=Bitmap(bitmap_w, bitmap_h),
            pixel_shader=Palette(palette_num),
            tile_width=tile_width,
            tile_height=tile_height,
            position=position,
        )

        # alternate constructor with no position tuple

        tg2 = TileGrid(
            bitmap=Bitmap(bitmap_w, bitmap_h),
            pixel_shader=Palette(palette_num),
            tile_width=tile_width,
            tile_height=tile_height,
            x=position[0],
            y=position[1],
        )

        tile_grids = [tg1, tg2]

        for tg in tile_grids:
            assert tg.bitmap.width == bitmap_w
            assert tg.bitmap.height == bitmap_h
            assert len(tg.pixel_shader._Palette__contents) == palette_num
            assert tg.tile_width == tile_width
            assert tg.tile_height == tile_height
            assert tg.x == position[0]
            assert tg.y == position[1]

        # alternate constructor with no height and width -> takes the bitmap's height and width
        tg3 = TileGrid(
            bitmap=Bitmap(bitmap_w, bitmap_h),
            pixel_shader=Palette(palette_num),
            x=position[0],
            y=position[1],
        )

        assert tg3.bitmap.width == bitmap_w
        assert tg3.bitmap.height == bitmap_h
        assert len(tg3.pixel_shader._Palette__contents) == palette_num
        assert tg3.tile_width == bitmap_w
        assert tg3.tile_height == bitmap_h
        assert tg3.x == position[0]
        assert tg3.y == position[1]

    @pytest.mark.parametrize(
        "w, h, x, y", [(5, 5, 2, 1), (2, 7, 0, 0), (66, 88, 65, 87)]
    )
    def test_tile_set_get(self, w, h, x, y):
        tg = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            tile_width=w,
            tile_height=h,
            position=self.dummy_pos,
        )

        tg_x_y = tg[x, y]
        assert tg_x_y == tg.bitmap[x, y]

    @pytest.mark.parametrize(
        "w, h, x, y", [(55, 56, 100, 1), (55, 56, 0, 56), (66, 88, 66, 88)]
    )
    def test_tile_out_of_bounds(self, w, h, x, y):
        tg = TileGrid(
            bitmap=self.dummy_bitmap,
            pixel_shader=self.dummy_palette,
            tile_width=w,
            tile_height=h,
            position=self.dummy_pos,
        )
        with pytest.raises(IndexError, match=CONSTANTS.TILE_OUT_OF_BOUNDS):
            tg_x_y = tg[x, y]

    @pytest.mark.parametrize(
        "size_w, size_h, x, y, draw_w, draw_h, bg_color, accent_color, x_offset, y_offset, scale",
        [
            (10, 10, 5, 5, 5, 5, (3, 0, 0), (244, 255, 23), 2, 0, 2),
            (100, 30, 2, 3, 6, 3, (255, 255, 255), (45, 45, 77), 0, 7, 5),
        ],
    )
    def test_draw(
        self,
        size_w,
        size_h,
        x,
        y,
        draw_w,
        draw_h,
        bg_color,
        accent_color,
        x_offset,
        y_offset,
        scale,
    ):

        palette = Palette(2)
        palette[0] = bg_color
        palette[1] = accent_color

        bmp = Bitmap(size_w, size_h)

        for i in range(size_h):
            for j in range(size_w):
                bmp[j, i] = 0

        for i in range(y, y + draw_h):
            for j in range(x, x + draw_w):
                try:
                    bmp[j, i] = 1
                except IndexError:
                    continue

        tg = TileGrid(bitmap=bmp, pixel_shader=palette, position=(0, 0))
        tg2 = TileGrid(bitmap=bmp, pixel_shader=palette, position=(0, 0))

        # without scaling, test output
        tg.draw(x_offset, y_offset, 1)
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                if (i in range(y_offset + y, y_offset + y + draw_h)) and (
                    j in range(x_offset + x, x_offset + x + draw_w)
                ):
                    assert bmp_img[j, i] == accent_color
                elif (i in range(y_offset, y_offset + size_h)) and (
                    j in range(x_offset, x_offset + size_w)
                ):
                    assert bmp_img[j, i] == bg_color

        # with scaling, test output
        tg.draw(x_offset, y_offset, scale)
        for i in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
            for j in range(CONSTANTS.SCREEN_HEIGHT_WIDTH):
                if (
                    i in range(y_offset + y * scale, y_offset + (y + draw_h) * scale)
                ) and (
                    j in range(x_offset + x * scale, x_offset + (x + draw_w) * scale)
                ):
                    assert bmp_img[j, i] == accent_color
                elif (i in range(y_offset * scale, (y_offset + draw_h) * scale)) and (
                    j in range(x_offset * scale, (x_offset + draw_w) * scale)
                ):
                    assert bmp_img[j, i] == bg_color
