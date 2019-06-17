from adafruit_circuitplayground.express import cpx

import time
while True:
    cpx.red_led = True
    cpx.pixels[0] = (255, 0, 0)
    cpx.pixels[1] = (0, 255, 0)
    cpx.pixels[2] = (0, 153, 255)
    cpx.pixels[3] = (255, 163, 26)
    cpx.pixels[4] = (255, 4, 100)
    cpx.pixels[5] = (0, 0, 0)
    cpx.pixels[6] = (0, 0, 0)
    cpx.pixels[7] = (0, 0, 0)
    cpx.pixels[8] = (0, 0, 0)
    cpx.pixels[9] = (0, 0, 0)
    cpx.pixels.show()

    time.sleep(2)

    cpx.pixels[0] = (0, 0, 0)
    cpx.pixels[1] = (0, 0, 0)
    cpx.pixels[2] = (0, 0, 0)
    cpx.pixels[3] = (0, 0, 0)
    cpx.pixels[4] = (0, 0, 0)
    cpx.pixels[5] = (0, 255, 0)
    cpx.pixels[6] = (100, 150, 0)
    cpx.pixels[7] = (20, 178, 200)
    cpx.pixels[8] = (34, 66, 100)
    cpx.pixels[9] = (200, 90, 90)
    cpx.pixels.show()

    time.sleep(2)

    cpx.pixels.fill((0, 0, 200))
    cpx.pixels.show()

    time.sleep(2)
