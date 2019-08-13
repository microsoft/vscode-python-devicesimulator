# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import json
import sys
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
        if not self.__valid_index(index):
            raise IndexError('The index is not a valid number, you can access the Neopixels from 0 to 9.')
        return self.__state['pixels'][index]
    
    def __setitem__(self, index, val):
        if not self.__valid_index(index):
            raise IndexError('The index is not a valid number, you can access the Neopixels from 0 to 9.')
        self.__state['pixels'][index] = self.__extract_pixel_value(val)
        self.__show_if_auto_write()

    def __valid_index(self, index):
        return type(index) is int and index >= -len(self.__state['pixels']) and index < len(self.__state['pixels'])

    def fill(self, val):
        for index in range(len(self.__state['pixels'])):
            self.__state['pixels'][index] = self.__extract_pixel_value(val)
        self.__show_if_auto_write()

    def __extract_pixel_value(self, val):
        # Type validation
        if type(val) is list:
            rgb_value = tuple(val)
        elif type(val) is int:
            rgb_value = self.__hex_to_rgb(hex(val))
        elif type(val) is tuple:
            rgb_value = val
        else:
            raise ValueError('The pixel color value type should be tuple, list or hexadecimal.')
        # Values validation
        if len(rgb_value) != 3 or any(not self.__valid_rgb_value(pix) for pix in rgb_value):
            raise ValueError('The pixel color value should be a tuple with three values between 0 and 255 or an hexadecimal color between 0x000000 and 0xFFFFFF.')

        return rgb_value

    def __hex_to_rgb(self, hexValue):
        if hexValue[0:2] == '0x' and len(hexValue) <= 8:
            hexToRgbValue = [0,0,0]
            hexColor = hexValue[2:].zfill(6)
            hexToRgbValue[0] = int(hexColor[0:2], 16) # R
            hexToRgbValue[1] = int(hexColor[2:4], 16) # G
            hexToRgbValue[2] = int(hexColor[4:6], 16) # B

            return tuple(hexToRgbValue)
        else:
            raise ValueError('The pixel hexadicimal color value should be in range #000000 and #FFFFFF.')

    def __valid_rgb_value(self, pixValue):
        return type(pixValue) is int and pixValue >= 0 and pixValue <= 255

    @property
    def brightness(self):
        return self.__state['brightness']

    @brightness.setter
    def brightness(self, brightness):
        if not self.__valid_brightness(brightness):
            raise ValueError('The brightness value should be a number between 0 and 1.')
        self.__state['brightness'] = brightness
        self.__show_if_auto_write()

    def __valid_brightness(self, brightness):
        return (type(brightness) is float or type(brightness) is int) and (brightness >= 0 and brightness <= 1)
