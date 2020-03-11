# The MIT License (MIT)
#
# Copyright (c) 2020 Kattni Rembor for Adafruit Industries
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
"""
`adafruit_clue`
================================================================================

A high level library representing all the features of the Adafruit CLUE.


* Author(s): Kattni Rembor

Implementation Notes
--------------------

**Hardware:**

.. "* `Adafruit CLUE - nRF52840 Express with Bluetooth LE <https://www.adafruit.com/product/4500>`_"

**Software and Dependencies:**

* Adafruit CircuitPython firmware for the supported boards:
  https://github.com/adafruit/circuitpython/releases

 * Adafruit's Bus Device library: https://github.com/adafruit/Adafruit_CircuitPython_BusDevice
 * Adafruit's Register library: https://github.com/adafruit/Adafruit_CircuitPython_Register
 * Adafruit's LSM6DS CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_LSM6DS
 * Adafruit's LIS3MDL CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_LIS3MDL
 * Adafruit's APDS9960 CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_APDS9960
 * Adafruit's BMP280 CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_BMP280
 * Adafruit's SHT31D CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_SHT31D
 * Adafruit's NeoPixel CircuitPython Library:
   https://github.com/adafruit/Adafruit_CircuitPython_NeoPixel
"""

import time
import array
import math
from PIL import Image


# import board # yes? - only if we want to use this exact code for our repo
# import digitalio # yes - also likely only if we want to use this exact code
# import neopixel # yes
# import adafruit_apds9960.apds9960 # no
# import adafruit_bmp280 # no
# import adafruit_lis3mdl # no
# import adafruit_lsm6ds # no
# import adafruit_sht31d # no
# import audiobusio # probably no time
# import audiopwmio # probably no time
# import audiocore # probably no time
# import gamepad # probably no time
# import touchio # probably no time

__version__ = "0.0.0-auto.0"
__repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_CLUE.git"


class _ClueSimpleTextDisplay:
    """Easily display lines of text on CLUE display."""

    def __init__(
        self,
        title=None,
        title_color=0xFFFFFF,
        title_scale=1,  # pylint: disable=too-many-arguments
        text_scale=1,
        font=None,
        colors=None,
    ):
        import displayio  # yes
        import terminalio  # yes...?
        from adafruit_display_text import label  # yes

        if not colors:
            colors = (
                Clue.VIOLET,
                Clue.GREEN,
                Clue.RED,
                Clue.CYAN,
                Clue.ORANGE,
                Clue.BLUE,
                Clue.MAGENTA,
                Clue.SKY,
                Clue.YELLOW,
                Clue.PURPLE,
            )

        self._colors = colors
        self._label = label
        # self._display = board.DISPLAY
        self._font = terminalio.FONT
        if font:
            self._font = font

        self.text_group = displayio.Group(max_size=20, scale=text_scale)

        if title:
            # Fail gracefully if title is longer than 60 characters.
            if len(title) > 60:
                raise ValueError("Title must be 60 characters or less.")

            title = label.Label(
                self._font,
                text=title,
                max_glyphs=60,
                color=title_color,
                scale=title_scale,
            )
            title.x = 0

            title_count_y = 8
            for i in range(title_scale - 1):
                title_count_y -= 4
                if (i % 2) == 0:
                    title_count_y -= 2

            title.y = title_count_y  # 1 -> 8 // 2 -> 2 // 3 -> -2 // 4 -> -8 // 5 -> -12 // 6 -> -18 // 7 -> -22 // 8 -> -28 // 9 -> -32
            self._y = (
                title.y + 13 + (title_scale * 5)
            )  # 1 -> 18 // 2 -> 23 // 3 -> 28 // 4 -> 33 // 5 -> 38 // 6 -> 43 // 7 -> 48

            self.text_group.append(title)
        else:
            self._y = 3

        self._lines = []
        for num in range(1):
            self._lines.append(self.add_text_line(color=colors[num % len(colors)]))

    def __getitem__(self, item):
        """Fetch the Nth text line Group"""
        if len(self._lines) - 1 < item:
            for _ in range(item - (len(self._lines) - 1)):
                self._lines.append(
                    self.add_text_line(color=self._colors[item % len(self._colors)])
                )
        return self._lines[item]

    def add_text_line(self, color=0xFFFFFF):
        """Adds a line on the display of the specified color and returns the label object."""
        text_label = self._label.Label(self._font, text="", max_glyphs=45, color=color)
        text_label.x = 0
        text_label.y = self._y
        self._y = text_label.y + 13
        self.text_group.append(text_label)

        return text_label

    def show(self):
        """Call show() to display the data list."""
        img = Image.new("RGB", (240, 240), "black")  # Create a new black image
        bmp_img = img.load()  # Create the pixel map
        self.text_group.draw(bmp_img)
        img.show()
        img.save("test.bmp")

    def show_terminal(self):
        """Revert to terminalio screen."""
        # self._display.show(None)
        return


