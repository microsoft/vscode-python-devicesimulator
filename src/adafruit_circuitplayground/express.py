from .pixel import Pixel

class Express:
    def __init__(self):
        # State in the Python process
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
                (0, 0, 0)
            ],
            'brightness': 1.0,
            'button_a': False,
            'button_b': False,
        }

        self.pixels = Pixel(self.state)

cpx = Express()