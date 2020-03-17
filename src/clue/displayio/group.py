import base64
from io import BytesIO
from PIL import Image
from .tile_grid import bmp_img, img
from .tile_grid import TileGrid
from . import constants as CONSTANTS
import adafruit_display_text


class Group:
    def __init__(self, max_size, scale=1, auto_write=True):
        self.__contents = []
        self.max_size = max_size
        self.scale = scale
        self.auto_write = auto_write
        self.in_group = False

    def append(self, item):
        if len(self.__contents) == self.max_size:
            raise RuntimeError(CONSTANTS.GROUP_FULL)
        elif not isinstance(item, TileGrid) and not isinstance(item, Group):
            raise ValueError(CONSTANTS.INCORR_SUBCLASS)
        elif item.in_group:
            raise ValueError(CONSTANTS.LAYER_ALREADY_IN_GROUP)

        self.__contents.append(item)
        item.in_group = True
        if self.auto_write:
            self.draw(show=True)

    def draw(self, x=0, y=0, scale=None, show=False):

        if scale is None:
            scale = self.scale
        else:
            scale *= self.scale

        try:
            if isinstance(self, adafruit_display_text.label.Label):
                y -= scale
                x += self._anchor_point[0]
                y += self._anchor_point[1]
                if self._boundingbox is not None and self.anchored_position is not None:
                    x += self.anchored_position[0]
                    y += self.anchored_position[1]
        except AttributeError:
            pass

        for idx, elem in enumerate(self.__contents):
            if isinstance(elem, Group):
                elem.draw(x, y, scale, False)
            else:
                elem.draw(x, y, scale)

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

    def __len__(self):
        if not self.__contents:
            return 0
        else:
            return len(self.__contents)
