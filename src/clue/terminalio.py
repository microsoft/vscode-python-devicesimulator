from adafruit_bitmap_font import bitmap_font  # pylint: disable=wrong-import-position
import sys
import os

FONT = bitmap_font.load_font(os.path.join(sys.path[0], "..", "ter-u12n.bdf"))

