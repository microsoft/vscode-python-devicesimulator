import json
import sys

class Pixel:
    def __init__(self, state):
        self._state = state
        self._auto_write = False

    def show(self):
        # Send the state to the extension so that React re-renders the Webview
        print(json.dumps(self._state) + '\0', end='')
        sys.stdout.flush()

    def show_if_auto_write(self):
        if self._auto_write:
            self.show()
    
    def __setitem__(self, index, val):
        self._state['pixels'][index] = self.extract_pixel_value(val)
        self.show_if_auto_write()

    def __getitem__(self, index):
        return self._state['pixels'][index]

    def extract_pixel_value(self, val):
        # Convert HEX to RGB
        if type(val) is not tuple:
            val = self.hex_to_rgb(val)
        # Check it's a valid tuple
        if len(val) != 3:
            raise ValueError('The pixel value should be a tuple with 3 values between 0 and 255 or an hexadecimal color between #000000 and #FFFFFF.')
        # Convert to int
        val = tuple(map(int, val)) 
        # Prevent negative values
        if any(pix < 0 or pix > 255 for pix in val): 
            raise ValueError('The pixel value should between 0 and 255 or an hexadecimal color between #000000 and #FFFFFF.')

        return val

    def fill(self, val):
        for index in range(len(self._state['pixels'])):
            self._state['pixels'][index] = self.extract_pixel_value(val)
        self.show_if_auto_write()

    def hex_to_rgb(self, hexValue):
        hexValue = hexValue.lstrip('#')
        if len(hexValue) != 6:
            raise ValueError('The pixel hexadicimal color value should be in range #000000 and #FFFFFF.')
        # Convert the string hex to rgb tuple
        hexToRgbValue = []
        for i in range(0, len(hexValue), 2):
            hexColor = hexValue[i:i+2]
            hexToRgbValue.append(int(hexColor, 16))
        return tuple(hexToRgbValue)

    @property
    def brightness(self):
        return self._state['brightness']

    @brightness.setter
    def brightness(self, brightness):
        if not self.valid_brightness(brightness):
            raise ValueError('The brightness value should be a number between 0 and 1.')
        self._state['brightness'] = brightness
        self.show_if_auto_write()

    def valid_brightness(self, brightness):
        return (type(brightness) is float or type(brightness) is int) and (brightness >= 0 and brightness <= 1)
