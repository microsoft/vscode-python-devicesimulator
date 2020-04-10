# overriden terminalio library, which uses
# adafruit_bitmap_font to load the default font

# original implementation docs for terminalio:
# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/terminalio/__init__.html

from adafruit_bitmap_font import bitmap_font  # pylint: disable=wrong-import-position

import os
import pathlib

abs_path = pathlib.Path(__file__).parent.absolute()

# load default font
FONT = bitmap_font.load_font(os.path.join(abs_path, "fonts", "ter-u12n.bdf"))
