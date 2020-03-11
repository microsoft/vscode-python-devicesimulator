def get_index(index, width):
    return index[0] + index[1] * width


class Bitmap:
    def __init__(self, width, height, color_count):
        self.width = width
        self.height = height
        if color_count > 255:
            raise ValueError("Cannot support that many colors")
        self.values = bytearray(width * height)

    def __setitem__(self, index, value):
        if isinstance(index, tuple):
            index = index[0] + index[1] * self.width
        self.values[index] = value

    def __getitem__(self, index):
        if isinstance(index, tuple):
            index = index[0] + index[1] * self.width
        return self.values[index]

    def __len__(self):
        return self.width * self.height

    def draw(self, bmp, x, y, w, h, pixel_shader, scale):
        for i in range(h):
            for j in range(w):
                for i_new in range(scale):
                    for j_new in range(scale):
                        try:

                            if (
                                x * scale + (j * scale) + j_new >= 0
                                and y + (i * scale) + i_new >= 0
                            ):
                                pix = None
                                if self[j, i] > 0:
                                    if not pixel_shader.contents[1].transparent:
                                        pix = pixel_shader[1]
                                else:
                                    if not pixel_shader.contents[0].transparent:
                                        pix = pixel_shader[0]
                                if pix:
                                    bmp[
                                        x * scale + (j * scale) + j_new,
                                        y + (i * scale) + i_new,
                                    ] = pix
                        except IndexError:
                            continue

        # self.width = new_width
        # self.height = new_height
        # self.values = new_values


class Group:
    def __init__(self, max_size, scale=1):
        self.contents = []
        self.max_size = max_size
        self.scale = scale

    def append(self, item):
        self.contents.append(item)

    def draw(self, bmp, x=0, y=0, scale=None):
        try:
            if isinstance(self.anchored_position, tuple):
                x = self.anchored_position[0]
                y = self.anchored_position[1]
        except AttributeError:
            pass
        if scale is None:
            scale = self.scale
        for idx, elem in enumerate(self.contents):
            elem.draw(bmp, x, y, self.scale)
            # try:
            #     y = y+elem.tile_height
            # except AttributeError:
            #     y = y+elem.height


class GroupItem:
    def draw(self, bmp, x, y, scale):
        pass


class TileGrid(GroupItem):
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

    def draw(self, bmp, x, y, scale):
        self.bitmap.draw(
            bmp=bmp,
            x=self.x + x,
            y=self.y + y,
            w=self.tile_width,
            h=self.tile_height,
            pixel_shader=self.pixel_shader,
            scale=scale,
        )


class Palette:
    def __init__(self, color_count):
        self.color_count = color_count
        self.contents = []

        for i in range(self.color_count):
            self.contents.append(ColorType((0, 0, 0)))

    def __getitem__(self, index):
        return self.contents[index].get()

    def __setitem__(self, index, value):
        self.contents[index] = ColorType(value)

    def make_transparent(self, index):
        if self.contents[index]:
            self.contents[index].transparent = True

    def make_opaque(self, index):
        if self.contents[index]:
            self.contents[index].transparent = False


class ColorType:
    def __init__(self, rgb888):
        self.rgb888 = rgb888
        self.transparent = False

    def get(self):
        return self.rgb888

