from . import constants as CONSTANTS


class Image:
    def __init__(self, *args, **kwargs):

        # Depending on the number of arguments
        # in constructor, it treat args differently.

        if len(args) == 0:
            # default constructor
            self.__LED = self.__string_to_array(CONSTANTS.BLANK)
        elif len(args) == 1:
            pattern = args[0]
            if isinstance(pattern, str):
                self.__LED = self.__string_to_array(pattern)
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

    def width(self):
        if len(self.__LED) > 0:
            return len(self.__LED[0])
        else:
            return 0

    def height(self):
        return len(self.__LED)

    def set_pixel(self, x, y, value):
        try:
            if not self.__valid_pos(x, y):
                raise ValueError(CONSTANTS.INDEX_ERR)
            elif not self.__valid_brightness(value):
                raise ValueError(CONSTANTS.BRIGHTNESS_ERR)
            else:
                self.__LED[y][x] = value
        except TypeError:
            print(CONSTANTS.COPY_ERR_MESSAGE)

    def get_pixel(self, x, y):
        if self.__valid_pos(x, y):
            return self.__LED[y][x]
        else:
            raise ValueError(CONSTANTS.INDEX_ERR)

    def shift_up(self, n):
        return self.__shift_vertical(n * -1)

    def shift_down(self, n):
        return self.__shift_vertical(n)

    def shift_right(self, n):
        return self.__shift_horizontal(n)

    def shift_left(self, n):
        return self.__shift_horizontal(n * -1)

    def crop(self, x, y, w, h):
        res = Image(w, h)
        res.blit(self, x, y, w, h)
        return res

    def copy(self):
        return Image(self.__create_string())

    # This inverts the brightness of each LED.
    # ie: pixel that is at brightness 4 would become brightness 5
    # and pixel that is at brightness 9 would become brightness 0.
    def invert(self):
        for y in range(0, self.height()):
            for x in range(0, self.width()):
                self.set_pixel(x, y, 9 - self.get_pixel(x, y))

    # This fills all LEDs with same brightness.
    def fill(self, value):
        for y in range(0, self.height()):
            for x in range(0, self.width()):
                self.set_pixel(x, y, value)

    # This transposes certain area (w x h) on src onto current image.
    def blit(self, src, x, y, w, h, xdest=0, ydest=0):

        if not src.__valid_pos(x, y):
            raise ValueError(CONSTANTS.INDEX_ERR)

        for count_y in range(0, h):
            for count_x in range(0, w):
                if self.__valid_pos(xdest + count_x, ydest + count_y):
                    if src.__valid_pos(x + count_x, y + count_y):
                        transfer_pixel = src.get_pixel(x + count_x, y + count_y)
                    else:
                        transfer_pixel = 0
                    self.set_pixel(xdest + count_x, ydest + count_y, transfer_pixel)

    # This adds two images (if other object is not an image, throws error).
    # The images must be the same size.
    def __add__(self, other):
        if not isinstance(other, Image):
            raise TypeError(
                CONSTANTS.UNSUPPORTED_ADD_TYPE + f"'{type(self)}', '{type(other)}'"
            )
        elif not (other.height() == self.height() and other.width() == self.width()):
            raise ValueError(CONSTANTS.SAME_SIZE_ERR)
        else:
            res = Image(self.width(), self.height())

            for y in range(0, self.height()):
                for x in range(0, self.width()):
                    sum_value = other.get_pixel(x, y) + self.get_pixel(x, y)
                    display_result = self.__limit_result(9, sum_value)
                    res.set_pixel(x, y, display_result)

            return res

    # This multiplies image by number (if other factor is not a number, it throws an error).
    def __mul__(self, other):
        try:
            float_val = float(other)
        except TypeError:
            raise TypeError(f"can't convert {type(other)} to float")

        res = Image(self.width(), self.height())

        for y in range(0, self.height()):
            for x in range(0, self.width()):
                product = self.get_pixel(x, y) * float_val
                res.set_pixel(x, y, self.__limit_result(9, product))

        return res

    # HELPER FUNCTIONS

    # This create 2D array of off LEDs with
    # width w and height h
    def __create_leds(self, w, h):
        arr = []
        for _ in range(0, h):
            sub_arr = []
            for _ in range(0, w):
                sub_arr.append(0)
            arr.append(sub_arr)

        return arr

    # This turns byte array to 2D array for LED field.
    def __bytes_to_array(self, width, height, byte_arr):
        bytes_translated = bytes(byte_arr)

        if not (len(bytes_translated)) == height * width:
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
    def __string_to_array(self, pattern):
        initial_array, max_subarray_len = self.__string_to_initial_array(pattern)

        # Fill in empty spaces in w x h matrix.
        for arr_y in initial_array:
            num_extra_spaces = max_subarray_len - len(arr_y)
            for _ in range(num_extra_spaces):
                arr_y.append(0)

        return initial_array

    def __string_to_initial_array(self, pattern):
        # The result may have spaces in the 2D array
        # and may unevent sub-array lengths
        arr = []
        sub_arr = []

        max_subarray_len = 0

        for elem in pattern:
            if elem == ":":
                if len(sub_arr) > max_subarray_len:
                    max_subarray_len = len(sub_arr)
                arr.append(sub_arr)
                sub_arr = []
            else:
                sub_arr.append(int(elem))

        if len(pattern) > 0 and not str(pattern)[-1] == ":":
            arr.append(sub_arr)

        return arr, max_subarray_len

    # This returns the limit if the result is too big.
    def __limit_result(self, limit, result):
        if result > limit:
            return limit
        else:
            return result

    def __valid_brightness(self, value):
        return value >= 0 and value <= 9

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
        for index_y in range(0, self.height()):
            ret_str += self.row_to_str(index_y)
        return ret_str

    def row_to_str(self, y):
        new_str = ""
        for x in range(0, self.width()):
            new_str = new_str + str(self.get_pixel(x, y))

        new_str = new_str + ":"

        return new_str
