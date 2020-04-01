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

import time
import array
import math
from PIL import Image
import pathlib
import sys
import os

abs_path = pathlib.Path(__file__).parent.absolute()
sys.path.insert(0, os.path.join(abs_path))
import neopixel
from base_circuitpython import base_cp_constants as CONSTANTS

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

        self._colors = colors
        self._label = label
        # self._display = board.DISPLAY
        self._font = terminalio.FONT
        if font:
            self._font = font
        self.text_group = displayio.Group(
            max_size=20, scale=text_scale, auto_write=False
        )

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
                auto_write=False,
            )
            title.x = 0
            title.y = 8
            self._y = title.y + 18

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
        text_label = self._label.Label(
            self._font, text="", max_glyphs=45, color=color, auto_write=False
        )
        text_label.x = 0
        text_label.y = self._y
        self._y = text_label.y + 13
        self.text_group.append(text_label)

        return text_label

    def show(self):
        """Call show() to display the data list."""
        self.text_group.draw(show=True)
        # https://stackoverflow.com/questions/31826335/how-to-convert-pil-image-image-object-to-base64-string

    def show_terminal(self):
        """Revert to terminalio screen."""
        # TODO: implement terminal for clue screen
        return


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
        self.__state = {
            "button_a": False,
            "button_b": False,
            "pressed_buttons": set(),
            "accelerometer": {"x": 0, "y": 0, "z": 0},
            "color_sensor": {"r": 0, "g": 0, "b": 0, "c": 0},
            "magnetometer": {"x": 0, "y": 0, "z": 0},
            "gyro": {"x": 0, "y": 0, "z": 0},
            "sea_level_pressure": 1013.25,
            "temperature": 0,
            "proximity": 0,
            "gesture": 0,  # Can only be 0, 1, 2, 3, 4
            "humidity": 0,
            "pressure": 0,
            "pixel": neopixel.NeoPixel(
                pin=CONSTANTS.CLUE_PIN, n=1, pixel_order=neopixel.RGB
            ),
        }

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
        return self.__state["button_a"]

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
        return self.__state["button_b"]

    @property
    def were_pressed(self):
        """Returns a set of the buttons that have been pressed.
        To use with the CLUE:
        .. code-block:: python
          from adafruit_clue import clue
          while True:
              print(clue.were_pressed)
        """
        ret = self.__state["pressed_buttons"].copy()
        self.__state["pressed_buttons"].clear()
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
        return (
            self.__state["accelerometer"]["x"],
            self.__state["accelerometer"]["y"],
            self.__state["accelerometer"]["z"],
        )

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
        return (
            self.__state["color_sensor"]["r"],
            self.__state["color_sensor"]["g"],
            self.__state["color_sensor"]["b"],
            self.__state["color_sensor"]["c"],
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
        return self.__state["temperature"]

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
        return (
            self.__state["magnetometer"]["x"],
            self.__state["magnetometer"]["y"],
            self.__state["magnetometer"]["z"],
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
        return self.__state["proximity"]

    @property
    def gyro(self):
        """Obtain x, y, z angular velocity values in degrees/second.
        This example prints the values. Try moving the board to see how the printed values change.
              print("Gyro: {:.2f} {:.2f} {:.2f}".format(*clue.gyro))
        """
        return (
            self.__state["gyro"]["x"],
            self.__state["gyro"]["y"],
            self.__state["gyro"]["z"],
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
        return self.__state["gesture"]

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
        return self.__state["humidity"]

    @property
    def pressure(self):
        """The barometric pressure in hectoPascals.
        This example prints the value.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            print("Pressure: {:.3f}hPa".format(clue.pressure))
        """
        return self.__state["pressure"]

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
        altitude = 44330 * (
            1.0
            - math.pow(
                self.__state["pressure"] / self.__state["sea_level_pressure"], 0.1903
            )
        )
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
        return self.__state["sea_level_pressure"]

    @sea_level_pressure.setter
    def sea_level_pressure(self, value):
        self.__state["sea_level_pressure"] = value

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
        return self.__state["pixel"]

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
        if button == "button_a":
            if value:
                self.__state["pressed_buttons"].add("A")
            self.__state["button_a"] = value
        elif button == "button_b":
            if value:
                self.__state["pressed_buttons"].add("B")
            self.__state["button_b"] = value


clue = Clue()  # pylint: disable=invalid-name
"""Object that is automatically created on import.

   To use, simply import it from the module:

   .. code-block:: python

   from adafruit_clue import clue
"""
