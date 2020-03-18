from PIL import Image
from . import constants as CONSTANTS

# TileGrid implementation loosely based on the
# displayio.TileGrid class in Adafruit CircuitPython
# (with only the functions needed for the CLUE)
# this version of the class only supports a single tile,
# therefore, get/set functionality is a bit different.

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/TileGrid.html


# Create a new black (default) image
img = Image.new(
    "RGB", (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH), "black"
)

# Create the pixel map
# All displayio classes can access this
# instance to read and write to the output image.
bmp_img = img.load()


class TileGrid:
    def __init__(
        self,
        bitmap,
        pixel_shader,
        default_tile=0,
        tile_width=None,
        tile_height=None,
        x=0,
        y=0,
        position=None,
    ):

        if tile_width is None:
            self.tile_width = bitmap.width
        else:
            self.tile_width = tile_width

        if tile_height is None:
            self.tile_height = bitmap.height
        else:
            self.tile_height = tile_height

        if position and isinstance(position, tuple):
            self.x = position[0]
            self.y = position[1]
        else:
            self.x = x
            self.y = y

        self.bitmap = bitmap
        self.pixel_shader = pixel_shader
        self.default_tile = default_tile
        self.in_group = False

    # setitem for an index simply gets the index of the bitmap
    # rather than the tile index
    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            if index[0] >= self.tile_width or index[1] >= self.tile_height:
                raise IndexError(CONSTANTS.TILE_OUT_OF_BOUNDS)

        self.bitmap[index] = value

    # getitem for an index simply gets the index of the bitmap
    # rather than the tile index
    def __getitem__(self, index):
        if isinstance(index, tuple):
            if index[0] >= self.tile_width or index[1] >= self.tile_height:
                raise IndexError(CONSTANTS.TILE_OUT_OF_BOUNDS)

        return self.bitmap[index]

    # methods that are not in the origin class:

    def draw(self, x, y, scale):

        # draw the current bitmap with
        # appropriate scale on the global bmp_img
        x = self.x * scale + x
        y = self.y * scale + y
        for i in range(self.tile_height):
            for j in range(self.tile_width):
                self.fill_pixel(i, j, x, y, scale)

    # helper method for drawing pixels on bmp_img
    # given the src, offset, and scale
    def fill_pixel(self, i, j, x, y, scale):
        for i_new in range(scale):
            for j_new in range(scale):
                try:
                    if x + (j * scale) + j_new >= 0 and y + (i * scale) + i_new >= 0:
                        if not self.pixel_shader._Palette__contents[
                            self.bitmap[j, i]
                        ].transparent:
                            bmp_img[
                                x + (j * scale) + j_new, y + (i * scale) + i_new,
                            ] = self.pixel_shader[self.bitmap[j, i]]
                except IndexError:
                    continue
