import os
import sys
from PIL import Image


img = Image.new("RGB", (255, 255), "black")  # Create a new black image
bmp_img = img.load()  # Create the pixel map

# Add paths so this runs in CPython in-place.
sys.path.append(os.path.join(sys.path[0], ".."))
from adafruit_bitmap_font import bitmap_font  # pylint: disable=wrong-import-position
from adafruit_display_text import label  # yes

sys.path.append(os.path.join(sys.path[0], "../test"))
import terminalio

font = terminalio.FONT


def draw_it(c, line_no):
    glyph = font.get_glyph(ord(c))
    if not glyph:
        return

    for i in range(glyph.height):
        for j in range(glyph.width):
            value = glyph.bitmap[j, i]
            pix = (0, 0, 0)
            if value > 0:
                pix = (255, 255, 255)
            try:
                bmp_img[j, line_no * glyph.height + i] = pix
            except IndexError:
                continue


draw_it("H", 0)
draw_it("i", 1)

img.show()
img.save("test.bmp")

