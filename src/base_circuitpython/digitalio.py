# dummy class for neopixel library to work

# original implementation docs for digitalio:
# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/digitalio/__init__.html


class DigitalInOut:
    def __init__(self, pin):
        self.pin = pin
        pass

    def deinit(self):
        pass


class Direction:
    OUTPUT = 0
