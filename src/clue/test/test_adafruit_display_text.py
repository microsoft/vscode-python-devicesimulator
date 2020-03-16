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


i = 0
class TestAdafruitDisplayText(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()
        # self.i = 0

    @pytest.mark.parametrize("text, x,y, scale, color", [("Hello World", 1, 10, 4, (0,22,103)), ("WWWWwwwmMMmmm", 30, 6,1,0xDEADBE), ("wOooo00ooo", 104, 49, 9,0xEFEFEF), ("!!!\n  yay!", 100, 100, 5,(200,200,255))])
    def test_display_text(self, text, x, y, scale,color):
        global i
        
        expected_images = []
        for j in range(4):
            expected = Image.open(
                os.path.join(self.abs_path, f"test_display_text_{j+1}.bmp")
            )
            expected_images.append(expected.load())

        text_area = label.Label(terminalio.FONT, text=text, auto_write=False, scale=scale,color=color)
        text_area.x = x
        text_area.y = y
        text_area.draw(show=True)

        print(i)
        print(expected_images)
        self.__test_image_equality(displayio.bmp_img, expected_images[i])
        i=i+1

    def __test_image_equality(self, image_1, image_2):
        for i in range(240):
            for j in range(240):
                pass
                assert image_1[j, i] == image_2[j, i]