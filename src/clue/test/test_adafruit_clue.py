from PIL import Image
# import sys
# import os
import pytest
from adafruit_clue import clue
import os
# from adafruit_display_text import label
# from displayio import bmp_img, img
import displayio
import terminalio
import pathlib
from .test_helpers import helper
from . import constants as CONSTANTS

class TestAdafruitClue(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()
        
        displayio.img.paste("black", [0,0,displayio.img.size[0],displayio.img.size[1]])

    def test_clue_display_text(self):
        expected = Image.open(os.path.join(self.abs_path, f"test_clue_text_1.bmp")).load()
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
    