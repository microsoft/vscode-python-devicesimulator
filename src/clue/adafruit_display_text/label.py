# The MIT License (MIT)
#
# Copyright (c) 2019 Scott Shawcroft for Adafruit Industries LLC
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
`adafruit_display_text.label`
====================================================

Displays text labels using CircuitPython's displayio.

* Author(s): Scott Shawcroft

Implementation Notes
--------------------

**Hardware:**

**Software and Dependencies:**

* Adafruit CircuitPython firmware for the supported boards:
  https://github.com/adafruit/circuitpython/releases

"""
import sys
import os
sys.path.append(os.path.join(sys.path[0], "../test"))
import displayio

__version__ = "0.0.0-auto.0"
__repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_Display_Text.git"

class Label(displayio.Group):
    """A label displaying a string of text. The origin point set by ``x`` and ``y``
       properties will be the left edge of the bounding box, and in the center of a M
       glyph (if its one line), or the (number of lines * linespacing + M)/2. That is,
       it will try to have it be center-left as close as possible.

       :param Font font: A font class that has ``get_bounding_box`` and ``get_glyph``.
         Must include a capital M for measuring character size.
       :param str text: Text to display
       :param int max_glyphs: The largest quantity of glyphs we will display
       :param int color: Color of all text in RGB hex
       :param double line_spacing: Line spacing of text to display"""
    def __init__(self, font, *, x=0, y=0, text=None, max_glyphs=None, color=0xffffff,
                 background_color=None, line_spacing=1.25, **kwargs):
        if not max_glyphs and not text:
            raise RuntimeError("Please provide a max size, or initial text")
        if not max_glyphs:
            max_glyphs = len(text)
        super().__init__(max_size=max_glyphs, **kwargs)
        self.width = max_glyphs
        self.font = font
        self._text = None
        self._anchor_point = (0, 0)
        self.x = x
        self.y = y

        self.palette = displayio.Palette(2)
        if background_color is not None:
            self.palette[0] = background_color
            self.palette.make_opaque(0)
            self._transparent_background = False
        else:
            self.palette[0] = 0
            self.palette.make_transparent(0)
            self._transparent_background = True
        self.palette[1] = color

        bounds = self.font.get_bounding_box()
        self.height = bounds[1]
        self._line_spacing = line_spacing
        self._boundingbox = None

        if text is not None:
            self._update_text(str(text))

    def __len__(self):
        if not self._text:
            return 0
        else:
            return len(self._text)

    def _update_text(self, new_text): # pylint: disable=too-many-locals
        x = 0
        y = 0
        i = 0
        old_c = 0
        y_offset = int((self.font.get_glyph(ord('M')).height -
                        new_text.count('\n') * self.height * self.line_spacing) / 2)
        print("y offset from baseline", y_offset)
        left = right = top = bottom = 0
        for character in new_text:
            if character == '\n':
                y += int(self.height * self._line_spacing)
                x = 0
                continue
            glyph = self.font.get_glyph(ord(character))
            if not glyph:
                continue
            right = max(right, x+glyph.width)
            if y == 0:   # first line, find the Ascender height
                top = min(top, -glyph.height+y_offset)
            bottom = max(bottom, y-glyph.dy+y_offset)
            position_y = y - glyph.height - glyph.dy + y_offset
            print(y)
            print(glyph.height)
            print(glyph.dy)
            print(y_offset)
            print()
            position_x = x + glyph.dx
            if not self._text or old_c >= len(self._text) or character != self._text[old_c]:
                # try:
                #     face = displayio.TileGrid(glyph.bitmap, pixel_shader=self.palette,
                #                               default_tile=glyph.tile_index,
                #                               tile_width=glyph.width, tile_height=glyph.height,
                #                               position=(position_x, position_y))
                # except TypeError:
                face = displayio.TileGrid(glyph.bitmap, pixel_shader=self.palette,
                                            default_tile=glyph.tile_index,
                                            tile_width=glyph.width, tile_height=glyph.height,
                                            x=position_x, y=position_y)
                if i < len(self):
                    self[i] = face
                else:
                    self.append(face)
            elif self._text and character == self._text[old_c]:
                try:
                    self[i].position = (position_x, position_y)
                except AttributeError:
                    self[i].x = position_x
                    self[i].y = position_y

            x += glyph.shift_x

            # TODO skip this for control sequences or non-printables.
            i += 1
            old_c += 1
            # skip all non-prinables in the old string
            while (self._text and old_c < len(self._text) and
                   (self._text[old_c] == '\n' or not self.font.get_glyph(ord(self._text[old_c])))):
                old_c += 1
        # Remove the rest
        while len(self) > i:
            self.pop()
        self._text = new_text
        self._boundingbox = (left, top, left+right, bottom-top)

    @property
    def bounding_box(self):
        """An (x, y, w, h) tuple that completely covers all glyphs. The
        first two numbers are offset from the x, y origin of this group"""
        return tuple(self._boundingbox)

    @property
    def line_spacing(self):
        """The amount of space between lines of text, in multiples of the font's
        bounding-box height. (E.g. 1.0 is the bounding-box height)"""
        return self._line_spacing

    @line_spacing.setter
    def line_spacing(self, spacing):
        self._line_spacing = spacing

    @property
    def color(self):
        """Color of the text as an RGB hex number."""
        return self.palette[1]

    @color.setter
    def color(self, new_color):
        self.palette[1] = new_color

    @property
    def background_color(self):
        """Color of the background as an RGB hex number."""
        if not self._transparent_background:
            return self.palette[0]
        return None

    @background_color.setter
    def background_color(self, new_color):
        if new_color is not None:
            self.palette[0] = new_color
            self.palette.make_opaque(0)
            self._transparent_background = False
        else:
            self.palette[0] = 0
            self.palette.make_transparent(0)
            self._transparent_background = True

    @property
    def text(self):
        """Text to display."""
        return self._text

    @text.setter
    def text(self, new_text):
        self._update_text(str(new_text))

    @property
    def anchor_point(self):
        """Point that anchored_position moves relative to.
           Tuple with decimal percentage of width and height.
           (E.g. (0,0) is top left, (1.0, 0.5): is middle right.)"""
        return self._anchor_point

    @anchor_point.setter
    def anchor_point(self, new_anchor_point):
        self._anchor_point = new_anchor_point

    @property
    def anchored_position(self):
        """Position relative to the anchor_point. Tuple containing x,y
           pixel coordinates."""
        return (self.x-self._boundingbox[2]*self._anchor_point[0],
                self.y-self._boundingbox[3]*self._anchor_point[1])

    @anchored_position.setter
    def anchored_position(self, new_position):
        self.x = int(new_position[0]-(self._boundingbox[2]*self._anchor_point[0]))
        self.y = int(new_position[1]-(self._boundingbox[3]*self._anchor_point[1]))
