"""
To get started, check out the "Device Simulator Express: Getting Started" command in the command pallete, which you can access with `CMD + SHIFT + P` For Mac and `CTRL + SHIFT + P` for Windows and Linux.

To learn more about the CLUE and CircuitPython, check this link out:
https://learn.adafruit.com/adafruit-clue/circuitpython

Find example code for CPX on:
https://blog.adafruit.com/2020/02/12/three-fun-sensor-packed-projects-to-try-on-your-clue-adafruitlearningsystem-adafruit-circuitpython-adafruit/
"""

from adafruit_clue import clue

clue_data = clue.simple_text_display(title="Hello World!", title_scale=2)

while True:
    clue_data[0].text = "Acceleration: {} {} {}".format(*clue.acceleration)
    clue_data[1].text = "Gyro: {} {} {}".format(*clue.gyro)
    clue_data[2].text = "Magnetic: {} {} {}".format(*clue.magnetic)
    clue_data[3].text = "Pressure: {}hPa".format(clue.pressure)
    clue_data[4].text = "Altitude: {}m".format(clue.altitude)
    clue_data[5].text = "Temperature: {}C".format(clue.temperature)
    clue_data[6].text = "Humidity: {}%".format(clue.humidity)
    clue_data[7].text = "Proximity: {}".format(clue.proximity)
    clue_data[8].text = "Gesture: {}".format(clue.gesture)
    clue_data[9].text = "Color: R: {} G: {} B: {} C: {}".format(*clue.color)
    clue_data[10].text = "Button A: {}".format(clue.button_a)
    clue_data[11].text = "Button B: {}".format(clue.button_b)
    clue_data.show()
