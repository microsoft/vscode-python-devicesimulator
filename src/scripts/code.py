from express import cpx

import time

while True:
    cpx.pixels[0] = (255, 0, 0)
    cpx.pixels[1] = (0, 255, 0)
    cpx.pixels[2] = (0, 153, 255)
    cpx.pixels[3] = (255, 163, 26)
    cpx.pixels[4] = (255, 4, 100)
    cpx.pixels[5] = (-1, -1, -1)
    cpx.pixels[6] = (-1, -1, -1)
    cpx.pixels[7] = (-1, -1, -1)
    cpx.pixels[8] = (-1, -1, -1)
    cpx.pixels[9] = (-1, -1, -1)
    cpx.pixels.show()

    time.sleep(2)

    cpx.pixels[0] = (-1, -1, -1)
    cpx.pixels[1] = (-1, -1, -1)
    cpx.pixels[2] = (-1, -1, -1)
    cpx.pixels[3] = (-1, -1, -1)
    cpx.pixels[4] = (-1, -1, -1)
    cpx.pixels[5] = (0, 255, 0)
    cpx.pixels[6] = (100, 150, 0)
    cpx.pixels[7] = (20, 178, 200)
    cpx.pixels[8] = (34, 66, 100)
    cpx.pixels[9] = (200, 90, 90)
    cpx.pixels.show()

    time.sleep(5)
