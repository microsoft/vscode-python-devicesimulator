import os
import sys

sys.path.append(os.path.join(sys.path[0], ".."))
sys.path.append(os.path.join(sys.path[0], "../test"))
from adafruit_display_text import label  # yes
import displayio
import terminalio
from PIL import Image

img = Image.new("RGB", (240, 240), "black")  # Create a new black image
bmp_img = img.load()  # Create the pixel map

text_group = displayio.Group(max_size=20, scale=1)
titl = "CLUE Sensor Data!"
# Fail gracefully if title is longer than 60 characters.
if len(titl) > 60:
    raise ValueError("Title must be 60 characters or less.")

title = label.Label(
    font=terminalio.FONT, text=titl, max_glyphs=60, color=(255, 255, 255), scale=1
)
title.x = 1
title.y = 4

text_group.append(title)

text_group.draw(bmp_img)
img.show()
img.save("test.bmp")

