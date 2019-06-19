import json
import sys
from .pixel import Pixel
from . import utils



class Express:
    def __init__(self):
        # State in the Python process
        self.__state = {
            'brightness': 1.0,
            'button_a': False,
            'button_b': False,
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
          'red_led': False
        }

        self.pixels = Pixel(self.__state)

    @property
    def button_a(self):
        return self.state['button_a']

    @property
    def button_b(self):
        return self.state['button_b']

    @property
    def red_led(self):
        return self.__state['red_led']

    @red_led.setter
    def red_led(self, value):
        self.__state['red_led'] = bool(value)
        self.__show()

    def __show(self):
        utils.show(self.__state)

cpx = Express()
