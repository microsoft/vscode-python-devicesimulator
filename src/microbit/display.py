import time

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
        # wait has no effect
        while True:
            # Need to check if iterable
            # if iterable:
            #     for c in value:
            #         if isinstance(c, image):
            #             self.__image = value.crop(0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT)
            #         elif isinstance(c, str) and len(c) == 1:
            #             show letter
            #         else:
            #             break

            # if isinstance(value, Image):
            #     self.__image = value.crop(0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT)
            # elif isinstance(value, str):
            #     chars = list(value)
            #     for c in chars:
            #         if c < CONSTANTS.ASCII_START or c > ASCII_END:
            #             c = "?"
            #         offset = (c - ASCII_START) * 5
            #         representative_bytes = CONSTANTS.ALPHABET[offset : offset + 25]
            #         representative_image = Image(5, 5, representative_bytes)
            #         self.__image = representative_image
            #         time.sleep(delay / 1000)
            # elif isinstance(value, float):
            #     pass
            # elif isinstance(value, int):
            #     pass
            # if not loop:
            #     break
            break
        if clear:
            self.clear()

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
            print(self._Display__image._Image__LED[i])
