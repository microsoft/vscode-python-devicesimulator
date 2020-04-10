import pytest
import pathlib
import os

import displayio

from PIL import Image
from unittest import mock

from common import utils


from adafruit_display_shapes.rect import Rect
from adafruit_display_shapes.circle import Circle
from adafruit_display_shapes.roundrect import RoundRect

from .test_helpers import helper
from base_circuitpython import base_cp_constants as CONSTANTS
import board


class TestAdafruitDisplayShapes(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()

        utils.send_to_simulator = mock.Mock()
        self.main_img = Image.new(
            "RGBA",
            (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH),
            (0, 0, 0, 0),
        )

    def test_shapes(self):

        expected_images = []
        for i in range(5):
            img = Image.open(
                os.path.join(
                    self.abs_path,
                    CONSTANTS.IMG_DIR_NAME,
                    f"test_image_shapes_{i+1}.bmp",
                )
            )

            img.putalpha(255)
            expected_images.append(img.load())

        # TAKEN FROM ADAFRUIT'S DISPLAY SHAPES LIBRARY
        # https://github.com/ladyada/Adafruit_CircuitPython_Display_Shapes/blob/master/examples/display_shapes_simpletest.py
        splash = displayio.Group(max_size=10)
        splash._Group__show = self.__send_helper
        board.DISPLAY.show(splash)
        color_bitmap = displayio.Bitmap(320, 240, 1)
        color_palette = displayio.Palette(1)
        color_palette[0] = 0xFFFFFF
        bg_sprite = displayio.TileGrid(
            color_bitmap, x=0, y=0, pixel_shader=color_palette
        )
        splash.append(bg_sprite)
        helper._Helper__test_image_equality(self.main_img.load(), expected_images[0])

        rect = Rect(80, 20, 41, 41, fill=0x00FF00)
        splash.append(rect)
        helper._Helper__test_image_equality(self.main_img.load(), expected_images[1])
        circle = Circle(100, 100, 20, fill=0x00FF00, outline=0xFF00FF)
        splash.append(circle)

        helper._Helper__test_image_equality(self.main_img.load(), expected_images[2])

        rect2 = Rect(50, 100, 61, 81, outline=0x0, stroke=3)
        splash.append(rect2)

        helper._Helper__test_image_equality(self.main_img.load(), expected_images[3])

        roundrect = RoundRect(10, 10, 61, 81, 10, fill=0x0, outline=0xFF00FF, stroke=6)
        splash.append(roundrect)

        helper._Helper__test_image_equality(self.main_img.load(), expected_images[4])

    def __send_helper(self, image):
        self.main_img = image