class Clue:  # pylint: disable=too-many-instance-attributes, too-many-public-methods
    """Represents a single CLUE."""

    # Color variables available for import.
    RED = (255, 0, 0)
    YELLOW = (255, 255, 0)
    ORANGE = (255, 150, 0)
    GREEN = (0, 255, 0)
    TEAL = (0, 255, 120)
    CYAN = (0, 255, 255)
    BLUE = (0, 0, 255)
    PURPLE = (180, 0, 255)
    MAGENTA = (255, 0, 150)
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)

    GOLD = (255, 222, 30)
    PINK = (242, 90, 255)
    AQUA = (50, 255, 255)
    JADE = (0, 255, 40)
    AMBER = (255, 100, 0)
    VIOLET = (255, 0, 255)
    SKY = (0, 180, 255)

    RAINBOW = (RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE)

    # def __init__(self):
    #   return
    #     # # Define I2C:
    #     # self._i2c = board.I2C()

    #     # # Define touch:
    #     # # Initially, self._touches stores the pin used for a particular touch. When that touch is
    #     # # used for the first time, the pin is replaced with the corresponding TouchIn object.
    #     # # This saves a little RAM over using a separate read-only pin tuple.
    #     # # For example, after `clue.touch_2`, self._touches is equivalent to:
    #     # # [board.D0, board.D1, touchio.TouchIn(board.D2)]
    #     # self._touches = [board.D0, board.D1, board.D2]
    #     # self._touch_threshold_adjustment = 0

    #     # # Define buttons:
    #     # self._a = digitalio.DigitalInOut(board.BUTTON_A)
    #     # self._a.switch_to_input(pull=digitalio.Pull.UP)
    #     # self._b = digitalio.DigitalInOut(board.BUTTON_B)
    #     # self._b.switch_to_input(pull=digitalio.Pull.UP)
    #     # self._gamepad = gamepad.GamePad(self._a, self._b)

    #     # # Define LEDs:
    #     # self._white_leds = digitalio.DigitalInOut(board.WHITE_LEDS)
    #     # self._white_leds.switch_to_output()
    #     # self._pixel = neopixel.NeoPixel(board.NEOPIXEL, 1)
    #     # self._red_led = digitalio.DigitalInOut(board.L)
    #     # self._red_led.switch_to_output()

    #     # # Define audio:
    #     # self._mic = audiobusio.PDMIn(board.MICROPHONE_CLOCK, board.MICROPHONE_DATA,
    #     #                              sample_rate=16000, bit_depth=16)
    #     # self._sample = None
    #     # self._samples = None
    #     # self._sine_wave = None
    #     # self._sine_wave_sample = None

    #     # # Define sensors:
    #     # # Accelerometer/gyroscope:
    #     # self._accelerometer = adafruit_lsm6ds.LSM6DS33(self._i2c)

    #     # # Magnetometer:
    #     # self._magnetometer = adafruit_lis3mdl.LIS3MDL(self._i2c)

    #     # # DGesture/proximity/color/light sensor:
    #     # self._sensor = adafruit_apds9960.apds9960.APDS9960(self._i2c)

    #     # # Humidity sensor:
    #     # self._humidity = adafruit_sht31d.SHT31D(self._i2c)

    #     # # Barometric pressure sensor:
    #     # self._pressure = adafruit_bmp280.Adafruit_BMP280_I2C(self._i2c)

    #     # # Create displayio object for passing.
    #     # self.display = board.DISPLAY

    # def _touch(self, i):
    #     if not isinstance(self._touches[i], touchio.TouchIn):
    #         # First time referenced. Get the pin from the slot for this touch
    #         # and replace it with a TouchIn object for the pin.
    #         self._touches[i] = touchio.TouchIn(self._touches[i])
    #         self._touches[i].threshold += self._touch_threshold_adjustment
    #     return self._touches[i].value

    # @property
    # def touch_0(self):
    #     """Detect touch on capacitive touch pad 0.

    #     .. image :: ../docs/_static/pad_0.jpg
    #       :alt: Pad 0

    #     This example prints when pad 0 is touched.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           if clue.touch_0:
    #               print("Touched pad 0")
    #     """
    #     return self._touch(0)

    # @property
    # def touch_1(self):
    #     """Detect touch on capacitive touch pad 1.

    #     .. image :: ../docs/_static/pad_1.jpg
    #       :alt: Pad 1

    #     This example prints when pad 1 is touched.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           if clue.touch_1:
    #               print("Touched pad 1")
    #     """
    #     return self._touch(1)

    # @property
    # def touch_2(self):
    #     """Detect touch on capacitive touch pad 2.

    #     .. image :: ../docs/_static/pad_2.jpg
    #       :alt: Pad 2

    #     This example prints when pad 2 is touched.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           if clue.touch_2:
    #               print("Touched pad 2")
    #     """
    #     return self._touch(2)

    # @property
    # def button_a(self):
    #     """``True`` when Button A is pressed. ``False`` if not.

    #     .. image :: ../docs/_static/button_a.jpg
    #       :alt: Button A

    #     This example prints when button A is pressed.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           if clue.button_a:
    #               print("Button A pressed")
    #     """
    #     return not self._a.value

    # @property
    # def button_b(self):
    #     """``True`` when Button B is pressed. ``False`` if not.

    #     .. image :: ../docs/_static/button_b.jpg
    #       :alt: Button B

    #     This example prints when button B is pressed.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           if clue.button_b:
    #               print("Button B pressed")
    #     """
    #     return not self._b.value

    # @property
    # def were_pressed(self):
    #     """Returns a set of the buttons that have been pressed.

    #     .. image :: ../docs/_static/button_b.jpg
    #       :alt: Button B

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print(clue.were_pressed)
    #     """
    #     ret = set()
    #     pressed = self._gamepad.get_pressed()
    #     for button, mask in (('A', 0x01), ('B', 0x02)):
    #         if mask & pressed:
    #             ret.add(button)
    #     return ret

    # def shake(self, shake_threshold=30, avg_count=10, total_delay=0.1):
    #     """
    #     Detect when the accelerometer is shaken. Optional parameters:

    #     :param shake_threshold: Increase or decrease to change shake sensitivity. This
    #                             requires a minimum value of 10. 10 is the total
    #                             acceleration if the board is not moving, therefore
    #                             anything less than 10 will erroneously report a constant
    #                             shake detected. (Default 30)

    #     :param avg_count: The number of readings taken and used for the average
    #                       acceleration. (Default 10)

    #     :param total_delay: The total time in seconds it takes to obtain avg_count
    #                         readings from acceleration. (Default 0.1)
    #      """
    #     shake_accel = (0, 0, 0)
    #     for _ in range(avg_count):
    #         # shake_accel creates a list of tuples from acceleration data.
    #         # zip takes multiple tuples and zips them together, as in:
    #         # In : zip([-0.2, 0.0, 9.5], [37.9, 13.5, -72.8])
    #         # Out: [(-0.2, 37.9), (0.0, 13.5), (9.5, -72.8)]
    #         # map applies sum to each member of this tuple, resulting in a
    #         # 3-member list. tuple converts this list into a tuple which is
    #         # used as shake_accel.
    #         shake_accel = tuple(map(sum, zip(shake_accel, self.acceleration)))
    #         time.sleep(total_delay / avg_count)
    #     avg = tuple(value / avg_count for value in shake_accel)
    #     total_accel = math.sqrt(sum(map(lambda x: x * x, avg)))
    #     return total_accel > shake_threshold

    # @property
    # def acceleration(self):
    #     """Obtain acceleration data from the x, y and z axes.

    #     .. image :: ../docs/_static/accelerometer.jpg
    #       :alt: Accelerometer

    #     This example prints the values. Try moving the board to see how the printed values change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Accel: {:.2f} {:.2f} {:.2f}".format(*clue.acceleration))
    #     """
    #     return self._accelerometer.acceleration

    # @property
    # def gyro(self):
    #     """Obtain x, y, z angular velocity values in degrees/second.

    #     .. image :: ../docs/_static/accelerometer.jpg
    #       :alt: Gyro

    #     This example prints the values. Try moving the board to see how the printed values change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Gyro: {:.2f} {:.2f} {:.2f}".format(*clue.gyro))
    #     """
    #     return self._accelerometer.gyro

    # @property
    # def magnetic(self):
    #     """Obtain x, y, z magnetic values in microteslas.

    #     .. image :: ../docs/_static/magnetometer.jpg
    #       :alt: Magnetometer

    #     This example prints the values. Try moving the board to see how the printed values change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Magnetic: {:.3f} {:.3f} {:.3f}".format(*clue.magnetic))
    #     """
    #     return self._magnetometer.magnetic

    # @property
    # def proximity(self):
    #     """A relative proximity to the sensor in values from 0 - 255.

    #     .. image :: ../docs/_static/proximity.jpg
    #       :alt: Proximity sensor

    #     This example prints the value. Try moving your hand towards and away from the front of the
    #     board to see how the printed values change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Proximity: {}".format(clue.proximity))
    #     """
    #     self._sensor.enable_proximity = True
    #     return self._sensor.proximity()

    # @property
    # def color(self):
    #     """The red, green, blue, and clear light values. (r, g, b, c)

    #     .. image :: ../docs/_static/proximity.jpg
    #       :alt: Color sensor

    #     This example prints the values. Try holding something up to the sensor to see the values
    #     change. Works best with white LEDs enabled.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Color: R: {} G: {} B: {} C: {}".format(*clue.color))
    #     """
    #     self._sensor.enable_color = True
    #     return self._sensor.color_data

    # @property
    # def gesture(self):
    #     """A gesture code if gesture is detected. Shows ``0`` if no gesture detected.
    #     ``1`` if an UP gesture is detected, ``2`` if DOWN, ``3`` if LEFT, and ``4`` if RIGHT.

    #     .. image :: ../docs/_static/proximity.jpg
    #       :alt: Gesture sensor

    #     This example prints the gesture values. Try moving your hand up, down, left or right over
    #     the sensor to see the value change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Gesture: {}".format(clue.gesture))
    #     """
    #     self._sensor.enable_gesture = True
    #     return self._sensor.gesture()

    # @property
    # def humidity(self):
    #     """The measured relative humidity in percent.

    #     .. image :: ../docs/_static/humidity.jpg
    #       :alt: Humidity sensor

    #     This example prints the value. Try breathing on the sensor to see the values change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print("Humidity: {:.1f}%".format(clue.humidity))
    #     """
    #     return self._humidity.relative_humidity

    # @property
    # def pressure(self):
    #     """The barometric pressure in hectoPascals.

    #     .. image :: ../docs/_static/pressure.jpg
    #       :alt: Barometric pressure sensor

    #     This example prints the value.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         print("Pressure: {:.3f}hPa".format(clue.pressure))
    #     """
    #     return self._pressure.pressure

    # @property
    # def temperature(self):
    #     """The temperature in degrees Celsius.

    #     .. image :: ../docs/_static/pressure.jpg
    #       :alt: Temperature sensor

    #     This example prints the value. Try touching the sensor to see the value change.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         print("Temperature: {:.1f}C".format(clue.temperature))
    #     """
    #     return self._pressure.temperature

    # @property
    # def altitude(self):
    #     """The altitude in meters based on the sea level pressure at your location. You must set
    #     ``sea_level_pressure`` to receive an accurate reading.

    #     .. image :: ../docs/_static/pressure.jpg
    #       :alt: Altitude sensor

    #     This example prints the value. Try moving the board vertically to see the value change.

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         clue.sea_level_pressure = 1015

    #         print("Altitude: {:.1f}m".format(clue.altitude))
    #     """
    #     return self._pressure.altitude

    # @property
    # def sea_level_pressure(self):
    #     """Set to the pressure at sea level at your location, before reading altitude for
    #     the most accurate altitude measurement.

    #     .. image :: ../docs/_static/pressure.jpg
    #       :alt: Barometric pressure sensor

    #     This example prints the value.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         clue.sea_level_pressure = 1015

    #         print("Pressure: {:.3f}hPa".format(clue.pressure))
    #     """
    #     return self._pressure.sea_level_pressure

    # @sea_level_pressure.setter
    # def sea_level_pressure(self, value):
    #     self._pressure.sea_level_pressure = value

    # @property
    # def white_leds(self):
    #     """The red led next to the USB plug labeled LED.

    #     .. image :: ../docs/_static/white_leds.jpg
    #       :alt: White LEDs

    #     This example turns on the white LEDs.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         clue.white_leds = True
    #     """
    #     return self._white_leds.value

    # @white_leds.setter
    # def white_leds(self, value):
    #     self._white_leds.value = value

    # @property
    # def red_led(self):
    #     """The red led next to the USB plug labeled LED.

    #     .. image :: ../docs/_static/red_led.jpg
    #       :alt: Red LED

    #     This example turns on the red LED.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         clue.red_led = True
    #     """
    #     return self._red_led.value

    # @red_led.setter
    # def red_led(self, value):
    #     self._red_led.value = value

    # @property
    # def pixel(self):
    #     """The NeoPixel RGB LED.

    #     .. image :: ../docs/_static/neopixel.jpg
    #       :alt: NeoPixel

    #     This example turns the NeoPixel purple.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         while True:
    #             clue.pixel.fill((255, 0, 255))
    #     """
    #     return self._pixel

    # @staticmethod
    # def _sine_sample(length):
    #     tone_volume = (2 ** 15) - 1
    #     shift = 2 ** 15
    #     for i in range(length):
    #         yield int(tone_volume * math.sin(2*math.pi*(i / length)) + shift)

    # def _generate_sample(self, length=100):
    #     if self._sample is not None:
    #         return
    #     self._sine_wave = array.array("H", self._sine_sample(length))
    #     self._sample = audiopwmio.PWMAudioOut(board.SPEAKER)
    #     self._sine_wave_sample = audiocore.RawSample(self._sine_wave)

    # def play_tone(self, frequency, duration):
    #     """ Produce a tone using the speaker. Try changing frequency to change
    #     the pitch of the tone.

    #     :param int frequency: The frequency of the tone in Hz
    #     :param float duration: The duration of the tone in seconds

    #     .. image :: ../docs/_static/speaker.jpg
    #       :alt: Speaker

    #     This example plays a 880 Hz tone for a duration of 1 second.

    #     To use with the CLUE:

    #     .. code-block:: python

    #         from adafruit_clue import clue

    #         clue.play_tone(880, 1)
    #     """
    #     # Play a tone of the specified frequency (hz).
    #     self.start_tone(frequency)
    #     time.sleep(duration)
    #     self.stop_tone()

    # def start_tone(self, frequency):
    #     """ Produce a tone using the speaker. Try changing frequency to change
    #     the pitch of the tone.

    #     :param int frequency: The frequency of the tone in Hz

    #     .. image :: ../docs/_static/speaker.jpg
    #       :alt: Speaker

    #     This example plays a 523Hz tone when button A is pressed and a 587Hz tone when button B is
    #     pressed, only while the buttons are being pressed.

    #     To use with the CLUE:

    #     .. code-block:: python

    #          from adafruit_clue import clue

    #          while True:
    #              if clue.button_a:
    #                  clue.start_tone(523)
    #              elif clue.button_b:
    #                  clue.start_tone(587)
    #              else:
    #                  clue.stop_tone()
    #     """
    #     length = 100
    #     if length * frequency > 350000:
    #         length = 350000 // frequency
    #     self._generate_sample(length)
    #     # Start playing a tone of the specified frequency (hz).
    #     self._sine_wave_sample.sample_rate = int(len(self._sine_wave) * frequency)
    #     if not self._sample.playing:
    #         self._sample.play(self._sine_wave_sample, loop=True)

    # def stop_tone(self):
    #     """ Use with start_tone to stop the tone produced.

    #     .. image :: ../docs/_static/speaker.jpg
    #       :alt: Speaker

    #     This example plays a 523Hz tone when button A is pressed and a 587Hz tone when button B is
    #     pressed, only while the buttons are being pressed.

    #     To use with the CLUE:

    #     .. code-block:: python

    #          from adafruit_clue import clue

    #          while True:
    #              if clue.button_a:
    #                  clue.start_tone(523)
    #              elif clue.button_b:
    #                  clue.start_tone(587)
    #              else:
    #                  clue.stop_tone()
    #     """
    #     # Stop playing any tones.
    #     if self._sample is not None and self._sample.playing:
    #         self._sample.stop()
    #         self._sample.deinit()
    #         self._sample = None

    # @staticmethod
    # def _normalized_rms(values):
    #     mean_values = int(sum(values) / len(values))
    #     return math.sqrt(sum(float(sample - mean_values) * (sample - mean_values)
    #                          for sample in values) / len(values))

    # @property
    # def sound_level(self):
    #     """Obtain the sound level from the microphone (sound sensor).

    #     .. image :: ../docs/_static/microphone.jpg
    #       :alt: Microphone (sound sensor)

    #     This example prints the sound levels. Try clapping or blowing on
    #     the microphone to see the levels change.

    #     .. code-block:: python

    #       from adafruit_clue import clue

    #       while True:
    #           print(clue.sound_level)
    #     """
    #     if self._sample is None:
    #         self._samples = array.array('H', [0] * 160)
    #     self._mic.record(self._samples, len(self._samples))
    #     return self._normalized_rms(self._samples)

    # def loud_sound(self, sound_threshold=200):
    # """Utilise a loud sound as an input.

    # :param int sound_threshold: Threshold sound level must exceed to return true (Default: 200)

    # .. image :: ../docs/_static/microphone.jpg
    #   :alt: Microphone (sound sensor)

    # This example turns the NeoPixel LED blue each time you make a loud sound.
    # Try clapping or blowing onto the microphone to trigger it.

    # .. code-block:: python

    #   from adafruit_clue import clue

    #   while True:
    #       if clue.loud_sound():
    #           clue.pixel.fill((0, 50, 0))
    #       else:
    #           clue.pixel.fill(0)

    # You may find that the code is not responding how you would like.
    # If this is the case, you can change the loud sound threshold to
    # make it more or less responsive. Setting it to a higher number
    # means it will take a louder sound to trigger. Setting it to a
    # lower number will take a quieter sound to trigger. The following
    # example shows the threshold being set to a higher number than
    # the default.

    # .. code-block:: python

    #   from adafruit_clue import clue

    #   while True:
    #       if clue.loud_sound(sound_threshold=300):
    #           clue.pixel.fill((0, 50, 0))
    #       else:
    #           clue.pixel.fill(0)
    # """

    # return self.sound_level > sound_threshold

    @staticmethod
    def simple_text_display(
        title=None,
        title_color=(255, 255, 255),
        title_scale=1,  # pylint: disable=too-many-arguments
        text_scale=1,
        font=None,
        colors=None,
    ):
        """Display lines of text on the CLUE display. Lines of text are created in order as shown
        in the example below. If you skip a number, the line will be shown blank on the display,
        e.g. if you include ``[0]`` and ``[2]``, the second line on the display will be empty, and
        the text specified for lines 0 and 2 will be displayed on the first and third line.
        Remember, Python begins counting at 0, so the first line on the display is 0 in the code.

        Setup occurs before the loop. For data to be dynamically updated on the display, you must
        include the data call in the loop by using ``.text =``. For example, if setup is saved as
        ``clue_data = display_clue_data()`` then ``clue_data[0].text = clue.proximity`` must be
        inside the ``while True:`` loop for the proximity data displayed to update as the
        values change. You must call ``show()`` at the end of the list for anything to display.
        See example below for usage.

        :param str title: The title displayed above the data. Set ``title="Title text"`` to provide
                          a title. Defaults to None.
        :param title_color: The color of the title. Not necessary if no title is provided. Defaults
                            to white (255, 255, 255).
        :param int title_scale: Scale the size of the title. Not necessary if no title is provided.
                                Defaults to 1.
        :param int text_scale: Scale the size of the data lines. Scales the title as well.
                               Defaults to 1.
        :param str font: The font to use to display the title and data. Defaults to built in
                     ``terminalio.FONT``.
        :param colors: A list of colors for the lines of data on the display. If you provide a
                       single color, all lines will be that color. Otherwise it will cycle through
                       the list you provide if the list is less than the number of lines displayed.
                       Default colors are used if ``colors`` is not set. For example, if creating
                       two lines of data, ``colors=((255, 255, 255), (255, 0, 0))`` would set the
                       first line white and the second line red, and if you created four lines of
                       data with the same setup, it would alternate white and red.

        .. image :: ../docs/_static/display_clue_data.jpg
          :alt: Display Clue Data demo

        This example displays three lines with acceleration, gyro and magnetic data on the display.
        Remember to call ``show()`` after the list to update the display.

        .. code-block:: python

          from adafruit_clue import clue

          clue_data = clue.simple_text_display(title="CLUE Sensor Data!", title_scale=2)

          while True:
              clue_data[0].text = "Acceleration: {:.2f} {:.2f} {:.2f}".format(*clue.acceleration)
              clue_data[1].text = "Gyro: {:.2f} {:.2f} {:.2f}".format(*clue.gyro)
              clue_data[2].text = "Magnetic: {:.3f} {:.3f} {:.3f}".format(*clue.magnetic)
              clue_data.show()
        """
        return _ClueSimpleTextDisplay(
            title=title,
            title_color=title_color,
            title_scale=title_scale,
            text_scale=text_scale,
            font=font,
            colors=colors,
        )


clue = Clue()  # pylint: disable=invalid-name
"""Object that is automatically created on import.

   To use, simply import it from the module:

   .. code-block:: python

   from adafruit_clue import clue
"""
