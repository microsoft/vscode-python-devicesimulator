import sys
import os
from PIL import Image

sys.path.append(os.path.join(sys.path[0], ".."))
import neopixel
import adafruit_fancyled.adafruit_fancyled as fancy

num_leds = 1
# Declare a 6-element RGB rainbow palette
palette = [fancy.CRGB(1.0, 0.0, 0.5), # Pink
           fancy.CRGB(0.0, 1.0, 0.0), # Green
           fancy.CRGB(0.0, 0.0, 1.0)] # Blue

pixels = neopixel.NeoPixel(0, num_leds, brightness=1.0,
                           auto_write=False)

# Create the slideshow object that plays through once alphabetically.
# slideshow = SlideShow(board.DISPLAY, folder="/pix",
#                       loop=True, order=PlayBackOrder.ALPHABETICAL)

# only show first image
#slideshow.update()

offset = 0  # Positional offset into color palette to get it to 'spin'

# while True:
for _ in range(10):
    for i in range(num_leds):
    # Load each pixel's color from the palette using an offset, run it
    # through the gamma function, pack RGB value and assign to pixel.
        color = fancy.palette_lookup(palette, offset + i / num_leds)
        color = fancy.gamma_adjust(color, brightness=0.25)
        # print(color.pack())
        pixels[i] = color.pack()
    pixels.show()

    offset += 0.01  # Bigger number = faster spin