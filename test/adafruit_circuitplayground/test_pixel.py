import pytest

from src.adafruit_circuitplayground.pixel import Pixel

class TestPixel(object):

    def setup_method(self):
        self.pixel = Pixel()