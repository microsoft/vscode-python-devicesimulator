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
        print("ok")
        self._state['pixels'] = self._pixels
        print(self._state)
    
    def __setitem__(self, index, val):
        self._pixels[index] = val
        print('setter')

class Express:
    def __init__(self):
        # Our actual state
        self.state = {
            'pixels': [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
            ],
            'button_a': False,
            'button_b': False,
        }

        self.pixels = Pixel(self.state)
        print("init")


cpx = Express()