import base64
from io import BytesIO
from PIL import Image
import adafruit_display_text

from .tile_grid import TileGrid, bmp_img, img
from . import constants as CONSTANTS

import common

# Group implementation loosely based on the
# displayio.Group class in Adafruit CircuitPython
# (with only the functions needed for the CLUE)

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/Group.html


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

    def __getitem__(self, index):
        return self.__contents[index]

    def __setitem__(self, index, val):
        self.__contents[index] = val

    def draw(self, x=0, y=0, scale=None, show=False):
        # this function is not a part of the orignal implementation
        # it is what prints itself and its children to the frontend
        if scale is None:
            scale = self.scale
        else:
            scale *= self.scale

        try:
            if isinstance(self, adafruit_display_text.label.Label):
                # adafruit_display_text has some positioning considerations
                # that need to be handled.

                # found manually, display must be positioned upwards
                # 1 unit (1 unit * scale = scale)
                y -= scale

                # group is positioned against anchored_position (default (0,0)),
                # which is positioned against anchor_point

                x += self._anchor_point[0]
                y += self._anchor_point[1]
                if self._boundingbox is not None and self.anchored_position is not None:
                    x += self.anchored_position[0]
                    y += self.anchored_position[1]
        except AttributeError:
            pass

        for elem in self.__contents:
            if isinstance(elem, Group):
                elem.draw(x, y, scale, False)
            else:
                elem.draw(x, y, scale)

        if show:
            self.show()

    def show(self):
        # sends current bmp_img to the frontend
        buffered = BytesIO()
        img.save(buffered, format="BMP")
        byte_base64 = base64.b64encode(buffered.getvalue())
        img_str = str(byte_base64)[2:-1]

        sendable_json = {CONSTANTS.BASE_64: img_str}
        common.utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)

    def __len__(self):
        if not self.__contents:
            return 0
        else:
            return len(self.__contents)

    def pop(self, i=-1):
        return self.__contents.pop(i)
