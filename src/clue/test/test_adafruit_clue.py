import pytest

import os
import pathlib
from PIL import Image

from unittest import mock
from unittest.mock import MagicMock, patch

from common import utils

import displayio
import terminalio

from ..adafruit_clue import clue
from .test_helpers import helper
from base_circuitpython import base_cp_constants as CONSTANTS


class TestAdafruitClue(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()

        # reset bmp_img to all black
        displayio.img.paste(
            "black", [0, 0, displayio.img.size[0], displayio.img.size[1]]
        )

        utils.send_to_simulator = mock.Mock()

    def test_clue_display_text(self):
        img = Image.open(
            os.path.join(self.abs_path, CONSTANTS.IMG_DIR_NAME, f"test_clue_text_1.bmp")
        )
        img.putalpha(255)
        expected = img.load()
        clue_data = clue.simple_text_display(title="LET'S TEST!", title_scale=2)

        clue_data[0].text = "Lorem ipsum"
        clue_data[1].text = "dolor sit amet, consectetur "
        clue_data[2].text = "adipiscing:"

        clue_data[4].text = "e"
        clue_data[5].text = "sed do eiusmod"
        clue_data[6].text = "tempor incididunt\nut labore"
        clue_data[7].text = "ut labore"

        clue_data[10].text = "et dolore"
        clue_data[11].text = "magna"
        clue_data[12].text = "aliqua\ntestest"
        clue_data[13].text = "Ut enim ad"
        clue_data[14].text = "Excepteur sint"
        clue_data.show()

        helper._Helper__test_image_equality(displayio.bmp_img, expected)
