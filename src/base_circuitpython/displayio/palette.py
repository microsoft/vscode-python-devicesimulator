from .color_type import _ColorType
from . import constants as CONSTANTS

# Palette implementation loosely based on the
# displayio.Palette class in Adafruit CircuitPython
# (with only the functions needed for the CLUE)

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/Palette.html


class Palette:
    """
    `Palette` -- Stores a mapping from bitmap pixel palette_indexes to display colors
    =========================================================================================

    Map a pixel palette_index to a full color. Colors are transformed to the display's format internally to
    save memory.

    .. class:: Palette(color_count)

    Create a Palette object to store a set number of colors.

        :param int color_count: The number of colors in the Palette
    """

    def __init__(self, color_count):
        self.__color_count = color_count
        self.__contents = []

        # set all colours to black by default
        for i in range(self.__color_count):
            self.__contents.append(_ColorType((0, 0, 0)))

    def __setitem__(self, index, value):
        """
        .. method:: __setitem__(index, value)
    
            Sets the pixel color at the given index. The index should be an integer in the range 0 to color_count-1.
    
            The value argument represents a color, and can be from 0x000000 to 0xFFFFFF (to represent an RGB value).
            Value can be an int, bytes (3 bytes (RGB) or 4 bytes (RGB + pad byte)), bytearray,
            or a tuple or list of 3 integers.
    
            This allows you to::
    
                palette[0] = 0xFFFFFF                     # set using an integer
                palette[1] = b'\xff\xff\x00'              # set using 3 bytes
                palette[2] = b'\xff\xff\x00\x00'          # set using 4 bytes
                palette[3] = bytearray(b'\x00\x00\xFF')   # set using a bytearay of 3 or 4 bytes
                palette[4] = (10, 20, 30)                 # set using a tuple of 3 integers
        
        """
        if index >= self.__color_count:
            raise IndexError(CONSTANTS.PALETTE_OUT_OF_RANGE)

        self.__contents[index].rgb888 = value

    def __len__(self):
        """
        .. method:: __len__()
    
            Returns the number of colors in a Palette
        
        """
        return self.__color_count

    def make_transparent(self, index):
        """
        .. method:: make_transparent(palette_index)
        """
        self.__toggle_transparency(index, True)

    def make_opaque(self, index):
        """
        .. method:: make_opaque(palette_index)
        """
        self.__toggle_transparency(index, False)

    def __toggle_transparency(self, index, transparency):
        if self.__contents[index]:
            self.__contents[index].transparent = transparency
