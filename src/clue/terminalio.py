from adafruit_bitmap_font import bitmap_font  # pylint: disable=wrong-import-position

import os
import pathlib

abs_path = pathlib.Path(__file__).parent.absolute()
FONT = bitmap_font.load_font(os.path.join(abs_path, "fonts", "ter-u12n.bdf"))
