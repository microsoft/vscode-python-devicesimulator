import base64
from io import BytesIO
from PIL import Image
import adafruit_display_text

from .tile_grid import TileGrid
from . import constants as CONSTANTS

import common
import board

# Group implementation loosely based on the
# displayio.Group class in Adafruit CircuitPython
# (with only the functions needed for the CLUE)

# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/displayio/Group.html


class Group:
    def __init__(self, max_size, scale=1, check_active_group_ref=True, auto_write=True):
        self.__check_active_group_ref = check_active_group_ref
        self.__auto_write = auto_write
        self.__contents = []
        self.max_size = max_size
        self.scale = scale
        self.parent = None

    @property
    def in_group(self):
        return self.parent != None

    def append(self, item):
        if len(self.__contents) == self.max_size:
            raise RuntimeError(CONSTANTS.GROUP_FULL)
        elif not isinstance(item, TileGrid) and not isinstance(item, Group):
            raise ValueError(CONSTANTS.INCORR_SUBCLASS)
        elif item.in_group:
            raise ValueError(CONSTANTS.LAYER_ALREADY_IN_GROUP)

        self.__contents.append(item)
        item.parent = self
        self.elem_changed()

    def elem_changed(self):
        # Ensure that this group is what the board is currently showing.
        # Otherwise, don't bother to draw it.
        if self.__auto_write:
            self.trigger_draw()

    def trigger_draw(self):
        # select the correct parent to draw from if necessary
        if self.__check_active_group_ref and board.DISPLAY.active_group == self:
            self.__draw()

        elif self.in_group:
            # If a sub-group is modified, propagate to top level to
            # see if one of the parents are the current active group.
            self.parent.elem_changed()

    def __getitem__(self, index):
        return self.__contents[index]

    def __setitem__(self, index, val):
        old_val = self.__contents[index]

        self.__contents[index] = val
        if old_val != val:
            self.elem_changed()

    def __draw(self, img=None, x=0, y=0, scale=None, show=True):
        # this function is not a part of the orignal implementation
        # it is what draws itself and its children and potentially shows it to the
        # frontend
        if img == None:
            img = Image.new(
                "RGBA",
                (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH),
                (0, 0, 0, 0),
            )
        if scale is None:
            scale = self.scale
        else:
            scale *= self.scale

        try:
            if isinstance(self, adafruit_display_text.label.Label):
                # adafruit_display_text has some positioning considerations
                # that need to be handled.

                # This was found manually, display must be positioned upwards
                # 1 unit (1 unit * scale = scale)
                y -= scale

                # Group is positioned against anchored_position (default (0,0)),
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
                img = elem._Group__draw(img=img, x=x, y=y, scale=scale, show=False,)
            else:
                img = elem._TileGrid__draw(img=img, x=x, y=y, scale=scale)

        # show should only be true to the highest parent group
        if show:
            self.__show(img)

        # return value only used if this is within another group
        return img

    def __show(self, img):
        # sends current img to the frontend
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
        item = self.__contents.pop(i)
        item.parent = None
        self.elem_changed()
        return item
