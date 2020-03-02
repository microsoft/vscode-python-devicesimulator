from . import constants as CONSTANTS
from .producer_property import ProducerProperty
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


class Image:
    """
    If ``string`` is used, it has to consist of digits 0-9 arranged into
    lines, describing the image, for example::

        image = Image("90009:"
                      "09090:"
                      "00900:"
                      "09090:"
                      "90009")

    will create a 5×5 image of an X. The end of a line is indicated by a colon.
    It's also possible to use a newline (\\n) to indicate the end of a line
    like this::

        image = Image("90009\\n"
                      "09090\\n"
                      "00900\\n"
                      "09090\\n"
                      "90009")

    The other form creates an empty image with ``width`` columns and
    ``height`` rows. Optionally ``buffer`` can be an array of
    ``width``×``height`` integers in range 0-9 to initialize the image::

        Image(2, 2, b'\x08\x08\x08\x08')

    or::

        Image(2, 2, bytearray([9,9,9,9]))

    Will create a 2 x 2 pixel image at full brightness.

    .. note::

        Keyword arguments cannot be passed to ``buffer``.
    """

    # Attributes assigned (to functions) later;
    # having this here helps the pylint.
    HEART = None
    HEART_SMALL = None
    HAPPY = None
    SMILE = None
    SAD = None
    CONFUSED = None
    ANGRY = None
    ASLEEP = None
    SURPRISED = None
    SILLY = None
    FABULOUS = None
    MEH = None
    YES = None
    NO = None
    CLOCK12 = None
    CLOCK11 = None
    CLOCK10 = None
    CLOCK9 = None
    CLOCK8 = None
    CLOCK7 = None
    CLOCK6 = None
    CLOCK5 = None
    CLOCK4 = None
    CLOCK3 = None
    CLOCK2 = None
    CLOCK1 = None
    ARROW_N = None
    ARROW_NE = None
    ARROW_E = None
    ARROW_SE = None
    ARROW_S = None
    ARROW_SW = None
    ARROW_W = None
    ARROW_NW = None
    TRIANGLE = None
    TRIANGLE_LEFT = None
    CHESSBOARD = None
    DIAMOND = None
    DIAMOND_SMALL = None
    SQUARE = None
    SQUARE_SMALL = None
    RABBIT = None
    COW = None
    MUSIC_CROTCHET = None
    MUSIC_QUAVER = None
    MUSIC_QUAVERS = None
    PITCHFORK = None
    XMAS = None
    PACMAN = None
    TARGET = None
    TSHIRT = None
    ROLLERSKATE = None
    DUCK = None
    HOUSE = None
    TORTOISE = None
    BUTTERFLY = None
    STICKFIGURE = None
    GHOST = None
    SWORD = None
    GIRAFFE = None
    SKULL = None
    UMBRELLA = None
    SNAKE = None
    ALL_CLOCKS = None
    ALL_ARROWS = None

    # implementing image model as described here:
    # https://microbit-micropython.readthedocs.io/en/v1.0.1/image.html

    def __init__(self, *args, **kwargs):
        # Depending on the number of arguments
        # in constructor, it treat args differently.
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_CREATION)
        if len(args) == 0:
            # default constructor
            self.__LED = self.__string_to_square_array(CONSTANTS.BLANK_5X5)
        elif len(args) == 1:
            pattern = args[0]
            if isinstance(pattern, str):
                self.__LED = self.__string_to_square_array(pattern)
            else:
                raise TypeError("Image(s) takes a string")
        else:

            width = args[0]
            height = args[1]

            if width < 0 or height < 0:
                # This is not in original, but ideally,
                # image should fail non-silently
                raise ValueError(CONSTANTS.INDEX_ERR)

            if len(args) == 3:
                # This option is for potential third bytearray arguments
                byte_arr = args[2]
                self.__LED = self.__bytes_to_array(width, height, byte_arr)
            else:
                self.__LED = self.__create_leds(width, height)
        self.read_only = False

    def width(self):
        """
        Return the number of columns in the image.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        if len(self.__LED) > 0:
            return len(self.__LED[0])
        else:
            return 0

    def height(self):
        """
        Return the numbers of rows in the image.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        return len(self.__LED)

    def set_pixel(self, x, y, value):
        """
        Set the brightness of the pixel at column ``x`` and row ``y`` to the
        ``value``, which has to be between 0 (dark) and 9 (bright).

        This method will raise an exception when called on any of the built-in
        read-only images, like ``Image.HEART``.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        if self.read_only:
            raise TypeError(CONSTANTS.COPY_ERR_MESSAGE)
        elif not self.__valid_pos(x, y):
            raise ValueError(CONSTANTS.INDEX_ERR)
        elif not self.__valid_brightness(value):
            raise ValueError(CONSTANTS.BRIGHTNESS_ERR)
        else:
            self.__LED[y][x] = value

    def get_pixel(self, x, y):
        """
        Return the brightness of pixel at column ``x`` and row ``y`` as an
        integer between 0 and 9.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        if self.__valid_pos(x, y):
            return self.__LED[y][x]
        else:
            raise ValueError(CONSTANTS.INDEX_ERR)

    def shift_up(self, n):
        """
        Return a new image created by shifting the picture up by ``n`` rows.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        return self.__shift_vertical(-n)

    def shift_down(self, n):
        """
        Return a new image created by shifting the picture down by ``n`` rows.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        return self.__shift_vertical(n)

    def shift_right(self, n):
        """
        Return a new image created by shifting the picture right by ``n``
        columns.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        return self.__shift_horizontal(n)

    def shift_left(self, n):
        """
        Return a new image created by shifting the picture left by ``n``
        columns.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        return self.__shift_horizontal(-n)

    def crop(self, x, y, w, h):
        """
        Return a new image by cropping the picture to a width of ``w`` and a
        height of ``h``, starting with the pixel at column ``x`` and row ``y``.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        res = Image(w, h)
        res.blit(self, x, y, w, h)
        return res

    def copy(self):
        """
        Return an exact copy of the image.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        return Image(self.__create_string())

    # This inverts the brightness of each LED.
    # ie: Pixel that is at brightness 4 would become brightness 5
    # and pixel that is at brightness 9 would become brightness 0.
    def invert(self):
        """
        Return a new image by inverting the brightness of the pixels in the
        source image.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        for y in range(self.height()):
            for x in range(self.width()):
                self.set_pixel(x, y, CONSTANTS.BRIGHTNESS_MAX - self.get_pixel(x, y))

    # This fills all LEDs with same brightness.
    def fill(self, value):
        """
        Set the brightness of all the pixels in the image to the
        ``value``, which has to be between 0 (dark) and 9 (bright).

        This method will raise an exception when called on any of the built-in
        read-only images, like ``Image.HEART``.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        for y in range(self.height()):
            for x in range(self.width()):
                self.set_pixel(x, y, value)

    # This transposes a certain area (w x h) on src onto the current image.
    def blit(self, src, x, y, w, h, xdest=0, ydest=0):
        """
        Copy the rectangle defined by ``x``, ``y``, ``w``, ``h`` from the image ``src`` into
        this image at ``xdest``, ``ydest``.
        Areas in the source rectangle, but outside the source image are treated as having a value of 0.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        if not src.__valid_pos(x, y):
            raise ValueError(CONSTANTS.INDEX_ERR)

        for count_y in range(h):
            for count_x in range(w):
                if self.__valid_pos(xdest + count_x, ydest + count_y):
                    if src.__valid_pos(x + count_x, y + count_y):
                        transfer_pixel = src.get_pixel(x + count_x, y + count_y)
                    else:
                        transfer_pixel = 0
                    self.set_pixel(xdest + count_x, ydest + count_y, transfer_pixel)

    # This adds two images (if other object is not an image, throws error).
    # The images must be the same size.
    def __add__(self, other):
        """
        Create a new image by adding the brightness values from the two images for each pixel.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        if not isinstance(other, Image):
            raise TypeError(
                CONSTANTS.UNSUPPORTED_ADD_TYPE + f"'{type(self)}', '{type(other)}'"
            )
        elif not (other.height() == self.height() and other.width() == self.width()):
            raise ValueError(CONSTANTS.SAME_SIZE_ERR)
        else:
            res = Image(self.width(), self.height())

            for y in range(self.height()):
                for x in range(self.width()):
                    sum_value = other.get_pixel(x, y) + self.get_pixel(x, y)
                    display_result = min(CONSTANTS.BRIGHTNESS_MAX, sum_value)
                    res.set_pixel(x, y, display_result)

            return res

    # This multiplies image by number (if other factor is not a number, it throws an error).
    def __mul__(self, other):
        """
        Create a new image by multiplying the brightness of each pixel by n.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        try:
            float_val = float(other)
        except TypeError:
            raise TypeError(f"can't convert {type(other)} to float")

        res = Image(self.width(), self.height())

        for y in range(self.height()):
            for x in range(self.width()):
                product = self.get_pixel(x, y) * float_val
                res.set_pixel(x, y, min(CONSTANTS.BRIGHTNESS_MAX, product))

        return res

    def __repr__(self):
        """
        Get a compact string representation of the image.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        ret_str = "Image('"
        for index_y in range(self.height()):
            ret_str += self.__row_to_str(index_y)

        ret_str += "')"

        return ret_str

    def __str__(self):
        """
        Get a readable string representation of the image.
        """
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_OTHER)
        ret_str = "Image('\n"
        for index_y in range(self.height()):
            ret_str += "\t" + self.__row_to_str(index_y) + "\n"

        ret_str += "')"

        return ret_str

    # HELPER FUNCTIONS

    # This create 2D array of off LEDs with
    # width w and height h
    def __create_leds(self, w, h):
        arr = []
        for _ in range(h):
            sub_arr = []
            for _ in range(w):
                sub_arr.append(0)
            arr.append(sub_arr)

        return arr

    # This turns byte array to 2D array for LED field.
    def __bytes_to_array(self, width, height, byte_arr):
        bytes_translated = bytes(byte_arr)

        if not len(bytes_translated) == height * width:
            raise ValueError(CONSTANTS.INCORR_IMAGE_SIZE)

        arr = []
        sub_arr = []

        for index, elem in enumerate(bytes_translated):
            if index % width == 0 and index != 0:
                arr.append(sub_arr)
                sub_arr = []

            sub_arr.append(elem)

        arr.append(sub_arr)
        return arr

    # This converts string (with different rows separated by ":")
    # to 2d array arrangement.
    def __string_to_square_array(self, pattern):
        initial_array, max_subarray_len = self.__string_directly_to_array(pattern)

        # Fill in empty spaces in w x h matrix.
        for arr_y in initial_array:
            num_extra_spaces = max_subarray_len - len(arr_y)
            for _ in range(num_extra_spaces):
                arr_y.append(0)

        return initial_array

    def __string_directly_to_array(self, pattern):
        # The result may have spaces in the 2D array
        # and may uneven sub-array lengths
        arr = []
        sub_arr = []

        max_subarray_len = 0

        for elem in pattern:
            if elem == ":" or elem == "\n":
                if len(sub_arr) > max_subarray_len:
                    max_subarray_len = len(sub_arr)
                arr.append(sub_arr)
                sub_arr = []
            else:
                sub_arr.append(int(elem))

        if (
            len(pattern) > 0
            and not str(pattern)[-1] == ":"
            and not str(pattern)[-1] == "\n"
            and len(sub_arr) != 0
        ):
            if len(sub_arr) > max_subarray_len:
                max_subarray_len = len(sub_arr)
            arr.append(sub_arr)

        return arr, max_subarray_len

    def __valid_brightness(self, value):
        return value >= CONSTANTS.BRIGHTNESS_MIN and value <= CONSTANTS.BRIGHTNESS_MAX

    def __valid_pos(self, x, y):
        return x >= 0 and x < self.width() and y >= 0 and y < self.height()

    def __shift_vertical(self, n):
        res = Image(self.width(), self.height())

        if n > 0:
            # down
            res.blit(self, 0, 0, self.width(), self.height() - n, 0, n)
        else:
            # up
            if self.__valid_pos(0, abs(n)):
                res.blit(self, 0, abs(n), self.width(), self.height() - abs(n), 0, 0)

        return res

    def __shift_horizontal(self, n):
        res = Image(self.width(), self.height())
        if n > 0:
            # right
            res.blit(self, 0, 0, self.width() - n, self.height(), n, 0)
        else:
            # left
            if self.__valid_pos(abs(n), 0):
                res.blit(self, abs(n), 0, self.width() - abs(n), self.height(), 0, 0)

        return res

    def __create_string(self):
        ret_str = ""
        for index_y in range(self.height()):
            ret_str += self.__row_to_str(index_y)
        return ret_str

    def __row_to_str(self, y):
        new_str = ""
        for x in range(self.width()):
            new_str += str(self.get_pixel(x, y))

        new_str += ":"

        return new_str

    @staticmethod
    def __append_images(images):
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

    @staticmethod
    def __same_image(i1, i2):
        if i1.width() != i2.width() or i1.height() != i2.height():
            return False
        for y in range(i1.height()):
            for x in range(i1.width()):
                if i1.get_pixel(x, y) != i2.get_pixel(x, y):
                    return False
        return True


# This is for generating functions like Image.HEART
# that return a new read-only Image
def create_const_func(func_name):
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_IMAGE_STATIC)

    def func(*args):
        const_instance = Image(CONSTANTS.IMAGE_PATTERNS[func_name])
        const_instance.read_only = True
        return const_instance

    func.__name__ = func_name
    return ProducerProperty(func)


# for attributes like Image.ALL_CLOCKS
# that return tuples
def create_const_list_func(func_name):
    def func(*args):
        collection_names = CONSTANTS.IMAGE_TUPLE_LOOKUP[func_name]
        ret_list = []
        for image_name in collection_names:
            const_instance = Image(CONSTANTS.IMAGE_PATTERNS[image_name])
            const_instance.read_only = True
            ret_list.append(const_instance)

        return tuple(ret_list)

    func.__name__ = func_name
    return ProducerProperty(func)


for name in CONSTANTS.IMAGE_PATTERNS.keys():
    setattr(Image, name, create_const_func(name))

for name in CONSTANTS.IMAGE_TUPLE_LOOKUP.keys():
    setattr(Image, name, create_const_list_func(name))
