# The MIT License (MIT)
#
# Copyright (c) 2020 Kattni Rembor for Adafruit Industries
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
"""
`adafruit_clue`
================================================================================

A high level library representing all the features of the Adafruit CLUE.


* Author(s): Kattni Rembor

Implementation Notes
--------------------

**Hardware:**

.. "* `Adafruit CLUE - nRF52840 Express with Bluetooth LE <https://www.adafruit.com/product/4500>`_"

**Software and Dependencies:**

* Adafruit CircuitPython firmware for the supported boards:
  https://github.com/adafruit/circuitpython/releases

 * Adafruit's Bus Device library: https://github.com/adafruit/Adafruit_CircuitPython_BusDevice
 * Adafruit's Register library: https://github.com/adafruit/Adafruit_CircuitPython_Register
 * Adafruit's LSM6DS CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_LSM6DS
 * Adafruit's LIS3MDL CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_LIS3MDL
 * Adafruit's APDS9960 CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_APDS9960
 * Adafruit's BMP280 CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_BMP280
 * Adafruit's SHT31D CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_SHT31D
 * Adafruit's NeoPixel CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_NeoPixel
"""

from common.telemetry_events import TelemetryEvent
from common.telemetry import telemetry_py
from common import utils
from base_circuitpython import base_cp_constants as CONSTANTS
import neopixel
import time
import array
import math
from PIL import Image
import pathlib
import sys
import os
import board

abs_path = pathlib.Path(__file__).parent.absolute()
sys.path.insert(0, os.path.join(abs_path))

# REVISED VERSION OF THE ADAFRUIT CLUE LIBRARY FOR DSX

__version__ = "0.0.0-auto.0"
__repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_CLUE.git"


class _ClueSimpleTextDisplay:
    """Easily display lines of text on CLUE display."""

    def __init__(
        self,
        title=None,
        title_color=0xFFFFFF,
        title_scale=1,  # pylint: disable=too-many-arguments
        text_scale=1,
        font=None,
        colors=None,
    ):
        import displayio
        import terminalio
        from adafruit_display_text import label

        if not colors:
            colors = (
                Clue.VIOLET,
                Clue.GREEN,
                Clue.RED,
                Clue.CYAN,
                Clue.ORANGE,
                Clue.BLUE,
                Clue.MAGENTA,
                Clue.SKY,
                Clue.YELLOW,
                Clue.PURPLE,
            )

        self._display = board.DISPLAY
        self._colors = colors
        self._label = label
        self._font = terminalio.FONT
        if font:
            self._font = font
        self.text_group = displayio.Group(max_size=20, scale=text_scale)
        self.text_scale = text_scale
        if title:
            # Fail gracefully if title is longer than 60 characters.
            if len(title) > 60:
                raise ValueError("Title must be 60 characters or less.")

            title = label.Label(
                self._font,
                text=title,
                max_glyphs=60,
                color=title_color,
                scale=title_scale,
            )
            title.x = 0
            title.y = 8
            self._y = title.y + 18 * text_scale

            self.text_group.append(title)
        else:
            self._y = 3

        self._lines = []
        for num in range(1):
            self._lines.append(self.add_text_line(color=colors[num % len(colors)]))

    def __getitem__(self, item):
        """Fetch the Nth text line Group"""
        if len(self._lines) - 1 < item:
            for _ in range(item - (len(self._lines) - 1)):
                self._lines.append(
                    self.add_text_line(color=self._colors[item % len(self._colors)])
                )
        return self._lines[item]

    def add_text_line(self, color=0xFFFFFF):
        """Adds a line on the display of the specified color and returns the label object."""
        text_label = self._label.Label(self._font, text="", max_glyphs=45, color=color)
        text_label.x = 0
        text_label.y = self._y
        self._y = text_label.y + 13 * self.text_scale
        self.text_group.append(text_label)

        return text_label

    def show(self):
        """Call show() to display the data list."""
        self._display.show(self.text_group)

    def show_terminal(self):
        """Revert to terminalio screen."""
        self._display.show(None)


