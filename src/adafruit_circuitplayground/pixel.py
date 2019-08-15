# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import json
import sys
from . import constants as CONSTANTS
from . import utils


class Pixel:
    def __init__(self, state, debug_mode=False):
        self.__state = state
        self.auto_write = True
        self.__debug_mode = debug_mode

    def show(self):
        # Send the state to the extension so that React re-renders the Webview
        utils.show(self.__state, self.__debug_mode)

    def __show_if_auto_write(self):
        if self.auto_write:
            self.show()

    def __set_debug_mode(self, debug_mode):
        self.__debug_mode = debug_mode

    def __getitem__(self, index):
        if type(index) is not slice:
            if not self.__valid_index(index):
                raise IndexError(CONSTANTS.INDEX_ERROR)
        return self.__state['pixels'][index]

    def __setitem__(self, index, val):
        is_slice = False
        if type(index) is slice:
            is_slice = True
        else:
            if not self.__valid_index(index):
                raise IndexError(CONSTANTS.INDEX_ERROR)
        self.__state['pixels'][index] = self.__extract_pixel_value(
            val, is_slice)
        self.__show_if_auto_write()

    def __iter__(self):
        yield from self.__state["pixels"]

    def __enter__(self):
        return self

    def __repr__(self):
        return "[" + ", ".join([str(x) for x in self]) + "]"

    def __len__(self):
        return len(self.__state["pixels"])

    def __valid_index(self, index):
        return type(index) is int and index >= -len(self.__state['pixels']) and index < len(self.__state['pixels'])

    def fill(self, val):
        for index in range(len(self.__state['pixels'])):
            self.__state['pixels'][index] = self.__extract_pixel_value(val)
        self.__show_if_auto_write()

    def __extract_pixel_value(self, val, is_slice=False):
        extracted_values = []
        values = val
        if not is_slice:
            values = [val]
        # Type validation
        for v in values:
            if type(v) is list:
                rgb_value = tuple(v)
            elif type(v) is int:
                rgb_value = self.__hex_to_rgb(hex(v))
            elif type(v) is tuple:
                rgb_value = v
            else:
                raise ValueError(CONSTANTS.ASSIGN_PIXEL_TYPE_ERROR)
            # Values validation
            if len(rgb_value) != 3 or any(not self.__valid_rgb_value(pix) for pix in rgb_value):
                raise ValueError(CONSTANTS.VALID_PIXEL_ASSIGN_ERROR)
            extracted_values.append(rgb_value)

        return rgb_value if not is_slice else extracted_values

    def __hex_to_rgb(self, hexValue):
        if hexValue[0:2] == '0x' and len(hexValue) <= 8:
            hexToRgbValue = [0, 0, 0]
            hexColor = hexValue[2:].zfill(6)
            hexToRgbValue[0] = int(hexColor[0:2], 16)  # R
            hexToRgbValue[1] = int(hexColor[2:4], 16)  # G
            hexToRgbValue[2] = int(hexColor[4:6], 16)  # B

            return tuple(hexToRgbValue)
        else:
            raise ValueError(CONSTANTS.PIXEL_RANGE_ERROR)

    def __valid_rgb_value(self, pixValue):
        return type(pixValue) is int and pixValue >= 0 and pixValue <= 255

    @property
    def brightness(self):
        return self.__state['brightness']

    @brightness.setter
    def brightness(self, brightness):
        if not self.__valid_brightness(brightness):
            raise ValueError(CONSTANTS.BRIGHTNESS_RANGE_ERROR)
        self.__state['brightness'] = brightness
        self.__show_if_auto_write()

    def __valid_brightness(self, brightness):
        return (type(brightness) is float or type(brightness) is int) and (brightness >= 0 and brightness <= 1)
