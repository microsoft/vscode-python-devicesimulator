import json
import sys

class Pixel:
    def __init__(self, state):
        self._state = state

    def show(self):
        # Send the state to the extension so that React re-renders the Webview
        print(json.dumps(self._state))
        sys.stdout.flush()
    
    def __setitem__(self, index, val):
        self._state['pixels'][index] = self.extractPixelValue(val) 

    def extractPixelValue(self, val):
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
            raise ValueError('The pixel value should  between 0 and 255 or an hexadecimal color between #000000 and #FFFFFF.')

        return val

    def fill(self, val):
        for index in range(len(self._state['pixels'])):
            self._state['pixels'][index] = self.extractPixelValue(val) 

    # Adapted from : https://pythonjunkie.wordpress.com/2012/07/19/convert-hex-color-values-to-rgb-in-python/
    def hex_to_rgb(self, hexValue):
        hexValue = hexValue.lstrip('#')
        valueLength = len(hexValue)
        if valueLength != 6:
            raise ValueError('The pixel hexadicimal color value should be in range #000000 and #FFFFFF.')
        return tuple(int(hexValue[i:i+valueLength//3], 16) for i in range(0, valueLength, valueLength//3))

    @property
    def brightness(self):
        return self._state['brightness']

    @brightness.setter
    def brightness(self, brightness):
        if not self.validBrightness(brightness):
            raise ValueError('The brightness value should be a number between 0 and 1.')
        self._state['brightness'] = brightness

    def validBrightness(self, brightness):
        return (type(brightness) is float or type(brightness) is int) and (brightness >= 0 and brightness <= 1)