class Clue:  # pylint: disable=too-many-instance-attributes, too-many-public-methods
    """Represents a single CLUE."""

    # Color variables available for import.
    RED = (255, 0, 0)
    YELLOW = (255, 255, 0)
    ORANGE = (255, 150, 0)
    GREEN = (0, 255, 0)
    TEAL = (0, 255, 120)
    CYAN = (0, 255, 255)
    BLUE = (0, 0, 255)
    PURPLE = (180, 0, 255)
    MAGENTA = (255, 0, 150)
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)

    GOLD = (255, 222, 30)
    PINK = (242, 90, 255)
    AQUA = (50, 255, 255)
    JADE = (0, 255, 40)
    AMBER = (255, 100, 0)
    VIOLET = (255, 0, 255)
    SKY = (0, 180, 255)

    RAINBOW = (RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE)

    def __init__(self):
        self.__state = {}
        self.__state[CONSTANTS.CLUE_STATE.BUTTON_A] = False
        self.__state[CONSTANTS.CLUE_STATE.BUTTON_B] = False
        self.__state[CONSTANTS.CLUE_STATE.PRESSED_BUTTONS] = set()
        self.__state[CONSTANTS.CLUE_STATE.SEA_LEVEL_PRESSURE] = 1013.25
        self.__state[CONSTANTS.CLUE_STATE.TEMPERATURE] = 0
        self.__state[CONSTANTS.CLUE_STATE.PROXIMITY] = 0
        self.__state[CONSTANTS.CLUE_STATE.GESTURE] = ""
        self.__state[CONSTANTS.CLUE_STATE.HUMIDITY] = 0
        self.__state[CONSTANTS.CLUE_STATE.PRESSURE] = 0
        self.__state[CONSTANTS.CLUE_STATE.PIXEL] = neopixel.NeoPixel(
            pin=CONSTANTS.CLUE_PIN, n=1, pixel_order=neopixel.RGB
        )
        # Accelerometer
        self.__state[CONSTANTS.CLUE_STATE.MOTION_X] = 0
        self.__state[CONSTANTS.CLUE_STATE.MOTION_Y] = 0
        self.__state[CONSTANTS.CLUE_STATE.MOTION_Z] = 0
        # Light/color sensor
        self.__state[CONSTANTS.CLUE_STATE.LIGHT_R] = 0
        self.__state[CONSTANTS.CLUE_STATE.LIGHT_G] = 0
        self.__state[CONSTANTS.CLUE_STATE.LIGHT_B] = 0
        self.__state[CONSTANTS.CLUE_STATE.LIGHT_C] = 0
        # Magnetometer
        self.__state[CONSTANTS.CLUE_STATE.MAGNET_X] = 0
        self.__state[CONSTANTS.CLUE_STATE.MAGNET_Y] = 0
        self.__state[CONSTANTS.CLUE_STATE.MAGNET_Z] = 0
        # Gyroscope
        self.__state[CONSTANTS.CLUE_STATE.GYRO_X] = 0
        self.__state[CONSTANTS.CLUE_STATE.GYRO_Y] = 0
        self.__state[CONSTANTS.CLUE_STATE.GYRO_Z] = 0
        # LEDs
        self.__state[CONSTANTS.CLUE_STATE.RED_LED] = False
        self.__state[CONSTANTS.CLUE_STATE.WHITE_LEDS] = False

        self.button_mapping = {
            CONSTANTS.CLUE_STATE.BUTTON_A: "A",
            CONSTANTS.CLUE_STATE.BUTTON_B: "B",
        }
        self.display = board.DISPLAY

    @property
    def button_a(self):
        """``True`` when Button A is pressed. ``False`` if not.
        This example prints when button A is pressed.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.button_a:
                  print("Button A pressed")
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_BUTTON_A)
        return self.__state[CONSTANTS.CLUE_STATE.BUTTON_A]

    @property
    def button_b(self):
        """``True`` when Button B is pressed. ``False`` if not.
        This example prints when button B is pressed.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.button_b:
                  print("Button B pressed")
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_BUTTON_B)
        return self.__state[CONSTANTS.CLUE_STATE.BUTTON_B]

    @property
    def were_pressed(self):
        """Returns a set of the buttons that have been pressed.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print(clue.were_pressed)
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_WERE_PRESSED)
        ret = self.__state[CONSTANTS.CLUE_STATE.PRESSED_BUTTONS].copy()
        self.__state[CONSTANTS.CLUE_STATE.PRESSED_BUTTONS].clear()
        return ret

    @property
    def acceleration(self):
        """Obtain acceleration data from the x, y and z axes.
        This example prints the values. Try moving the board to see how the printed values change.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
            print("Accel: {:.2f} {:.2f} {:.2f}".format(*clue.acceleration))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_ACCELERATION)
        return (
            self.__state[CONSTANTS.CLUE_STATE.MOTION_X],
            self.__state[CONSTANTS.CLUE_STATE.MOTION_Y],
            self.__state[CONSTANTS.CLUE_STATE.MOTION_Z],
        )

    def shake(self, shake_threshold=30, avg_count=10, total_delay=0.1):
        """Detect when the accelerometer is shaken. Optional parameters:
        :param shake_threshold: Increase or decrease to change shake sensitivity. This
                                requires a minimum value of 10. 10 is the total
                                acceleration if the board is not moving, therefore
                                anything less than 10 will erroneously report a constant
                                shake detected. (Default 30)
        :param avg_count: The number of readings taken and used for the average
                          acceleration. (Default 10)
        :param total_delay: The total time in seconds it takes to obtain avg_count
                            readings from acceleration. (Default 0.1)
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SHAKE)
        is_shaken = self.__state[CONSTANTS.CLUE_STATE.GESTURE] == CONSTANTS.SHAKE
        return is_shaken

    @property
    def color(self):
        """The red, green, blue, and clear light values. (r, g, b, c)
        This example prints the values. Try holding something up to the sensor to see the values
        change. Works best with white LEDs enabled.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print("Color: R: {} G: {} B: {} C: {}".format(*clue.color))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_COLOR)
        return (
            self.__state[CONSTANTS.CLUE_STATE.LIGHT_R],
            self.__state[CONSTANTS.CLUE_STATE.LIGHT_G],
            self.__state[CONSTANTS.CLUE_STATE.LIGHT_B],
            self.__state[CONSTANTS.CLUE_STATE.LIGHT_C],
        )

    @property
    def temperature(self):
        """The temperature in degrees Celsius.
        This example prints the value. Try touching the sensor to see the value change.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            print("Temperature: {:.1f}C".format(clue.temperature))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_TEMPERATURE)
        return self.__state[CONSTANTS.CLUE_STATE.TEMPERATURE]

    @property
    def magnetic(self):
        """Obtain x, y, z magnetic values in microteslas.
        This example prints the values. Try moving the board to see how the printed values change.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print("Magnetic: {:.3f} {:.3f} {:.3f}".format(*clue.magnetic))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_MAGNETIC)
        return (
            self.__state[CONSTANTS.CLUE_STATE.MAGNET_X],
            self.__state[CONSTANTS.CLUE_STATE.MAGNET_Y],
            self.__state[CONSTANTS.CLUE_STATE.MAGNET_Z],
        )

    @property
    def proximity(self):
        """A relative proximity to the sensor in values from 0 - 255.
        This example prints the value. Try moving your hand towards and away from the front of the
        board to see how the printed values change.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print("Proximity: {}".format(clue.proximity))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_PROXIMITY)
        return self.__state[CONSTANTS.CLUE_STATE.PROXIMITY]

    @property
    def gyro(self):
        """Obtain x, y, z angular velocity values in degrees/second.
        This example prints the values. Try moving the board to see how the printed values change.
              print("Gyro: {:.2f} {:.2f} {:.2f}".format(*clue.gyro))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_GYRO)
        return (
            self.__state[CONSTANTS.CLUE_STATE.GYRO_X],
            self.__state[CONSTANTS.CLUE_STATE.GYRO_Y],
            self.__state[CONSTANTS.CLUE_STATE.GYRO_Z],
        )

    @property
    def gesture(self):
        """A gesture code if gesture is detected. Shows ``0`` if no gesture detected.
        ``1`` if an UP gesture is detected, ``2`` if DOWN, ``3`` if LEFT, and ``4`` if RIGHT.
        This example prints the gesture values. Try moving your hand up, down, left or right over
        the sensor to see the value change.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print("Gesture: {}".format(clue.gesture))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_GESTURE)
        gesture_mapping = {"": 0, "up": 1, "down": 2, "left": 3, "right": 4}
        return gesture_mapping.get(self.__state[CONSTANTS.CLUE_STATE.GESTURE], 0)

    @property
    def humidity(self):
        """The measured relative humidity in percent.
        This example prints the value. Try breathing on the sensor to see the values change.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print("Humidity: {:.1f}%".format(clue.humidity))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_HUMIDITY)
        return self.__state[CONSTANTS.CLUE_STATE.HUMIDITY]

    @property
    def pressure(self):
        """The barometric pressure in hectoPascals.
        This example prints the value.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            print("Pressure: {:.3f}hPa".format(clue.pressure))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_PRESSURE)
        return self.__state[CONSTANTS.CLUE_STATE.PRESSURE]

    @property
    def altitude(self):
        """The altitude in meters based on the sea level pressure at your location. You must set
        ``sea_level_pressure`` to receive an accurate reading.
        This example prints the value. Try moving the board vertically to see the value change.
        .. code-block:: python
            from adafruit_clue import clue
            clue.sea_level_pressure = 1015
            print("Altitude: {:.1f}m".format(clue.altitude))
        """
        # National Oceanic and Atmospheric Administration (NOAA) formula for converting atmospheric pressure to pressure altitude.
        OUTSIDE_MULTIPLER_CONSTANT = 44330
        POWER_CONSTANT = 0.1903
        WHOLE_CONSTANT = 1

        altitude = OUTSIDE_MULTIPLER_CONSTANT * (
            WHOLE_CONSTANT
            - math.pow(
                self.__state[CONSTANTS.CLUE_STATE.PRESSURE]
                / self.__state[CONSTANTS.CLUE_STATE.SEA_LEVEL_PRESSURE],
                POWER_CONSTANT,
            )
        )
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_ALTITUDE)
        return altitude

    @property
    def sea_level_pressure(self):
        """Set to the pressure at sea level at your location, before reading altitude for
        the most accurate altitude measurement.
        This example prints the value.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            clue.sea_level_pressure = 1015
            print("Pressure: {:.3f}hPa".format(clue.pressure))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SEA_LEVEL_PRESSURE)
        return self.__state[CONSTANTS.CLUE_STATE.SEA_LEVEL_PRESSURE]

    @sea_level_pressure.setter
    def sea_level_pressure(self, value):
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SEA_LEVEL_PRESSURE)
        self.__state[CONSTANTS.CLUE_STATE.SEA_LEVEL_PRESSURE] = value

    @property
    def pixel(self):
        """The NeoPixel RGB LED.
        This example turns the NeoPixel purple.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            while True:
                clue.pixel.fill((255, 0, 255))
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_PIXEL)
        return self.__state[CONSTANTS.CLUE_STATE.PIXEL]

    @property
    def touch_0(self):
        """Not Implemented!

        Detect touch on capacitive touch pad 0.
        .. image :: ../docs/_static/pad_0.jpg
          :alt: Pad 0
        This example prints when pad 0 is touched.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.touch_0:
                  print("Touched pad 0")
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_TOUCH)
        utils.print_for_unimplemented_functions(Clue.touch_0.__name__)

    @property
    def touch_1(self):
        """Not Implemented!

        Detect touch on capacitive touch pad 1.
        .. image :: ../docs/_static/pad_1.jpg
          :alt: Pad 1
        This example prints when pad 1 is touched.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.touch_1:
                  print("Touched pad 1")
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_TOUCH)
        utils.print_for_unimplemented_functions(Clue.touch_1.__name__)

    @property
    def touch_2(self):
        """Not Implemented!

        Detect touch on capacitive touch pad 2.
        .. image :: ../docs/_static/pad_2.jpg
          :alt: Pad 2
        This example prints when pad 2 is touched.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.touch_2:
                  print("Touched pad 2")
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_TOUCH)
        utils.print_for_unimplemented_functions(Clue.touch_2.__name__)

    @property
    def white_leds(self):
        """The red led next to the USB plug labeled LED.
        .. image :: ../docs/_static/white_leds.jpg
          :alt: White LEDs
        This example turns on the white LEDs.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            clue.white_leds = True
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_WHITE_LEDS)
        return self.__state[CONSTANTS.CLUE_STATE.WHITE_LEDS]

    @white_leds.setter
    def white_leds(self, value):
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_WHITE_LEDS)
        self.__set_leds(CONSTANTS.CLUE_STATE.WHITE_LEDS, value)

    @property
    def red_led(self):
        """The red led next to the USB plug labeled LED.
        .. image :: ../docs/_static/red_led.jpg
          :alt: Red LED
        This example turns on the red LED.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            clue.red_led = True
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_RED_LED)
        return self.__state[CONSTANTS.CLUE_STATE.RED_LED]

    @red_led.setter
    def red_led(self, value):
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_RED_LED)
        self.__set_leds(CONSTANTS.CLUE_STATE.RED_LED, value)

    def play_tone(self, frequency, duration):
        """ Not Implemented!
        Produce a tone using the speaker. Try changing frequency to change
        the pitch of the tone.
        :param int frequency: The frequency of the tone in Hz
        :param float duration: The duration of the tone in seconds
        .. image :: ../docs/_static/speaker.jpg
          :alt: Speaker
        This example plays a 880 Hz tone for a duration of 1 second.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            clue.play_tone(880, 1)
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SOUND)
        utils.print_for_unimplemented_functions(Clue.play_tone.__name__)

    def start_tone(self, frequency):
        """ Not Implemented!
        Produce a tone using the speaker. Try changing frequency to change
        the pitch of the tone.
        :param int frequency: The frequency of the tone in Hz
        .. image :: ../docs/_static/speaker.jpg
          :alt: Speaker
        This example plays a 523Hz tone when button A is pressed and a 587Hz tone when button B is
        pressed, only while the buttons are being pressed.
        To use with the CLUE:
        .. code-block:: python
             from adafruit_clue import clue
             while True:
                 if clue.button_a:
                     clue.start_tone(523)
                 elif clue.button_b:
                     clue.start_tone(587)
                 else:
                     clue.stop_tone()
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SOUND)
        utils.print_for_unimplemented_functions(Clue.start_tone.__name__)

    def stop_tone(self):
        """ Not Implemented!
        Use with start_tone to stop the tone produced.
        .. image :: ../docs/_static/speaker.jpg
          :alt: Speaker
        This example plays a 523Hz tone when button A is pressed and a 587Hz tone when button B is
        pressed, only while the buttons are being pressed.
        To use with the CLUE:
        .. code-block:: python
             from adafruit_clue import clue
             while True:
                 if clue.button_a:
                     clue.start_tone(523)
                 elif clue.button_b:
                     clue.start_tone(587)
                 else:
                     clue.stop_tone()
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SOUND)
        utils.print_for_unimplemented_functions(Clue.stop_tone.__name__)

    @property
    def sound_level(self):
        """Not Implemented!
        Obtain the sound level from the microphone (sound sensor).
        .. image :: ../docs/_static/microphone.jpg
          :alt: Microphone (sound sensor)
        This example prints the sound levels. Try clapping or blowing on
        the microphone to see the levels change.
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print(clue.sound_level)
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SOUND)
        utils.print_for_unimplemented_functions(Clue.sound_level.__name__)

    def loud_sound(self, sound_threshold=200):
        """Not Implemented!
        Utilise a loud sound as an input.
        :param int sound_threshold: Threshold sound level must exceed to return true (Default: 200)
        .. image :: ../docs/_static/microphone.jpg
          :alt: Microphone (sound sensor)
        This example turns the NeoPixel LED blue each time you make a loud sound.
        Try clapping or blowing onto the microphone to trigger it.
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.loud_sound():
                  clue.pixel.fill((0, 50, 0))
              else:
                  clue.pixel.fill(0)
        You may find that the code is not responding how you would like.
        If this is the case, you can change the loud sound threshold to
        make it more or less responsive. Setting it to a higher number
        means it will take a louder sound to trigger. Setting it to a
        lower number will take a quieter sound to trigger. The following
        example shows the threshold being set to a higher number than
        the default.
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              if clue.loud_sound(sound_threshold=300):
                  clue.pixel.fill((0, 50, 0))
              else:
                  clue.pixel.fill(0)
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_SOUND)
        utils.print_for_unimplemented_functions(Clue.loud_sound.__name__)

    @staticmethod
    def simple_text_display(
        title=None,
        title_color=(255, 255, 255),
        title_scale=1,  # pylint: disable=too-many-arguments
        text_scale=1,
        font=None,
        colors=None,
    ):
        """Display lines of text on the CLUE display. Lines of text are created in order as shown
        in the example below. If you skip a number, the line will be shown blank on the display,
        e.g. if you include ``[0]`` and ``[2]``, the second line on the display will be empty, and
        the text specified for lines 0 and 2 will be displayed on the first and third line.
        Remember, Python begins counting at 0, so the first line on the display is 0 in the code.

        Setup occurs before the loop. For data to be dynamically updated on the display, you must
        include the data call in the loop by using ``.text =``. For example, if setup is saved as
        ``clue_data = display_clue_data()`` then ``clue_data[0].text = clue.proximity`` must be
        inside the ``while True:`` loop for the proximity data displayed to update as the
        values change. You must call ``show()`` at the end of the list for anything to display.
        See example below for usage.

        :param str title: The title displayed above the data. Set ``title="Title text"`` to provide
                          a title. Defaults to None.
        :param title_color: The color of the title. Not necessary if no title is provided. Defaults
                            to white (255, 255, 255).
        :param int title_scale: Scale the size of the title. Not necessary if no title is provided.
                                Defaults to 1.
        :param int text_scale: Scale the size of the data lines. Scales the title as well.
                               Defaults to 1.
        :param str font: The font to use to display the title and data. Defaults to built in
                     ``terminalio.FONT``.
        :param colors: A list of colors for the lines of data on the display. If you provide a
                       single color, all lines will be that color. Otherwise it will cycle through
                       the list you provide if the list is less than the number of lines displayed.
                       Default colors are used if ``colors`` is not set. For example, if creating
                       two lines of data, ``colors=((255, 255, 255), (255, 0, 0))`` would set the
                       first line white and the second line red, and if you created four lines of
                       data with the same setup, it would alternate white and red.

        .. image :: ../docs/_static/display_clue_data.jpg
          :alt: Display Clue Data demo

        This example displays three lines with acceleration, gyro and magnetic data on the display.
        Remember to call ``show()`` after the list to update the display.

        .. code-block:: python

          from adafruit_clue import clue

          clue_data = clue.simple_text_display(title="CLUE Sensor Data!", title_scale=2)

          while True:
              clue_data[0].text = "Acceleration: {:.2f} {:.2f} {:.2f}".format(*clue.acceleration)
              clue_data[1].text = "Gyro: {:.2f} {:.2f} {:.2f}".format(*clue.gyro)
              clue_data[2].text = "Magnetic: {:.3f} {:.3f} {:.3f}".format(*clue.magnetic)
              clue_data.show()
        """
        telemetry_py.send_telemetry(TelemetryEvent.CLUE_API_TEXT_DISPLAY)
        return _ClueSimpleTextDisplay(
            title=title,
            title_color=title_color,
            title_scale=title_scale,
            text_scale=text_scale,
            font=font,
            colors=colors,
        )

    def update_state(self, new_state):
        for event in new_state.keys():
            if event in CONSTANTS.EXPECTED_INPUT_BUTTONS:
                self.__update_button(event, new_state.get(event))
            elif event in CONSTANTS.ALL_EXPECTED_INPUT_EVENTS:
                if self.__state[event] != new_state[event]:
                    self.__state[event] = new_state.get(event)

    # helpers
    def __update_button(self, button, value):
        if value:
            self.__state[CONSTANTS.CLUE_STATE.PRESSED_BUTTONS].add(
                self.button_mapping[button]
            )
        self.__state[button] = value

    def __set_leds(self, led, value):
        value = bool(value)
        self.__state[led] = value
        sendable_json = {led: value}
        utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)


clue = Clue()  # pylint: disable=invalid-name
"""Object that is automatically created on import.

   To use, simply import it from the module:

   .. code-block:: python

   from adafruit_clue import clue
"""
