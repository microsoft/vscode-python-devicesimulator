import copy
import time
import threading

from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent
from . import constants as CONSTANTS
from .image import Image


class Display:
    # The implementation based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/display.html.

    def __init__(self):
        self.__image = Image()
        self.__on = True
        self.__light_level = 0
        self.__blank_image = Image()

        self.__current_pid = None
        self.__lock = threading.Lock()

    def scroll(self, value, delay=150, wait=True, loop=False, monospace=False):
        """
        Scrolls ``value`` horizontally on the display. If ``value`` is an integer or float it is
        first converted to a string using ``str()``. The ``delay`` parameter controls how fast
        the text is scrolling.

        If ``wait`` is ``True``, this function will block until the animation is
        finished, otherwise the animation will happen in the background.

        If ``loop`` is ``True``, the animation will repeat forever.

        If ``monospace`` is ``True``, the characters will all take up 5 pixel-columns
        in width, otherwise there will be exactly 1 blank pixel-column between each
        character as they scroll.

        Note that the ``wait``, ``loop`` and ``monospace`` arguments must be specified
        using their keyword.
        """
        if not wait:
            thread = threading.Thread(
                target=self.scroll, args=(value, delay, True, loop, monospace)
            )
            thread.start()
            return

        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_SCROLL)

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
                self.__lock.acquire()

                # If show or scroll is called again, there will be a different pid and break
                if self.__current_pid != threading.get_ident():
                    self.__lock.release()
                    break

                self.__image.blit(
                    appended_image, x, 0, CONSTANTS.LED_WIDTH, CONSTANTS.LED_HEIGHT
                )
                self.__lock.release()
                self.__update_client()

                Display.sleep_ms(delay)

            if not loop:
                break

    def show(self, value, delay=400, wait=True, loop=False, clear=False):
        """
        Display the ``image``.

        If ``value`` is a string, float or integer, display letters/digits in sequence.
        Otherwise, if ``value`` is an iterable sequence of images, display these images in sequence.
        Each letter, digit or image is shown with ``delay`` milliseconds between them.

        If ``wait`` is ``True``, this function will block until the animation is
        finished, otherwise the animation will happen in the background.

        If ``loop`` is ``True``, the animation will repeat forever.

        If ``clear`` is ``True``, the display will be cleared after the iterable has finished.

        Note that the ``wait``, ``loop`` and ``clear`` arguments must be specified
        using their keyword.
        """
        if not wait:
            thread = threading.Thread(
                target=self.show, args=(value, delay, True, loop, clear)
            )
            thread.start()
            return

        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_SHOW)

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
                self.__lock.acquire()

                # If show or scroll is called again, there will be a different pid and break
                if self.__current_pid != threading.get_ident():
                    self.__lock.release()
                    break

                self.__image = image
                self.__lock.release()
                self.__update_client()

                if use_delay:
                    Display.sleep_ms(delay)

            if not loop:
                break
        if clear:
            self.clear()

    def get_pixel(self, x, y):
        """
        Return the brightness of the LED at column ``x`` and row ``y`` as an
        integer between 0 (off) and 9 (bright).
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_OTHER)
        self.__lock.acquire()
        pixel = self.__image.get_pixel(x, y)
        self.__lock.release()
        return pixel

    def set_pixel(self, x, y, value):
        """
        Set the brightness of the LED at column ``x`` and row ``y`` to ``value``,
        which has to be an integer between 0 and 9.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_OTHER)
        self.__lock.acquire()
        self.__image.set_pixel(x, y, value)
        self.__lock.release()
        self.__update_client()

    def clear(self):
        """
        Set the brightness of all LEDs to 0 (off).
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_OTHER)
        self.__lock.acquire()
        self.__image = Image()
        self.__lock.release()
        self.__update_client()

    def on(self):
        """
        Use on() to turn on the display.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_OTHER)
        self.__on = True

    def off(self):
        """
        Use off() to turn off the display.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_OTHER)
        self.__on = False

    def is_on(self):
        """
        Returns ``True`` if the display is on, otherwise returns ``False``.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_DISPLAY_OTHER)
        return self.__on

    def read_light_level(self):
        """
        Use the display's LEDs in reverse-bias mode to sense the amount of light
        falling on the display.  Returns an integer between 0 and 255 representing
        the light level, with larger meaning more light.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_LIGHT_LEVEL)
        return self.__light_level

    def __set_light_level(self, level):
        if level < CONSTANTS.MIN_LIGHT_LEVEL or level > CONSTANTS.MAX_LIGHT_LEVEL:
            raise ValueError(CONSTANTS.INVALID_LIGHT_LEVEL_ERR)
        else:
            self.__light_level = level

    # Helpers

    def __get_array(self):
        self.__lock.acquire()
        if self.is_on():
            leds = copy.deepcopy(self.__image._Image__LED)
        else:
            leds = self.__blank_image._Image__LED
        self.__lock.release()
        return leds

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

    def __update_client(self):
        sendable_json = {"leds": self.__get_array()}
        utils.send_to_simulator(sendable_json, CONSTANTS.MICROBIT)

    def __update_light_level(self, new_light_level):
        if new_light_level is not None:
            previous_light_level = self.read_light_level()
            if new_light_level != previous_light_level:
                self.__set_light_level(new_light_level)

    @staticmethod
    def sleep_ms(ms):
        time.sleep(ms / 1000)
