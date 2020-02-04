import time

from .button import Button
from .. import utils_microbit
from .display import Display


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.button_a = Button()
        self.button_b = Button()
        self.__start_time = time.time()
        self.__debug_mode = False
        self.display = Display()

    def sleep(self, n):
        time.sleep(n / 1000)

    def running_time(self):
        print(f"time. time: {time.time()}")
        return time.time() - self.__start_time

    def __get_LED_2D_array(self):
        return [[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0]]

    def __show(self):
        sendable_json = {
            "active_device" : "microbit",
            "microbit": {
                "leds": self.__get_LED_2D_array()
            }
        }
        utils_microbit.show(sendable_json, self.__debug_mode)
        
mb = MicrobitModel()
