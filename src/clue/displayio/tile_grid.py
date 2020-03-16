from PIL import Image
from . import constants as CONSTANTS

img = Image.new("RGB", (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH), "black")  # Create a new black image
bmp_img = img.load()  # Create the pixel map


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

    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            if index[0] >= self.tile_width or index[1] >= self.tile_height:
                raise IndexError(CONSTANTS.TILE_OUT_OF_BOUNDS)

        self.bitmap[index] = value

    def __getitem__(self, index):
        if isinstance(index, tuple):
            if index[0] >= self.tile_width or index[1] >= self.tile_height:
                raise IndexError(CONSTANTS.TILE_OUT_OF_BOUNDS)

        return self.bitmap[index]

    def draw(self, x, y, scale):
        x = self.x*scale + x
        y = self.y*scale + y
        for i in range(self.tile_height):
            for j in range(self.tile_width):
                self.fill_pixel(i, j, x, y, scale)

    def fill_pixel(self, i, j, x, y, scale):
        for i_new in range(scale):
            for j_new in range(scale):
                try:
                    if (
                        x + (j * scale) + j_new >= 0
                        and y  + (i * scale) + i_new >= 0
                    ):
                        if not self.pixel_shader._Palette__contents[
                            self.bitmap[j, i]
                        ].transparent:
                            bmp_img[
                                x + (j * scale) + j_new,
                                y + (i * scale) + i_new,
                            ] = self.pixel_shader[self.bitmap[j, i]]
                except IndexError:
                    continue
