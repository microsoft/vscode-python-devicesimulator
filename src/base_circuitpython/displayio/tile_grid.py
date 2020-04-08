from PIL import Image, ImageColor
from . import constants as CONSTANTS
import threading
import queue
from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent

# TileGrid implementation loosely based on the
# displayio.TileGrid class in Adafruit CircuitPython
# (with only the functions needed for the CLUE)
# this version of the class only supports a single tile,
# therefore, get/set functionality is a bit different.

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/TileGrid.html


class TileGrid:
    """
    `TileGrid` -- A grid of tiles sourced out of one bitmap
    ==========================================================================

    Position a grid of tiles sourced from a bitmap and pixel_shader combination. Multiple grids
    can share bitmaps and pixel shaders.

    A single tile grid is also known as a Sprite.

    .. class:: TileGrid(bitmap, *, pixel_shader, width=1, height=1, tile_width=None, tile_height=None, default_tile=0, x=0, y=0)

    Create a TileGrid object. The bitmap is source for 2d pixels. The pixel_shader is used to
    convert the value and its location to a display native pixel color. This may be a simple color
    palette lookup, a gradient, a pattern or a color transformer.

    tile_width and tile_height match the height of the bitmap by default.

        :param displayio.Bitmap bitmap: The bitmap storing one or more tiles.
        :param displayio.Palette pixel_shader: The pixel shader that produces colors from values
        :param int width: Width of the grid in tiles.
        :param int height: Height of the grid in tiles.
        :param int tile_width: Width of a single tile in pixels. Defaults to the full Bitmap and must evenly divide into the Bitmap's dimensions.
        :param int tile_height: Height of a single tile in pixels. Defaults to the full Bitmap and must evenly divide into the Bitmap's dimensions.
        :param int default_tile: Default tile index to show.
        :param int x: Initial x position of the left edge within the parent.
        :param int y: Initial y position of the top edge within the parent.
    """

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
        self.x = None
        """
        .. attribute:: x
        
            X position of the left edge in the parent.
        """
        self.y = None
        """
        .. attribute:: y

            Y position of the top edge in the parent.
        """
        self.pixel_shader = pixel_shader
        """
        .. attribute:: pixel_shader

            The pixel shader of the tilegrid.
        """
        self.hidden = False
        """
        .. attribute:: hidden

            True when the TileGrid is hidden. This may be False even when a part of a hidden Group.
        """

        self.__bitmap = bitmap
        self.__tile_width = None
        self.__tile_height = None

        if tile_width is None:
            self.__tile_width = bitmap.width
        else:
            self.__tile_width = tile_width

        if tile_height is None:
            self.__tile_height = bitmap.height
        else:
            self.__tile_height = tile_height

        if position and isinstance(position, tuple):
            self.x = position[0]
            self.y = position[1]
        else:
            self.x = x
            self.y = y

        self.__parent = None

        # unimplemented features
        self.__flip_x = False
        self.__flip_y = False
        self.__transpose_xy = False

        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_TILE_GRID)

    @property
    def flip_x(self):
        """
        .. attribute:: flip_x

            If true, the left edge rendered will be the right edge of the right-most tile.
        """
        return self.__flip_x

    @flip_x.setter
    def flip_x(self, val):
        utils.print_for_unimplemented_functions(TileGrid.flip_x.__name_)
        self.__flip_x = val

    @property
    def flip_y(self):

        """
        .. attribute:: flip_y

            If true, the top edge rendered will be the bottom edge of the bottom-most tile.
        """
        return self.__flip_y

    @flip_y.setter
    def flip_y(self, val):
        utils.print_for_unimplemented_functions(TileGrid.flip_y.__name_)
        self.__flip_y = val

    @property
    def transpose_xy(self):

        """
        .. attribute:: transpose_xy

            If true, the TileGrid's axis will be swapped. When combined with mirroring, any 90 degree
            rotation can be achieved along with the corresponding mirrored version.
        """
        return self.__transpose_xy

    @transpose_xy.setter
    def transpose_xy(self, val):
        utils.print_for_unimplemented_functions(TileGrid.transpose_xy.__name_)
        self.__transpose_xy = val

    # setitem for an index simply gets the index of the bitmap
    # rather than the tile index
    def __setitem__(self, index, value):
        """
        .. method:: __setitem__(index, tile_index)
            Sets the tile index at the given index. The index can either be an x,y tuple or an int equal
            to ``y * width + x``.

            This allows you to::

                grid[0] = 10

            or::

                grid[0,0] = 10
        """
        if isinstance(index, tuple):
            if index[0] >= self.__tile_width or index[1] >= self.__tile_height:
                raise IndexError(CONSTANTS.TILE_OUT_OF_BOUNDS)

        self.__bitmap[index] = value

    # getitem for an index simply gets the index of the bitmap
    # rather than the tile index
    def __getitem__(self, index):
        """
        .. method:: __getitem__(index)
            Returns the tile index at the given index. The index can either be an x,y tuple or an int equal
            to ``y * width + x``.

            This allows you to::

                print(grid[0])
        """
        if isinstance(index, tuple):
            if index[0] >= self.__tile_width or index[1] >= self.__tile_height:
                raise IndexError(CONSTANTS.TILE_OUT_OF_BOUNDS)

        return self.__bitmap[index]

    @property
    def __in_group(self):
        return self.__parent != None

    # methods that are not in the origin class:

    def __draw(self, img, x, y, scale):
        # draw the current bitmap with
        # appropriate scale on the global bmp_img
        x = self.x * scale + x
        y = self.y * scale + y

        new_shape = self.__draw_group(
            x, y, 0, self.__tile_height, 0, self.__tile_width, scale
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

                curr_val = self.__bitmap[j, i]
                palette_obj = self.pixel_shader._Palette__contents[curr_val]

                transparent = palette_obj.transparent

                if not transparent and x_offset >= 0 and y_offset >= 0:

                    curr_colour = palette_obj.rgb888
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
