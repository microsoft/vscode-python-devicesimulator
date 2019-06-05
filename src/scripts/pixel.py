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
        self._state['pixels'][index] = max(val, (-1,-1,-1)) # Prevent negative values
