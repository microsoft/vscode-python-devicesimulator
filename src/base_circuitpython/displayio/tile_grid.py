from PIL import Image, ImageColor
from . import constants as CONSTANTS
import threading
import queue

# TileGrid implementation loosely based on the
# displayio.TileGrid class in Adafruit CircuitPython
# (with only the functions needed for the CLUE)
# this version of the class only supports a single tile,
# therefore, get/set functionality is a bit different.

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/TileGrid.html


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
        self.parent = None

    @property
    def in_group(self):
        return self.parent != None

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

    def __draw(self, img, x, y, scale):
        # draw the current bitmap with
        # appropriate scale on the global bmp_img
        x = self.x * scale + x
        y = self.y * scale + y

        new_shape = self.__draw_group(
            x, y, 0, self.tile_height, 0, self.tile_width, scale
        )

        img.paste(new_shape, (x, y), new_shape)
        return img

    def __draw_group(self, x, y, y_start, y_end, x_start, x_end, scale):
        height = y_end - y_start
        width = x_end - x_start

        this_img = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 0))
        this_img.putalpha(0)
        this_bmp_img = this_img.load()

        for i in range(y_start, y_end):
            for j in range(x_start, x_end):
                x_offset = j * scale
                y_offset = i * scale

                x_max = min(x_offset + scale, width * scale)
                y_max = min(y_offset + scale, height * scale)

                curr_val = self.bitmap[j, i]
                transparent = self.pixel_shader._Palette__contents[curr_val].transparent

                if not transparent and x_offset >= 0 and y_offset >= 0:

                    curr_colour = self.pixel_shader[curr_val]
                    self.__fill_pixel(
                        curr_val,
                        curr_colour,
                        x_offset,
                        y_offset,
                        scale,
                        x_max,
                        y_max,
                        this_bmp_img,
                    )

        return this_img

    # helper method for drawing pixels on bmp_img
    # given the src, offset, and scale
    def __fill_pixel(
        self,
        curr_val,
        curr_colour,
        x_offset,
        y_offset,
        scale,
        x_max,
        y_max,
        this_bmp_img,
    ):

        for new_y in range(y_offset, y_max):
            for new_x in range(x_offset, x_max):
                try:
                    if isinstance(curr_colour, tuple):
                        this_bmp_img[new_x, new_y] = curr_colour
                    else:
                        this_bmp_img[new_x, new_y] = (
                            (curr_colour >> 16) & 255,
                            (curr_colour >> 8) & 255,
                            (curr_colour) & 255,
                        )
                except IndexError:
                    pass
