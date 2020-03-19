# dummy library for adafruit_bitmap_font to work

# original implementation docs for fontio:
# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/fontio/__init__.html

# file taken from adafruit_bitmap_font's examples:
# https://github.com/adafruit/Adafruit_CircuitPython_Bitmap_Font/blob/master/test/fontio.py
import collections

Glyph = collections.namedtuple(
    "Glyph",
    ["bitmap", "tile_index", "width", "height", "dx", "dy", "shift_x", "shift_y"],
)
