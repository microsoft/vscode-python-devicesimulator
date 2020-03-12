
from PIL import Image,ImageColor
import base64
from io import BytesIO

img = Image.new("RGB", (240, 240), "black")  # Create a new black image
bmp_img = img.load()  # Create the pixel map

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

    def hex2rgb(self,hex):
        first_val = (hex & 0xFF0000) >> 16
        second_val = (hex & 0x00FF00) >> 8
        third_val = (hex & 0x0000FF)
        return (first_val,second_val,third_val)

    def draw(self, x, y, w, h, pixel_shader, scale):
        for i in range(h):
            for j in range(w):
                for i_new in range(scale):
                    for j_new in range(scale):
                        try:

                            if (
                                x * scale + (j * scale) + j_new >= 0
                                and y + (i * scale) + i_new >= 0
                            ):
                                if not pixel_shader.contents[self[j, i]].transparent:
                                    bmp_img[
                                        x * scale + (j * scale) + j_new,
                                        y + (i * scale) + i_new,
                                    ] = pixel_shader[self[j, i]]
                        except IndexError:
                            continue

        # self.width = new_width
        # self.height = new_height
        # self.values = new_values


class Group:
    def __init__(self, max_size, scale=1,auto_write=True):
        self.contents = []
        self.max_size = max_size
        self.scale = scale
        self.auto_write = auto_write

    def append(self, item):
        self.contents.append(item)
        if self.auto_write:
            self.draw(show=True)

    def draw(self, x=0, y=0, scale=None, show=False):
        try:
            if isinstance(self.anchored_position, tuple):
                x = self.anchored_position[0]
                y = self.anchored_position[1]
        except AttributeError:
            pass
        if scale is None:
            scale = self.scale
        for idx, elem in enumerate(self.contents):
            if isinstance(elem,Group):
                elem.draw(x, y, self.scale, False)
            else:
                elem.draw(x, y, self.scale)
        
        if show:
            self.show()
        
    def show(self):
        buffered = BytesIO()
        img.save(buffered, format="BMP")
        img.show()
        img_str = base64.b64encode(buffered.getvalue())

        sendable_json = {"display_base64": img_str}
        # common.utils.send_to_simulator(sendable_json, "CLUE")
        # f = open("demofile2.txt", "w")
        # f.write(str(img_str))
        # f.close()

class GroupItem:
    def draw(self, x, y, scale):
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

    def draw(self, x, y, scale):
        self.bitmap.draw(
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

