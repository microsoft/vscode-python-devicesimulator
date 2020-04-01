# dummy class for references to board display to work
# https://learn.adafruit.com/arduino-to-circuitpython/the-board-module


import terminal_handler


class Display:
    def __init__(self):
        self.active_group = None
        self.terminal = terminal_handler.Terminal()

    def show(self, group=None):

        self.active_group = group

        # show can take a string if context is
        # not in the traditional Group + TileGrid style
        if not isinstance(group, str):
            if group == None:
                self.terminal.configure(no_verif=True)
            else:
                group.draw(show=True)


DISPLAY = Display()

# deafult pin,
# shows that this could
# refer to the CPX
# or CLUE neopixel pin
NEOPIXEL = "D00"
