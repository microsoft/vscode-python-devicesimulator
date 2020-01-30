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
            if isinstance(value, Image):
                self.__image = value.crop(
                    0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT
                )
            elif isinstance(value, (str, int, float)):
                if isinstance(value, str):
                    chars = list(value)
                else:
                    chars = list(str(value))
                for c in chars:
                    self.__image = self.__get_image_from_char(c)
                    self.__print()
                    time.sleep(delay / 1000)
            else:
                # Check if iterable
                try:
                    _ = iter(value)
                    for elem in value:
                        if isinstance(elem, Image):
                            self.__image = elem.crop(
                                0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT
                            )
                        elif isinstance(elem, str) and len(elem) == 1:
                            self.__image = self.__get_image_from_char(elem)
                        else:
                            break
                        self.__print()
                except TypeError:
                    pass  # Not iterable
            if not loop:
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

    # Helpers

    def __print(self):
        print("")
        for i in range(5):
            print(self._Display__image._Image__LED[i])

    def __get_image_from_char(self, c):
        # If c is not between the ASCII alphabet we cover, make it a question mark
        if ord(c) < CONSTANTS.ASCII_START or ord(c) > CONSTANTS.ASCII_END:
            c = "?"
        offset = (ord(c) - CONSTANTS.ASCII_START) * 5
        representative_bytes = CONSTANTS.ALPHABET[offset : offset + 5]
        return Image(self.__convert_bytearray_to_image_array(representative_bytes))

    def __convert_bytearray_to_image_array(self, byte_array):
        arr = []
        for b in byte_array:
            # Convert byte to binary
            b_as_bits = str(bin(b))[2:]
            sub_arr = []
            while len(sub_arr) < 5:
                # Iterate throught bits recursively
                # If there is a 1 at x, then the pixel at column x is lit
                for bit in b_as_bits[::-1]:
                    if len(sub_arr) < 5:
                        sub_arr.insert(0, int(bit) * CONSTANTS.MAX_BRIGHTNESS)
                    else:
                        break
                # Add 0s to the front until the list is 5 long
                while len(sub_arr) < 5:
                    sub_arr.insert(0, 0)
            arr.append(sub_arr)
        return arr
