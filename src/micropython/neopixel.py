from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


class NeoPixel:
    """
    This class is not implemented in the simulator.

    Initialise a new strip of ``n`` number of neopixel LEDs controlled via pin
    ``pin``. Each pixel is addressed by a position (starting from 0). Neopixels
    are given RGB (red, green, blue) values between 0-255 as a tuple. For
    example, ``(255,255,255)`` is white.
    """

    def __init__(self, pin, n):
        utils.print_for_unimplemented_functions(NeoPixel.__init__.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_NEOPIXEL)

    def clear(self):
        """
        Clear all the pixels.
        """
        utils.print_for_unimplemented_functions(NeoPixel.clear.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_NEOPIXEL)

    def show(self):
        """
        Show the pixels. Must be called for any updates to become visible.
        """
        utils.print_for_unimplemented_functions(NeoPixel.show.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_NEOPIXEL)
