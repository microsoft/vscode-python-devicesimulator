from .pixel import Pixel
from .led import LED

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
            'red_led': False,
            'button_a': False,
            'button_b': False,
        }

        self.pixels = Pixel(self.state)

cpx = Express()