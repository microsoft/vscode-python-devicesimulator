# from displayio.tile_grid import img, bmp_img
# import displayio
from PIL import Image

# import sys
# import os
import pytest

# from adafruit_clue import clue
import os
from adafruit_display_text import label

# from displayio import bmp_img, img
import displayio
import terminalio
import pathlib
from .test_helpers import helper
from . import constants as CONSTANTS

test_count = 0


class TestAdafruitDisplayText(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()
        # displayio.img = Image.new("RGB", (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH), "black")  # Create a new black image

        displayio.img.paste(
            "black", [0, 0, displayio.img.size[0], displayio.img.size[1]]
        )
        displayio.bmp_img = displayio.img.load()  # Create the pixel map

    @pytest.mark.parametrize(
        "text, x,y, scale, color",
        [
            ("Hello World", 1, 10, 4, (0, 22, 103)),
            ("WWWWwwwmMMmmm", 30, 6, 1, 0xDEADBE),
            ("wOooo00ooo", 104, 49, 9, 0xEFEFEF),
            ("!!!\n  yay!", 100, 100, 5, (200, 200, 255)),
        ],
    )
    def test_display_text(self, text, x, y, scale, color):
        global test_count

        expected_images = []
        for j in range(4):
            expected = Image.open(
                os.path.join(
                    self.abs_path,
                    CONSTANTS.IMG_DIR_NAME,
                    f"test_display_text_{j+1}.bmp",
                )
            )
            expected_images.append(expected.load())

        text_area = label.Label(
            terminalio.FONT, text=text, auto_write=False, scale=scale, color=color
        )
        text_area.x = x
        text_area.y = y
        text_area.draw(show=True)

        helper._Helper__test_image_equality(
            displayio.bmp_img, expected_images[test_count]
        )
        # displayio.img.save(f"test_display_text_{test_count+1}.bmp")
        test_count += 1
