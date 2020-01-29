from . import microbit_model
from . import constants as CONSTANTS
from . import display


class Image:
    def __init__(self, *args, **kwargs):
        print("args")
        print(args)
        # State in the Python process
        if len(args) == 0:
            self.__LED = CONSTANTS.BLANK
        elif len(args) == 1:
            pattern = args[0]
            if type(pattern) is str:
                self.__LED = self.convert_to_array(pattern)
            else:
                self.__LED = pattern
        else:

            width = args[0]
            height = args[1]

            if width < 0 or height < 0:
                raise Exception

            self.__LED = [[0] * width] * height

    def convert_to_array(self, pattern):
        arr = []
        sub_arr = []
        for elem in pattern:
            if elem == ":":
                arr.append(sub_arr)
                sub_arr = []
            else:
                sub_arr.append(int(elem))
        return arr


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
        if self.__valid_pos(x,y):
            return self.__LED[y][x]
        else:
            raise ValueError(CONSTANTS.INDEX_ERR)


    def copy(self):
        return Image(self.__LED)

    def invert(self, value):
        for y in range(0, self.height()):
            for x in range(0, self.width()):
                self.set_pixel(x, y, 9 - value)

    def fill(self, value):
        for y in range(0, self.height()):
            for x in range(0, self.width()):
                self.set_pixel(x, y, value)

    def width(self):
        if len(self.__LED):
            return len(self.__LED[0])
        else:
            return 0

    def height(self):
        return len(self.__LED)

    def blit(self, src, x, y, w, h, xdest=0, ydest=0):
        for count_y in range(0, h):
            for count_x in range(0, w):
                if (
                    ydest + count_y < self.height()
                    and xdest + count_x < self.width()
                    and y + count_y < src.height()
                    and x + count_x < src.width()
                ):
                    transfer_pixel = src.get_pixel(x + count_x, y + count_y)
                    self.set_pixel(xdest + count_x, ydest + count_y, transfer_pixel)

    def crop(self, x, y, w, h):
        res = Image(w, h)
        res.blit(self, x, y, w, h)
        return res

    
    def __valid_pos(self, x, y):
        return 0 <= x and x < self.width() and 0 <= y and y < self.height()

    def shift_vertical(self, n):

        res = Image(self.width(), self.height())
        if n > 0:
            # up
            res.blit(self, 0, n, self.width(), self.height() - n, 0, 0)
        else:
            # down
            res.blit(self, 0, 0, self.width(), self.height() - abs(n), 0, abs(n))

        return res

    def shift_horizontal(self, n):
        res = Image(self.width(), self.height())
        if n > 0:
            # right
            res.blit(self, 0, 0, self.width() - n, self.height(), n, 0)
        else:
            # left
            res.blit(self, n, 0, self.width() - n, self.height(), 0, 0)

        return res

    def shift_up(self, n):
        return self.shift_vertical(n)

    def shift_down(self, n):
        return self.shift_vertical(n * -1)

    def shift_right(self, n):
        return self.shift_horizontal(n)

    def shift_left(self, n):
        return self.shift_horizontal(n * -1)

    def row_to_str(self, y):
        new_str = ""
        for x in range(0, self.width()):
            new_str = new_str + str(self.get_pixel(x, y))

        new_str = new_str + ":"

        return new_str

    def limit_result(self, limit, result):
        if result > limit:
            return limit
        else:
            return result

    def __add__(self, other):
        if not (type(other) is Image):
            raise TypeError(
                f"unsupported types for __add__: '{type(self)}', '{type(other)}'"
            )
        elif not (other.height() == self.height() and other.width() == self.width()):
            raise ValueError("images must be the same size")
        else:
            res = Image(self.width(), self.height())

            for y in range(0, self.height()):
                for x in range(0, self.width()):
                    sum = other.get_pixel(x, y) + self.get_pixel(x, y)
                    display_result = self.limit_result(9, sum)
                    res.set_pixel(x, y, display_result)

            return res

    def __mul__(self, other):
        float_val = float(other)
        res = Image(self.width(), self.height())

        for y in range(0, self.height()):
            for x in range(0, self.width()):
                product = self.get_pixel(x, y) * float_val
                res.set_pixel(x, y, self.limit_result(9, product))

        return res

    def __valid_brightness(self, value):
        return 0 <= value and value <= 9

    