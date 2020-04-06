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
    '''
    `Group` -- Group together sprites and subgroups
    ==========================================================================

    Manage a group of sprites and groups and how they are inter-related.

    .. class:: Group(*, max_size=4, scale=1, x=0, y=0)
    Create a Group of a given size and scale. Scale is in one dimension. For example, scale=2
    leads to a layer's pixel being 2x2 pixels when in the group.
        :param int max_size: The maximum group size.
        :param int scale: Scale of layer pixels in one dimension.
        :param int x: Initial x position within the parent.
        :param int y: Initial y position within the parent.
    '''
    def __init__(self, max_size, scale=1, x=0,y=0,check_active_group_ref=True, auto_write=True):
        self.__check_active_group_ref = check_active_group_ref
        self.__auto_write = auto_write
        self.__contents = []
        self.__max_size = max_size
        self.scale = scale
        '''
            .. attribute:: scale

        Scales each pixel within the Group in both directions. For example, when scale=2 each pixel
        will be represented by 2x2 pixels.

        '''
        self.x = x
        '''
        .. attribute:: x

            X position of the Group in the parent.

        '''
        self.y = y
        '''
        .. attribute:: y

            Y position of the Group in the parent.
        '''
        self.__parent = None
        self.__hidden = False
        


    @property
    def hidden(self):
        '''
        .. attribute:: hidden

            True when the Group and all of it's layers are not visible. When False, the Group's layers
            are visible if they haven't been hidden.
        '''
        return self.__hidden

    @hidden.setter
    def hidden(self, val):
        changed = val != self.__hidden
        self.__hidden = val
        for elem in self.__contents:
            img = elem.hidden = val

        if changed:
            self.__elem_changed()

    def append(self, item):
        '''
        .. method:: append(layer)

            Append a layer to the group. It will be drawn above other layers.
        '''
        self.__prepare_for_add(item)
        self.__contents.append(item)
        self.__elem_changed()

    def insert(self, idx, item):
        '''
        .. method:: insert(index, layer)

            Insert a layer into the group.
        '''
        self.__prepare_for_add(item)
        self.__contents.insert(idx, item)
        self.__elem_changed()

    def index(self, layer):
        '''
        .. method:: index(layer)

            Returns the index of the first copy of layer. Raises ValueError if not found.
        '''
        for idx, elem in enumerate(self.__contents):
            if elem == layer:
                return idx

        return ValueError()

    def pop(self, i=-1):
        '''
        .. method:: pop(i=-1)

            Remove the ith item and return it.
        '''
        item = self.__contents.pop(i)
        self.__set_parent(item, None)
        self.__elem_changed()
        return item

    def remove(self, layer):
        '''
        .. method:: remove(layer)

            Remove the first copy of layer. Raises ValueError if it is not present.
        '''
        idx = self.index(layer)
        item = self.__contents[idx]

        self.__set_parent(item, None)
        self.__contents.pop(idx)
        self.__elem_changed()

    def __delitem__(self, index):
        '''
        .. method:: __delitem__(index)

            Deletes the value at the given index.

            This allows you to::

                del group[0]
        '''
        item = self.__contents[index]
        self.__set_parent(item, None)
        del self.__contents[index]
        self.__elem_changed()

    def __getitem__(self, index):
        '''
        .. method:: __getitem__(index)

            Returns the value at the given index.

            This allows you to::

                print(group[0])

        '''
        return self.__contents[index]

    def __setitem__(self, index, val):
        '''
        .. method:: __setitem__(index, value)

            Sets the value at the given index.

            This allows you to::

                group[0] = sprite
        '''
        old_val = self.__contents[index]

        self.__contents[index] = val
        if old_val != val:
            self.__elem_changed()

    def __len__(self):
        '''
        .. method:: __len__()

            Returns the number of layers in a Group
        '''
        if not self.__contents:
            return 0
        else:
            return len(self.__contents)

    @property
    def __in_group(self):
        return self.__parent != None

    def __prepare_for_add(self, item):
        if len(self.__contents) == self.__max_size:
            raise RuntimeError(CONSTANTS.GROUP_FULL)
        elif not isinstance(item, TileGrid) and not isinstance(item, Group):
            raise ValueError(CONSTANTS.INCORR_SUBCLASS)
        elif (isinstance(item, Group) and item._Group__in_group) or (
            isinstance(item, TileGrid) and item._TileGrid__in_group
        ):
            raise ValueError(CONSTANTS.LAYER_ALREADY_IN_GROUP)
        self.__set_parent(item, self)

    def __set_parent(self, item, val):
        if isinstance(item, TileGrid):
            item._TileGrid__parent = val
        else:
            item._Group__parent = val

    def __elem_changed(self):
        # Ensure that this group is what the board is currently showing.
        # Otherwise, don't bother to draw it.
        if self.__auto_write:
            self.__trigger_draw()

    def __trigger_draw(self):
        # select the correct parent to draw from if necessary
        if self.__check_active_group_ref and board.DISPLAY.active_group == self:
            self.__draw()

        elif self.__in_group:
            # If a sub-group is modified, propagate to top level to
            # see if one of the parents are the current active group.
            self.__parent._Group__elem_changed()

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
            if not elem.hidden:
                if isinstance(elem, Group):
                    img = elem._Group__draw(img=img, x=x+self.x, y=y+self.y, scale=scale, show=False,)
                else:
                    img = elem._TileGrid__draw(img=img, x=x+self.x, y=y+self.y, scale=scale)

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
