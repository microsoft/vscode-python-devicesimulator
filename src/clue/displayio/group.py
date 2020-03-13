import base64
from io import BytesIO
from PIL import Image
from .bitmap import bmp_img, img

class Group:
    def __init__(self, max_size, scale=1, auto_write=True):
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
            if isinstance(elem, Group):
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
