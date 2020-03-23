from PIL import Image
from . import constants as CONSTANTS
import threading

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

        if self.tile_height > 1 and self.tile_width > 1:
            y_mid = int(self.tile_height / 2)
            x_mid = int(self.tile_width / 2)
            thread_1 = threading.Thread(
                target=self.draw_group, args=(x, y, 0, y_mid, 0, x_mid, scale,),
            )
            thread_2 = threading.Thread(
                target=self.draw_group,
                args=(x, y, 0, y_mid, x_mid, self.tile_width, scale),
            )
            thread_3 = threading.Thread(
                target=self.draw_group,
                args=(x, y, y_mid, self.tile_height, 0, x_mid, scale),
            )
            thread_4 = threading.Thread(
                target=self.draw_group,
                args=(x, y, y_mid, self.tile_height, x_mid, self.tile_width, scale,),
            )
            thread_1.start()
            thread_2.start()
            thread_3.start()
            thread_4.start()

            thread_1.join()
            thread_2.join()
            thread_3.join()
            thread_4.join()
        else:
            self.draw_group(
                x, y, 0, self.tile_height, 0, self.tile_width, scale,
            )

    def draw_group(self, x, y, y_start, y_end, x_start, x_end, scale):
        # return
        for i in range(y_start, y_end):
            for j in range(x_start, x_end):
                self.fill_pixel(i, j, x, y, scale)

    # helper method for drawing pixels on bmp_img
    # given the src, offset, and scale
    def fill_pixel(self, i, j, x, y, scale):

        curr_val = self.bitmap[j, i]
        transparent = self.pixel_shader._Palette__contents[curr_val].transparent
        if not transparent:
            x_offset = x + (j * scale)
            y_offset = y + (i * scale)
            x_max = min(x_offset + scale, 240)
            y_max = min(y_offset + scale, 240)

            curr_colour = self.pixel_shader[curr_val]
            for new_y in range(y_offset, y_max):
                for new_x in range(x_offset, x_max):
                    if curr_val != bmp_img[new_x, new_y]:
                        bmp_img[new_x, new_y] = curr_colour
