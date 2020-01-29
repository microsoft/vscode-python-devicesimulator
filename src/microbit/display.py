from . import constants as CONSTANTS
from .image import Image
from . import code_processing_shim


class Display:
    def __init__(self):
        # State in the Python process
        self.__image = Image()
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
            self.__image = value
        elif isinstance(value, str):
            pass
        elif isinstance(value, float):
            pass
        elif isinstance(value, int):
            pass

    def get_pixel(self, x, y):
        return self.__image.get_pixel(x, y)

    def set_pixel(self, x, y, value):
        self.__image.set_pixel(x, y, value)

    def clear(self):
        self.__image = Image()

    def on(self):
        self.__on = True

    def off(self):
        self.__on = False

    def is_on(self):
        return self.__on

    def read_light_level(self):
        raise NotImplementedError(CONSTANTS.NOT_IMPLEMENTED_ERROR)

    def __print(self):
        print("")
        for i in range(5):
            print(self._Display__image[i])
