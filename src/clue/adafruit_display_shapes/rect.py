# The MIT License (MIT)
#
# Copyright (c) 2019 Limor Fried for Adafruit Industries
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
`rect`
================================================================================

Various common shapes for use with displayio - Rectangle shape!


* Author(s): Limor Fried

Implementation Notes
--------------------

**Software and Dependencies:**

* Adafruit CircuitPython firmware for the supported boards:
  https://github.com/adafruit/circuitpython/releases

"""

import displayio

__version__ = "0.0.0-auto.0"
__repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_Display_Shapes.git"


class Rect(displayio.TileGrid):
    """A rectangle.

    :param x: The x-position of the top left corner.
    :param y: The y-position of the top left corner.
    :param width: The width of the rectangle.
    :param height: The height of the rectangle.
    :param fill: The color to fill the rectangle. Can be a hex value for a color or
                 ``None`` for transparent.
    :param outline: The outline of the rectangle. Can be a hex value for a color or
                    ``None`` for no outline.
    :param stroke: Used for the outline. Will not change the outer bound size set by ``width`` and
                   ``height``.

    """

    def __init__(self, x, y, width, height, *, fill=None, outline=None, stroke=1):
        self._bitmap = displayio.Bitmap(width, height, 2)
        self._palette = displayio.Palette(2)

        if outline is not None:
            self._palette[1] = outline
            for w in range(width):
                for line in range(stroke):
                    self._bitmap[w, line] = 1
                    self._bitmap[w, height - 1 - line] = 1
            for _h in range(height):
                for line in range(stroke):
                    self._bitmap[line, _h] = 1
                    self._bitmap[width - 1 - line, _h] = 1
        print(fill)
        if fill is not None:
            self._palette[0] = fill
        else:
            self._palette.make_transparent(0)
        super().__init__(self._bitmap, pixel_shader=self._palette, x=x, y=y)

    @property
    def fill(self):
        """The fill of the rectangle. Can be a hex value for a color or ``None`` for
        transparent."""
        return self._palette[0]

    @fill.setter
    def fill(self, color):
        if color is None:
            self._palette.make_transparent(0)
        else:
            self._palette[0] = color

    @property
    def outline(self):
        """The outline of the rectangle. Can be a hex value for a color or ``None``
        for no outline."""
        return self._palette[1]

    @outline.setter
    def outline(self, color):
        if color is None:
            self._palette.make_transparent(1)
        else:
            self._palette[1] = color
