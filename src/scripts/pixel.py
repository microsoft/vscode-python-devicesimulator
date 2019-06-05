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
        self._state['pixels'][index] = self.checkPixelValue(val) 

    def checkPixelValue(self, val):
        # Check it's a valid tuple
        if len(val) != 3:
            raise ValueError('The pixel value should be a tuple with 3 values.')
        # Convert to int
        val = tuple(map(int, val)) 
        # Prevent negative values
        if any(pix < 0 or pix > 255 for pix in val): 
            raise ValueError('The pixel value should be in range 0, 255.')

        return val

    def fill(self, val):
        for index in range(len(self._state['pixels'])):
            self._state['pixels'][index] = self.checkPixelValue(val) 
