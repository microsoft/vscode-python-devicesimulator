import json

class Pixel:
    def __init__(self, state):
        self._state = state

    def show(self):
        # Send the state to the extension so that React re-renders the Webview
        print(json.dumps(self._state))
    
    def __setitem__(self, index, val):
        self._state['pixels'][index] = val
