# dummy library for adafruit_bitmap_font to work
import collections

Glyph = collections.namedtuple(
    "Glyph",
    ["bitmap", "tile_index", "width", "height", "dx", "dy", "shift_x", "shift_y"],
)
