from pixel import Pixel

class Express:
    def __init__(self):
        # Our actual state
        self.state = {
            'pixels': [
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1),
                (-1, -1, -1)
            ],
            'button_a': False,
            'button_b': False,
        }

        self.pixels = Pixel(self.state)


cpx = Express()