from .color_type import ColorType

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