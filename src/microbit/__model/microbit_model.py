import time

from .accelerometer import Accelerometer
from .button import Button
from .display import Display
from . import constants as CONSTANTS


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.accelerometer = Accelerometer()
        self.button_a = Button()
        self.button_b = Button()
        self.display = Display()

        self.__start_time = time.time()
        self.__temperature = 0

    def sleep(self, n):
        time.sleep(n / 1000)

    def running_time(self):
        print(f"time. time: {time.time()}")
        return time.time() - self.__start_time

    def temperature(self):
        return self.__temperature

    def __set_temperature(self, temperature):
        if temperature < CONSTANTS.MIN_TEMPERATURE:
            self.__temperature = CONSTANTS.MIN_TEMPERATURE
        elif temperature > CONSTANTS.MAX_TEMPERATURE:
            self.__temperature = CONSTANTS.MAX_TEMPERATURE
        else:
            self.__temperature = temperature


__mb = MicrobitModel()
