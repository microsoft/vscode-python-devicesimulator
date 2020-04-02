# dummy class for references to board display to work
# https://learn.adafruit.com/arduino-to-circuitpython/the-board-module


import terminal_handler


class Display:
    def __init__(self):
        self.active_group = None
        self.terminal = terminal_handler.Terminal()

    def show(self, group=None):
        if group != self.active_group:
            self.active_group = group

            if group == None:
                self.terminal.draw()
                return

            # if the group has no attribute called
            # "draw", then it is liable for updating itself
            # when it calls show
            if hasattr(group, "draw"):
                group.draw()


DISPLAY = Display()

# deafult pin,
# shows that this could
# refer to the CPX
# or CLUE neopixel pin
NEOPIXEL = "D00"
