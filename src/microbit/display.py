from . import constants as CONSTANTS
from .image import Image


class Display:
    def __init__(self):
        # State in the Python process
        self.__LEDs = [[0] * 5] * 5
        self.__on = True

    def scroll(self, message):
        raise NotImplementedError(CONSTANTS.NOT_IMPLEMENTED_ERROR)

    def show(self, value, delay=400, wait=True, loop=False, clear=False):
        if isinstance(value, Image):
            width = (
                value.width()
                if value.width() <= CONSTANTS.LED_WIDTH
                else CONSTANTS.LED_WIDTH
            )
            height = (
                value.height()
                if value.height() <= CONSTANTS.LED_HEIGHT
                else CONSTANTS.LED_HEIGHT
            )
            self.__print()
        elif isinstance(value, str):
            pass
        elif isinstance(value, float):
            pass
        elif isinstance(value, int):
            pass

    def get_pixel(self, x, y):
        if self.__valid_pos(x, y):
            return self.__LEDs[y][x]
        else:
            raise ValueError(CONSTANTS.INDEX_ERR)

    def set_pixel(self, x, y, value):
        if not self.__valid_pos(x, y):
            raise ValueError(CONSTANTS.INDEX_ERR)
        elif not self.__valid_brightness(value):
            raise ValueError(CONSTANTS.BRIGHTNESS_ERR)
        else:
            self.__LEDs[y][x] = value

    def clear(self):
        for y in range(CONSTANTS.LED_WIDTH):
            for x in range(CONSTANTS.LED_HEIGHT):
                self.__LEDs[y][x] = 0

    def on(self):
        self.__on = True

    def off(self):
        self.__on = False

    def is_on(self):
        return self.__on

    def read_light_level(self):
        raise NotImplementedError(CONSTANTS.NOT_IMPLEMENTED_ERROR)

    # Helpers
    def __valid_pos(self, x, y):
        return 0 <= x and x <= 4 and 0 <= y and y <= 4

    def __valid_brightness(self, value):
        return 0 <= value and value <= 9

    def __print(self):
        for i in range(5):
            print(self.__LEDs[i])
