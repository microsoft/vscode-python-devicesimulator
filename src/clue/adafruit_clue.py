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
import board

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

        self._display = board.DISPLAY
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
        text_label = self._label.Label(self._font, text="", max_glyphs=45, color=color)
        text_label.x = 0
        text_label.y = self._y
        self._y = text_label.y + 13
        self.text_group.append(text_label)

        return text_label

    def show(self):
        """Call show() to display the data list."""
        self._display.show(self.text_group)
        # https://stackoverflow.com/questions/31826335/how-to-convert-pil-image-image-object-to-base64-string

    def show_terminal(self):
        """Revert to terminalio screen."""

        self._display.show(None)
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
        self._pixel = neopixel.NeoPixel(
            pin=CONSTANTS.CLUE_PIN, n=1, pixel_order=neopixel.RGB
        )

    @property
    def pixel(self):
        """The NeoPixel RGB LED.
        .. image :: ../docs/_static/neopixel.jpg
          :alt: NeoPixel
        This example turns the NeoPixel purple.
        To use with the CLUE:
        .. code-block:: python
            from adafruit_clue import clue
            while True:
                clue.pixel.fill((255, 0, 255))
        """
        return self._pixel

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


clue = Clue()  # pylint: disable=invalid-name
"""Object that is automatically created on import.

   To use, simply import it from the module:

   .. code-block:: python

   from adafruit_clue import clue
"""
