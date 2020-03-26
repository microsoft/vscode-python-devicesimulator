from . import constants as CONSTANTS

# Bitmap implementation loosely based on the
# displayio.Bitmap class in Adafruit CircuitPython

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/Bitmap.html

# The colour of a certain pixel is interpreted
# within the TileGrid instance that the object
# lives within. Each pixel is an integer value
# that refers to the colours in the palette via index.


class Bitmap:
    def __init__(self, width, height, value_count=255):
        self.__width = width
        self.__height = height
        self.values = bytearray(width * height)

    @property
    def width(self):
        return self.__width

    @property
    def height(self):
        return self.__height

    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            if index[0] >= self.width or index[1] >= self.height:
                raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

            index = index[0] + index[1] * self.width

        try:
            self.values[index] = value
        except IndexError:
            raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

    def __getitem__(self, index):

        if isinstance(index, tuple):
            if index[0] >= self.width or index[1] >= self.height:
                raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

            index = index[0] + index[1] * self.width

        try:
            return self.values[index]
        except IndexError:
            raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

    def __len__(self):
        return self.width * self.height
