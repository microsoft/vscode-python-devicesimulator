class Pixel:
    def __init__(self, state):
        self._pixels = [
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0),
            (0, 0, 0)
        ]
        self._state = state

    def show(self):
        # Should send a "message" to the extension so that React will know to re-render the Webview
        self._state['pixels'] = self._pixels
        print(self._state)
    
    def __setitem__(self, index, val):
        self._pixels[index] = val
