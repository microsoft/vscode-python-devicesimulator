from PIL import Image

img = Image.new("RGB", (240, 240), "black")  # Create a new black image
bmp_img = img.load()  # Create the pixel map


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
