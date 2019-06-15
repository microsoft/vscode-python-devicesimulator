import json
import sys
from .pixel import Pixel
from . import utils

class Express:
    def __init__(self):
        # State in the Python process
        self.state = {
            'pixels': [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0)
            ],
            'brightness': 1.0,
            'red_led': False,
            'button_a': False,
            'button_b': False,
        }

        self.pixels = Pixel(self.state)

    @property
    def red_led(self):
        return self.state['red_led']

    @red_led.setter
    def red_led(self, value):
        self.state['red_led'] = bool(value)
        self.__show()

    def __show(self):
        utils.show(self.state)

cpx = Express()