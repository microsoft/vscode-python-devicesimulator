from . import constants as CONSTANTS

# Bitmap implementation loosely based on the
# displayio.Bitmap class in Adafruit CircuitPython

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/Bitmap.html

# The colour of a certain pixel is interpreted
# within the TileGrid instance that the object
# lives within. Each pixel is an integer value
# that refers to the colours in the palette via index.


class Bitmap:
    '''
    .. currentmodule:: displayio
    
    `Bitmap` -- Stores values in a 2D array
    ==========================================================================

    Stores values of a certain size in a 2D array
    
    .. class:: Bitmap(width, height, value_count)
    
    Create a Bitmap object with the given fixed size. Each pixel stores a value that is used to
    index into a corresponding palette. This enables differently colored sprites to share the
    underlying Bitmap. value_count is used to minimize the memory used to store the Bitmap.

        :param int width: The number of values wide
        :param int height: The number of values high
        :param int value_count: The number of possible pixel values.
    
    '''
    def __init__(self, width, height, value_count=255):
        self.__width = width
        self.__height = height
        self.values = bytearray(width * height)

    @property
    def width(self):
        '''
        .. attribute:: width
        
           Width of the bitmap. (read only)
        
        '''
        return self.__width

    @property
    def height(self):
        '''
        .. attribute:: height
        
           Height of the bitmap. (read only)
        
        '''
        return self.__height

    def __setitem__(self, index, value):
        '''
        .. method:: __setitem__(index, value)
        
        Sets the value at the given index. The index can either be an x,y tuple or an int equal
        to ``y * width + x``.
    
        This allows you to::
        
            bitmap[0,1] = 3
        
        '''
        if isinstance(index, tuple):
            if index[0] >= self.width or index[1] >= self.height:
                raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

            index = index[0] + index[1] * self.width

        try:
            self.values[index] = value
        except IndexError:
            raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

    def __getitem__(self, index):
        '''
        .. method:: __getitem__(index)
        
            Returns the value at the given index. The index can either be an x,y tuple or an int equal
            to ``y * width + x``.
        
            This allows you to::
        
                print(bitmap[0,1])
        
        '''

        if isinstance(index, tuple):
            if index[0] >= self.width or index[1] >= self.height:
                raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)

            index = index[0] + index[1] * self.width

        try:
            return self.values[index]
        except IndexError:
            raise IndexError(CONSTANTS.PIXEL_OUT_OF_BOUNDS)
