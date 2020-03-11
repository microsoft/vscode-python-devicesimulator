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
`adafruit_bitmap_font.bdf`
====================================================

Loads BDF format fonts.

* Author(s): Scott Shawcroft

Implementation Notes
--------------------

**Hardware:**

**Software and Dependencies:**

* Adafruit CircuitPython firmware for the supported boards:
  https://github.com/adafruit/circuitpython/releases

"""

import gc
try:
    from displayio import Glyph
except ImportError:
    from fontio import Glyph
from .glyph_cache import GlyphCache

__version__ = "0.0.0-auto.0"
__repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_Bitmap_Font.git"

class BDF(GlyphCache):
    """Loads glyphs from a BDF file in the given bitmap_class."""
    def __init__(self, f, bitmap_class):
        super().__init__()
        self.file = f
        self.name = f
        self.file.seek(0)
        self.bitmap_class = bitmap_class
        line = self.file.readline()
        line = str(line, "utf-8")
        if not line or not line.startswith("STARTFONT 2.1"):
            raise ValueError("Unsupported file version")
        self.point_size = None
        self.x_resolution = None
        self.y_resolution = None

    def get_bounding_box(self):
        """Return the maximum glyph size as a 4-tuple of: width, height, x_offset, y_offset"""
        self.file.seek(0)
        while True:
            line = self.file.readline()
            line = str(line, "utf-8")
            if not line:
                break

            if line.startswith("FONTBOUNDINGBOX "):
                _, x, y, x_offset, y_offset = line.split()
                return (int(x), int(y), int(x_offset), int(y_offset))
        return None

    def load_glyphs(self, code_points):
        # pylint: disable=too-many-statements,too-many-branches,too-many-nested-blocks,too-many-locals
        metadata = True
        character = False
        code_point = None
        bytes_per_row = 1
        desired_character = False
        current_info = {}
        current_y = 0
        rounded_x = 1
        if isinstance(code_points, int):
            remaining = set()
            remaining.add(code_points)
        elif isinstance(code_points, str):
            remaining = set(ord(c) for c in code_points)
        elif isinstance(code_points, set):
            remaining = code_points
        else:
            remaining = set(code_points)
        for code_point in remaining:
            if code_point in self._glyphs and self._glyphs[code_point]:
                remaining.remove(code_point)
        if not remaining:
            return

        x, _, _, _ = self.get_bounding_box()

        self.file.seek(0)
        while True:
            line = self.file.readline()
            if not line:
                break
            if line.startswith(b"CHARS "):
                metadata = False
            elif line.startswith(b"SIZE"):
                _, self.point_size, self.x_resolution, self.y_resolution = line.split()
            elif line.startswith(b"COMMENT"):
                pass
            elif line.startswith(b"STARTCHAR"):
                # print(lineno, line.strip())
                #_, character_name = line.split()
                character = True
            elif line.startswith(b"ENDCHAR"):
                character = False
                if desired_character:
                    bounds = current_info["bounds"]
                    shift = current_info["shift"]
                    gc.collect()
                    self._glyphs[code_point] = Glyph(current_info["bitmap"],
                                                     0,
                                                     bounds[0],
                                                     bounds[1],
                                                     bounds[2],
                                                     bounds[3],
                                                     shift[0],
                                                     shift[1])
                    remaining.remove(code_point)
                    if not remaining:
                        return
                desired_character = False
            elif line.startswith(b"BBX"):
                if desired_character:
                    _, x, y, x_offset, y_offset = line.split()
                    x = int(x)
                    y = int(y)
                    x_offset = int(x_offset)
                    y_offset = int(y_offset)
                    current_info["bounds"] = (x, y, x_offset, y_offset)
                    current_info["bitmap"] = self.bitmap_class(x, y, 2)
            elif line.startswith(b"BITMAP"):
                if desired_character:
                    rounded_x = x // 8
                    if x % 8 > 0:
                        rounded_x += 1
                    bytes_per_row = rounded_x
                    if bytes_per_row % 4 > 0:
                        bytes_per_row += 4 - bytes_per_row % 4
                    current_y = 0
            elif line.startswith(b"ENCODING"):
                _, code_point = line.split()
                code_point = int(code_point)
                if code_point in remaining:
                    desired_character = True
                    current_info = {"bitmap": None, "bounds": None, "shift": None}
            elif line.startswith(b"DWIDTH"):
                if desired_character:
                    _, shift_x, shift_y = line.split()
                    shift_x = int(shift_x)
                    shift_y = int(shift_y)
                    current_info["shift"] = (shift_x, shift_y)
            elif line.startswith(b"SWIDTH"):
                pass
            elif character:
                if desired_character:
                    bits = int(line.strip(), 16)
                    width = current_info["bounds"][0]
                    start = current_y * width
                    x = 0
                    for i in range(rounded_x):
                        val = (bits >> ((rounded_x-i-1)*8)) & 0xFF
                        for j in range(7, -1, -1):
                            if x >= width:
                                break
                            bit = 0
                            if val & (1 << j) != 0:
                                bit = 1
                            current_info["bitmap"][start + x] = bit
                            x += 1
                    current_y += 1
            elif metadata:
                #print(lineno, line.strip())
                pass
