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
                self.terminal._Terminal__draw()
                return

            # if the group has no attribute called
            # "draw", then it is liable for updating itself
            # when it calls show
            if hasattr(group, "_Group__draw"):
                group._Group__draw()


DISPLAY = Display()

# default pin for neopixel,
# shows that this could
# refer to the CPX
# or CLUE neopixel pin
NEOPIXEL = "D00"

# ETC PINS WITHIN THE CLUE THAT MAY BE REFERENCED
# found by runing print(dir(board)) on clue
A0 = 0
A1 = 0
A2 = 0
A3 = 0
A4 = 0
A5 = 0
A6 = 0
A7 = 0

ACCELEROMETER_GYRO_INTERRUPT = 0

BUTTON_A = 0
BUTTON_B = 0

D0 = 0
D1 = 0
D2 = 0
D3 = 0
D4 = 0
D5 = 0
D6 = 0
D7 = 0
D8 = 0
D9 = 0
D10 = 0
D11 = 0
D12 = 0
D13 = 0
D14 = 0
D15 = 0
D16 = 0
D17 = 0
D18 = 0
D19 = 0
D20 = 0

I2C = 0

L = 0

MICROPHONE_CLOCK = 0
MICROPHONE_DATA = 0

MISO = 0
MOSI = 0

P0 = 0
P1 = 0
P2 = 0
P3 = 0
P4 = 0
P5 = 0
P6 = 0
P7 = 0
P8 = 0
P9 = 0
P10 = 0
P11 = 0
P12 = 0
P13 = 0
P14 = 0
P15 = 0
P16 = 0
P17 = 0
P18 = 0
P19 = 0
P20 = 0

PROXIMITY_LIGHT_INTERRUPT = 0

RX = 0
SCK = 0
SCL = 0
SDA = 0

SPEAKER = 0

SPI = 0

TFT_BACKLIGHT = 0
TFT_CS = 0
TFT_DC = 0
TFT_MOSI = 0
TFT_RESET = 0
TFT_SCK = 0

TX = 0

UART = 0

WHITE_LEDS = 0
