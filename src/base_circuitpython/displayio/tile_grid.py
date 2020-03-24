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


# Create a new black (default) image
img = Image.new(
    "RGBA", (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH), (0, 0, 0, 0)
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

        self.split_threading(x, y, 0, self.tile_height, 0, self.tile_width, scale)

    def split_threading(self, x, y, start_y, height, start_x, width, scale):

        target = self.draw_group

        # if the height or width is larger than 1/3 of the screen, use multithreading
        if height * scale > 80 or width * scale > 80:
            y_mid = int(height / 2)
            x_mid = int(width / 2)

            queues = []
            threads = []

            for i in range(4):
                queues.append(queue.Queue())

            offset_tuples = [
                (x, y),
                (x + x_mid * scale, y),
                (x, y + y_mid * scale),
                (x + x_mid * scale, y + y_mid * scale),
            ]

            thread_args = [
                offset_tuples[0] + (0, y_mid, 0, x_mid, scale, queues[0]),
                offset_tuples[1] + (0, y_mid, x_mid, width, scale, queues[1]),
                offset_tuples[2] + (y_mid, height, 0, x_mid, scale, queues[2]),
                offset_tuples[3] + (y_mid, height, x_mid, width, scale, queues[3]),
            ]

            for i in range(4):
                thread = threading.Thread(target=target, args=thread_args[i],)
                threads.append(thread)

            for t in threads:
                t.start()

            for t in threads:
                t.join()

            for idx, t in enumerate(threads):

                result = queues[idx].get()
                img.paste(
                    result, offset_tuples[idx], result,
                )

        else:
            q = queue.Queue()
            self.draw_group(x, y, 0, height, 0, width, scale, q)
            result = q.get()
            img.paste(result, (x, y), result)

    def draw_group(self, x, y, y_start, y_end, x_start, x_end, scale, q):
        height = y_end - y_start
        width = x_end - x_start

        this_img = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 0))
        this_bmp_img = this_img.load()

        for i in range(0, height):
            for j in range(0, width):
                x_offset = j * scale
                y_offset = i * scale

                curr_val = self.bitmap[x_start + j, y_start + i]
                transparent = self.pixel_shader._Palette__contents[curr_val].transparent

                if not transparent and x_offset >= 0 and y_offset >= 0:

                    x_max = min(x_offset + scale, width * scale)
                    y_max = min(y_offset + scale, height * scale)

                    curr_colour = self.pixel_shader[curr_val]
                    self.fill_pixel(
                        curr_colour, x_offset, y_offset, x_max, y_max, this_bmp_img,
                    )
        q.put(this_img)
        return this_img

    # helper method for drawing pixels on bmp_img
    # given the src, offset, and scale
    def fill_pixel(
        self, curr_colour, x_offset, y_offset, x_max, y_max, this_bmp_img,
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
