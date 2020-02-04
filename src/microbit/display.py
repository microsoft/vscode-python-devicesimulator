import time
import threading

from . import constants as CONSTANTS
from .image import Image
from . import code_processing_shim


class Display:
    def __init__(self):
        self.__image = Image()
        self.__on = True

    def scroll(self, value, delay=150, wait=True, loop=False, monospace=False):
        if not wait:
            thread = threading.Thread(
                target=self.scroll, args=(value, delay, True, loop, monospace)
            )
            thread.start()
            return
        while True:
            try:
                value = str(value)
            except TypeError as e:
                raise e
            letters = []
            for c in value:
                if monospace:
                    if c == " ":
                        letters.append(Image("000000:000000:000000:000000:000000"))
                    else:
                        letters.append(self.__get_image_from_char(c))
                        letters.append(Image("0:0:0:0:0:"))
                else:
                    if c == " ":
                        letters.append(Image("000:000:000:000:000"))
                    else:
                        letters.append(
                            self.__strip_image(self.__get_image_from_char(c))
                        )
                        letters.append(Image("0:0:0:0:0:"))
            appended_image = self.__create_scroll_image(letters)
            for x in range(appended_image.width() - CONSTANTS.LED_WIDTH + 1):
                self.__image.blit(
                    appended_image, x, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT
                )
                self.__print()
                time.sleep(delay / 1000)
            if not loop:
                break

    def show(self, value, delay=400, wait=True, loop=False, clear=False):
        if not wait:
            thread = threading.Thread(
                target=self.show, args=(value, delay, True, loop, clear)
            )
            thread.start()
            return
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
                    time.sleep(delay / 1000)
            else:
                # Check if iterable
                try:
                    _ = iter(value)
                except TypeError as e:
                    raise e

                for elem in value:
                    if isinstance(elem, Image):
                        self.__image = elem.crop(
                            0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT
                        )
                    elif isinstance(elem, str) and len(elem) == 1:
                        self.__image = self.__get_image_from_char(elem)
                    # If elem is not char or image, break without iterating through rest of list
                    else:
                        break
                    time.sleep(delay / 1000)
            if not loop:
                break
        if clear:
            self.clear()

    def get_pixel(self, x, y):
        return self.__image.get_pixel(x, y)

    def set_pixel(self, x, y, value):
        self.__image.set_pixel(x, y, value)

    def clear(self):
        self.__image = Image("00000:00000:00000:00000:00000:")

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
        for i in range(CONSTANTS.LED_HEIGHT):
            print(self._Display__image._Image__LED[i])

    def __get_image_from_char(self, c):
        # If c is not between the ASCII alphabet we cover, make it a question mark
        if ord(c) < CONSTANTS.ASCII_START or ord(c) > CONSTANTS.ASCII_END:
            c = "?"
        offset = (ord(c) - CONSTANTS.ASCII_START) * 5
        representative_bytes = CONSTANTS.ALPHABET[offset : offset + 5]
        return Image(self.__convert_bytearray_to_image_array(representative_bytes))

    def __strip_image(self, image):
        # Find column that contains first lit pixel. Call that column number: c1.
        # Go reverse, and find number of columns seen until we see the last lit pixel. Call that number: c2.
        min_index = CONSTANTS.LED_WIDTH - 1
        max_index = 0
        for row in image._Image__LED:
            for index, bit in enumerate(row):
                if bit > 0:
                    min_index = min(min_index, index)
                    max_index = max(max_index, index)
        return image.crop(min_index, 0, max_index - min_index + 1, CONSTANTS.LED_HEIGHT)

    def __convert_bytearray_to_image_array(self, byte_array):
        arr = []
        for b in byte_array:
            # Convert byte to binary
            b_as_bits = str(bin(b))[2:]
            sub_arr = []
            while len(sub_arr) < 5:
                # Iterate throught bits
                # If there is a 1 at b, then the pixel at column b is lit
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

    def __insert_blank_column(self, image):
        for row in image._Image__LED:
            row.append(0)

    def __create_scroll_image(self, images):
        blank_5x5_image = Image("00000:00000:00000:00000:00000:")
        front_image = blank_5x5_image.crop(
            0, 0, CONSTANTS.LED_WIDTH - 1, CONSTANTS.LED_HEIGHT
        )
        images.insert(0, front_image)

        scroll_image = self.__append_images(images)
        end_image = Image("00000:00000:00000:00000:00000:")
        # Insert columns of 0s until the ending is a 5x5 blank
        end_image.blit(
            scroll_image,
            scroll_image.width() - CONSTANTS.LED_WIDTH,
            0,
            CONSTANTS.LED_WIDTH,
            CONSTANTS.LED_HEIGHT,
        )
        while not self.__same_image(end_image, blank_5x5_image):
            self.__insert_blank_column(scroll_image)
            end_image.blit(
                scroll_image,
                scroll_image.width() - CONSTANTS.LED_WIDTH,
                0,
                CONSTANTS.LED_WIDTH,
                CONSTANTS.LED_HEIGHT,
            )

        return scroll_image

    def __same_image(self, i1, i2):
        if i1.width() != i2.width() or i1.height() != i2.height():
            return False
        for y in range(i1.height()):
            for x in range(i1.width()):
                if i1.get_pixel(x, y) != i2.get_pixel(x, y):
                    return False
        return True

    def __append_images(self, images):
        width = 0
        height = 0
        for image in images:
            width += image.width()
            height = max(height, image.height())
        res = Image(width, height)
        x_ind = 0
        for image in images:
            res.blit(image, 0, 0, image.width(), image.height(), xdest=x_ind)
            x_ind += image.width()
        return res
