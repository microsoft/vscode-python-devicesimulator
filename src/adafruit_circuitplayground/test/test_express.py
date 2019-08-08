import pytest

from ..express import Express
from ..pixel import Pixel


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

    def test_shake(self):
        self.cpx._Express__state['shake'] = True
        assert True == self.cpx.shake()

    def test_play_file_mp4(self):
        with pytest.raises(TypeError):
            self.cpx.play_file('sample.mp4')

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
