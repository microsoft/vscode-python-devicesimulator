import time

from .button import Button


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.button_a = Button()
        self.button_b = Button()
        self.start_time = time.time()

    def sleep(self, n):
        time.sleep(n / 1000)

    def running_time(self):
        return time.time() - self.start_time


mb = MicrobitModel()
