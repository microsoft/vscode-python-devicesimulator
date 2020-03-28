from ..adafruit_slideshow import SlideShow, PlayBackDirection, PlayBackOrder
import board
import pathlib
import os

from PIL import Image
from .test_helpers import helper
from base_circuitpython import base_cp_constants as CONSTANTS

from unittest import mock

from common import utils


class TestAdafruitSlideShow(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()

        # Create a new black (default) image
        self.main_img = Image.new(
            "RGBA",
            (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH),
            (0, 0, 0, 0),
        )

        utils.send_to_simulator = mock.Mock()

    def test_slideshow(self):

        pic_dir = os.path.join(self.abs_path, "slideshow_pics")
        slideshow_images = []
        for i in range(8):
            img = Image.open(os.path.join(pic_dir, f"pic_{i+1}.bmp"))
            img = img.convert("RGBA")
            img.putalpha(255)

            img = img.crop(
                (0, 0, CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH)
            )

            if img.size[0] < 240 or img.size[1] < 240:
                black_overlay = Image.new(
                    "RGBA",
                    CONSTANTS.SCREEN_HEIGHT_WIDTH,
                    CONSTANTS.SCREEN_HEIGHT_WIDTH,
                )
                black_overlay.paste(img)
                img = black_overlay

            slideshow_images.append(img)

        # Create the slideshow object that plays through once alphabetically.
        slideshow = SlideShow(
            board.DISPLAY,
            dwell=3,
            folder=pic_dir,
            loop=True,
            fade_effect=True,
            auto_advance=True,
            order=PlayBackOrder.ALPHABETICAL,
            direction=PlayBackDirection.FORWARD,
        )

        slideshow._send = self._send_helper

        # first image's appear time is unstable,since it fades/scrolls in
        # can oly predict following ones...

        for i in range(1, 8):
            slideshow.advance()
            helper._Helper__test_image_equality(
                self.main_img.load(), slideshow_images[i].load()
            )

        # Create the slideshow object that plays through once backwards.
        slideshow2 = SlideShow(
            board.DISPLAY,
            dwell=3,
            folder=pic_dir,
            loop=True,
            fade_effect=False,
            auto_advance=True,
            order=PlayBackOrder.ALPHABETICAL,
            direction=PlayBackDirection.BACKWARD,
        )

        slideshow2._send = self._send_helper

        helper._Helper__test_image_equality(
            self.main_img.load(), slideshow_images[7].load()
        )

        for i in range(6, -1, -1):
            slideshow2.advance()
            helper._Helper__test_image_equality(
                self.main_img.load(), slideshow_images[i].load()
            )

    def _send_helper(self, image):
        self.main_img = image
