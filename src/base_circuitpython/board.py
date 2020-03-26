# dummy class for references to board display to work
# https://learn.adafruit.com/arduino-to-circuitpython/the-board-module


class Display:
    def __init__(self):
        pass

    def show(self, group):
        group.draw()


DISPLAY = Display()

# deafult pin,
# shows that this could
# refer to the CPX
# or CLUE neopixel pin
NEOPIXEL = "D00"
