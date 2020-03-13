from adafruit_bitmap_font import bitmap_font  # pylint: disable=wrong-import-position
import sys

FONT = bitmap_font.load_font(f"{sys.path[0]}\\..\\ter-u12n.bdf")
