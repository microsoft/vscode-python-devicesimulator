import pytest
from unittest import mock
import sys

import playsound

from src.adafruit_circuitplayground.express import Express
from src.adafruit_circuitplayground.pixel import Pixel


class TestExpress(object):

    def setup_method(self):
        self.cpx = Express()
        self.__state = {
            'brightness': 1.0,
            'button_a': False,
            'button_b': False,
            'pixels': [(255, 0, 0)] * 10,
            'red_led': False,
            'switch': False
        }
        self.pixels = Pixel(self.__state)
        self.__speaker_enabled = False

    def test_acceleration(self):
        self.cpx._Express__state["motion_x"] = 10
        self.cpx._Express__state["motion_y"] = -10
        self.cpx._Express__state["motion_z"] = -20
        accel = self.cpx.acceleration
        assert accel[0] == 10
        assert accel[1] == -10
        assert accel[2] == -20

    def test_button_a(self):
        self.cpx._Express__state['button_a'] = True
        assert True == self.cpx.button_a

    def test_button_b(self):
        self.cpx._Express__state['button_b'] = True
        assert True == self.cpx.button_b

    def test_red_led(self):
        self.cpx._Express__state['red_led'] = True
        assert True == self.cpx.red_led

    def test_red_led_int(self):
        self.cpx.red_led = 3
        assert True == self.cpx.red_led

    def test_red_led_string(self):
        self.cpx.red_led = 'foo'
        assert True == self.cpx.red_led

    def test_switch(self):
        self.cpx._Express__state['switch'] = True
        assert True == self.cpx.switch

    def test_temperature(self):
        self.cpx._Express__state['temperature'] = 31
        assert 31 == self.cpx.temperature

    def test_light(self):
        self.cpx._Express__state['light'] = 255

    def test_shake(self):
        self.cpx._Express__state['shake'] = True
        assert True == self.cpx.shake()

    def test_touch_A1(self):
        self.cpx._Express__state['touch'][0] = True
        assert True == self.cpx.touch_A1

    def test_touch_A2(self):
        self.cpx._Express__state['touch'][1] = True
        assert True == self.cpx.touch_A2

    def test_touch_A3(self):
        self.cpx._Express__state['touch'][2] = True
        assert True == self.cpx.touch_A3
        
    def test_touch_A4(self):
        self.cpx._Express__state['touch'][3] = True
        assert True == self.cpx.touch_A4

    def test_touch_A5(self):
        self.cpx._Express__state['touch'][4] = True
        assert True == self.cpx.touch_A5
        
    def test_touch_A6(self):
        self.cpx._Express__state['touch'][5] = True
        assert True == self.cpx.touch_A6

    def test_touch_A7(self):
        self.cpx._Express__state['touch'][6] = True
        assert True == self.cpx.touch_A7

    def test_play_file_mp_wrong_type(self):
        with pytest.raises(TypeError):
            self.cpx.play_file('sample.mp4')

    # Mock playsound.playsound and check that it is called #TODO
    # @mock.patch('playsound.playsound')
    # def test_play_file_mp(self, mock_playsound):
    #     if sys.platform == "win32":
    #         mock_playsound.return_value = None
    #         print(mock_playsound)
    #         self.cpx.play_file("sample.wav")
    #         assert True == playsound.playsound.called()

            # with mock.patch('playsound.playsound') as mock_playsound:
            #     self.cpx.play_file("sample.wav")
            #     mock_playsound.assert_called_with("sample.wav")

    # Pixels tests
    def test_fill(self):
        self.cpx.pixels.fill((0, 255, 0))
        expected_pixels = [(0, 255, 0)] * 10
        assert expected_pixels == self.cpx._Express__state['pixels']

    def test_extract_pixel_value_list(self):
        assert (0, 255, 0) == self.cpx.pixels._Pixel__extract_pixel_value((0, 255, 0))

    def test_extract_pixel_value_list1(self):
        assert (123, 123, 123) == self.cpx.pixels._Pixel__extract_pixel_value(
            [123, 123, 123])

    def test_extract_pixel_value_int(self):
        assert (0, 0, 255) == self.cpx.pixels._Pixel__extract_pixel_value(255)

    def test_extract_pixel_value_tuple(self):
        assert (0, 255, 0) == self.cpx.pixels._Pixel__extract_pixel_value(
            (0, 255, 0))

    def test_extract_pixel_value_invalid_length(self):
        with pytest.raises(ValueError):
            self.cpx.pixels._Pixel__extract_pixel_value((1, 2, 3, 4))

    def test_extract_pixel_value_invalid_tuple_value(self):
        with pytest.raises(ValueError):
            self.cpx.pixels._Pixel__extract_pixel_value((0, 222, "hello"))

    def test_set_item_tuple(self):
        self.cpx.pixels[0] = (255, 255, 255)
        assert (255, 255, 255) == self.cpx._Express__state['pixels'][0]

    def test_set_item_list(self):
        self.cpx.pixels[0] = [255, 255, 255]
        assert (255, 255, 255) == self.cpx._Express__state['pixels'][0]

    def test_set_item_hex(self):
        self.cpx.pixels[0] = 0xFFFFFF
        assert (255, 255, 255) == self.cpx._Express__state['pixels'][0]

    def test_set_item_invalid(self):
        with pytest.raises(ValueError):
            self.cpx.pixels[0] = "hello"
