import sys
import os
import pytest
from adafruit_clue import clue

# from displayio.tile_grid import img, bmp_img
import displayio
from PIL import Image

from adafruit_display_shapes.rect import Rect
from adafruit_display_shapes.circle import Circle
from adafruit_display_shapes.roundrect import RoundRect


class TestAdafruitDisplayShapes(object):
    def setup_method(self):
        pass

    def test_shapes(self):

        expected_images = []
        for i in range(5):
            expected = Image.open(
                os.path.join(sys.path[0], "test", f"test_image_shapes_{i+1}.bmp")
            )
            expected_images.append(expected.load())

        # TAKEN FROM ADAFRUIT'S DISPLAY SHAPES LIBRARY
        splash = displayio.Group(max_size=10)

        color_bitmap = displayio.Bitmap(320, 240, 1)
        color_palette = displayio.Palette(1)
        color_palette[0] = 0xFFFFFF
        bg_sprite = displayio.TileGrid(
            color_bitmap, x=0, y=0, pixel_shader=color_palette
        )

        splash.append(bg_sprite)
        self.__test_image_equality(displayio.bmp_img, expected_images[0])

        rect = Rect(80, 20, 41, 41, fill=0x00FF00)
        splash.append(rect)
        self.__test_image_equality(displayio.bmp_img, expected_images[1])
        circle = Circle(100, 100, 20, fill=0x00FF00, outline=0xFF00FF)
        splash.append(circle)

        self.__test_image_equality(displayio.bmp_img, expected_images[2])

        rect2 = Rect(50, 100, 61, 81, outline=0x0, stroke=3)
        splash.append(rect2)

        self.__test_image_equality(displayio.bmp_img, expected_images[3])

        roundrect = RoundRect(10, 10, 61, 81, 10, fill=0x0, outline=0xFF00FF, stroke=6)
        splash.append(roundrect)

        self.__test_image_equality(displayio.bmp_img, expected_images[4])

    def __test_image_equality(self, image_1, image_2):
        for i in range(240):
            for j in range(240):
                assert image_1[j, i] == image_2[j, i]
