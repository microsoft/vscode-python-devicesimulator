import time

from .button import Button
from . import utils_microbit


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.button_a = Button()
        self.button_b = Button()
        self.__start_time = time.time()
        self.__debug_mode = False
        self.display = None

    def sleep(self, n):
        time.sleep(n / 1000)

    def running_time(self):
        print(f"time. time: {time.time()}")
        return time.time() - self.__start_time

    def __get_LED_2D_array(self):
        return [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]

    def __show(self):
        json_send = {
            "LEDs": self.__get_LED_2D_array()
        }

        utils_microbit.show(json_send, self.__debug_mode)

mb = MicrobitModel()
