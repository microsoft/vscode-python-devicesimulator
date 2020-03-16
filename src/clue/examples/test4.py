import sys
import os

sys.path.append(os.path.join(sys.path[0], ".."))
from adafruit_clue import clue

# import adafruit_fancyled.adafruit_fancyled as fancy
from adafruit_bitmap_font import bitmap_font

clue_data = clue.simple_text_display(title="CLUE Sensor Data!", title_scale=8,)

# while True:
clue_data[0].text = "Acceleration:"
clue_data[1].text = "Gyro:"
clue_data[2].text = "Magnetic:"
clue_data[3].text = "Pressure: {:.3f} hPa".format(100)
clue_data[4].text = "Altitude: {:.1f} m".format(100)
clue_data[5].text = "Temperature: {:.1f} C".format(100)
clue_data[6].text = "Humidity: {:.1f} %".format(100)
clue_data[7].text = "Proximity: {}".format(100)
clue_data[8].text = "Gesture: {}".format("uwu")
clue_data[9].text = "Color: R: {} G: {} B: {} C: {}".format(100, 100, 100, 100)
clue_data[10].text = "Button A: {}".format(False)
clue_data[11].text = "Button B: {}".format(False)
clue_data[12].text = "Touch 0: {}".format(False)
clue_data[13].text = "Touch 1: {}".format(False)
clue_data[14].text = "Touch 2: {}".format(False)
clue_data.show()
# clue.pixel.fill((253, 2, 234))
