import copy
import time
import threading

from . import constants as CONSTANTS
from .image import Image
from .. import shim


class Display:
    # The implementation based off of https://github.com/bbcmicrobit/micropython/blob/master/docs/display.rst.

    def __init__(self):
        self.__image = Image()
        self.__on = True
        self.__blank_image = Image()
        self.__lock = threading.Lock()
        self.__current_pid = None

    def scroll(self, value, delay=150, wait=True, loop=False, monospace=False):
        if not wait:
            thread = threading.Thread(
                target=self.scroll, args=(value, delay, True, loop, monospace)
            )
            thread.start()
            return

        # Set current_pid to the thread's identifier
        self.__lock.acquire()
        self.__current_pid = threading.get_ident()
        self.__lock.release()

        if isinstance(value, (str, int, float)):
            value = str(value)
        else:
            raise TypeError(f"can't convert {type(value)} object to str implicitly")

        letters = []
        for c in value:
            if monospace:
                letters.append(Display.__get_image_from_char(c))
                letters.append(
                    Image(CONSTANTS.SPACE_BETWEEN_LETTERS_WIDTH, CONSTANTS.LED_HEIGHT)
                )
            else:
                if c == " ":
                    letters.append(
                        Image(CONSTANTS.WHITESPACE_WIDTH, CONSTANTS.LED_HEIGHT)
                    )
                else:
                    letters.append(
                        Display.__strip_unlit_columns(Display.__get_image_from_char(c))
                    )
                    letters.append(
                        Image(
                            CONSTANTS.SPACE_BETWEEN_LETTERS_WIDTH, CONSTANTS.LED_HEIGHT,
                        )
                    )
        appended_image = Display.__create_scroll_image(letters)

        while True:
            # Show the scrolled image one square at a time.
            for x in range(appended_image.width() - CONSTANTS.LED_WIDTH + 1):
                self.__image.blit(
                    appended_image, x, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT
                )
                # If show or scroll is called again, there will be a different pid and break
                self.__lock.acquire()
                if self.__current_pid != threading.get_ident():
                    break
                self.__lock.release()

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

        # Set current_pid to the thread's identifier
        self.__lock.acquire()
        self.__current_pid = threading.get_ident()
        self.__lock.release()

        images = []
        use_delay = False
        if isinstance(value, Image):
            images.append(value.crop(0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT))
        elif isinstance(value, (str, int, float)):
            chars = list(str(value))
            for c in chars:
                images.append(Display.__get_image_from_char(c))
            if len(chars) > 1:
                use_delay = True
        else:
            # Check if iterable
            try:
                _ = iter(value)
            except TypeError as e:
                raise e

            for elem in value:
                if isinstance(elem, Image):
                    images.append(
                        elem.crop(0, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT)
                    )
                elif isinstance(elem, str) and len(elem) == 1:
                    images.append(Display.__get_image_from_char(elem))
                # If elem is not char or image, break without iterating through rest of list
                else:
                    break
            use_delay = True

        while True:
            for image in images:
                self.__image = image
                if use_delay:
                    time.sleep(delay / 1000)
                # If show or scroll is called again, there will be a different pid and break
                self.__lock.acquire()
                if self.__current_pid != threading.get_ident():
                    break
                self.__lock.release()
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

    def __get_array(self):
        if self.is_on():
            return copy.deepcopy(self.__image._Image__LED)
        else:
            return self.__blank_image._Image__LED

    @staticmethod
    def __get_image_from_char(c):
        # If c is not between the ASCII alphabet we cover, make it a question mark
        if ord(c) < CONSTANTS.ASCII_START or ord(c) > CONSTANTS.ASCII_END:
            c = "?"
        offset = (ord(c) - CONSTANTS.ASCII_START) * CONSTANTS.LED_WIDTH
        representative_bytes = CONSTANTS.ALPHABET[
            offset : offset + CONSTANTS.LED_HEIGHT
        ]
        return Image(Display.__convert_bytearray_to_image_str(representative_bytes))

    # Removes columns that are not lit
    @staticmethod
    def __strip_unlit_columns(image):
        min_index = CONSTANTS.LED_WIDTH - 1
        max_index = 0
        for row in image._Image__LED:
            for index, bit in enumerate(row):
                if bit > 0:
                    min_index = min(min_index, index)
                    max_index = max(max_index, index)
        return image.crop(min_index, 0, max_index - min_index + 1, CONSTANTS.LED_HEIGHT)

    # This method is different from Image's __bytes_to_array.
    # This one requires a conversion from binary of the ALPHABET constant to an image.
    @staticmethod
    def __convert_bytearray_to_image_str(byte_array):
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
                        sub_arr.insert(0, int(bit) * CONSTANTS.BRIGHTNESS_MAX)
                    else:
                        break
                # Add 0s to the front until the list is 5 long
                while len(sub_arr) < 5:
                    sub_arr.insert(0, 0)
            arr.append(sub_arr)
        image_str = ""
        for row in arr:
            for elem in row:
                image_str += str(elem)
            image_str += ":"
        return image_str

    @staticmethod
    def __insert_blank_column(image):
        for row in image._Image__LED:
            row.append(0)

    @staticmethod
    def __create_scroll_image(images):
        blank_5x5_image = Image()
        front_of_scroll_image = Image(4, 5)
        images.insert(0, front_of_scroll_image)

        scroll_image = Image._Image__append_images(images)
        end_of_scroll_image = Image()
        # Insert columns of 0s until the ending is a 5x5 blank
        end_of_scroll_image.blit(
            scroll_image,
            scroll_image.width() - CONSTANTS.LED_WIDTH,
            0,
            CONSTANTS.LED_WIDTH,
            CONSTANTS.LED_HEIGHT,
        )
        while not Image._Image__same_image(end_of_scroll_image, blank_5x5_image):
            Display.__insert_blank_column(scroll_image)
            end_of_scroll_image.blit(
                scroll_image,
                scroll_image.width() - CONSTANTS.LED_WIDTH,
                0,
                CONSTANTS.LED_WIDTH,
                CONSTANTS.LED_HEIGHT,
            )

        return scroll_image
