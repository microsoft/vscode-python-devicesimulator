from . import constants as CONSTANTS

class Bitmap:
    def __init__(self, width, height, bits_per_value=24):
        self.width = width
        self.height = height
        self.values = bytearray(width * height)

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
