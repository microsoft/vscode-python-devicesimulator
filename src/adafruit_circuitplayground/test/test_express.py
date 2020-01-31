import pytest
from unittest import mock

import playsound
from ..express import Express
from ..pixel import Pixel


class TestExpress(object):
    def setup_method(self):
        self.cpx = Express()
        self.__state = {
            "brightness": 1.0,
            "button_a": False,
            "button_b": False,
            "pixels": [(255, 0, 0)] * 10,
            "red_led": False,
            "switch": False,
        }
        self.pixels = Pixel(self.__state)
        self.__speaker_enabled = False

    def test_acceleration(self):
        mock_motion_x = 10
        mock_motion_y = -10
        mock_motion_z = -20
        self.cpx._Express__state["motion_x"] = mock_motion_x
        self.cpx._Express__state["motion_y"] = mock_motion_y
        self.cpx._Express__state["motion_z"] = mock_motion_z
        accel = self.cpx.acceleration
        assert accel[0] == 10
        assert accel[1] == -10
        assert accel[2] == -20

    def test_button_a(self):
        self.cpx._Express__state["button_a"] = True
        assert self.cpx.button_a

    def test_button_b(self):
        self.cpx._Express__state["button_b"] = True
        assert self.cpx.button_b

    def test_taps(self):
        self.cpx._Express__state["detect_taps"] = 2
        assert 2 == self.cpx.detect_taps

    @pytest.mark.parametrize("taps, expected", [(1, 1), (2, 2), (3, 1)])
    def test_taps_setter(self, taps, expected):
        self.cpx.detect_taps = taps
        assert expected == self.cpx.detect_taps

    def test_red_led(self):
        self.cpx._Express__state["red_led"] = True
        assert self.cpx.red_led

    def test_red_led_int(self):
        self.cpx.red_led = 3
        assert self.cpx.red_led

    def test_red_led_string(self):
        self.cpx.red_led = "foo"
        assert self.cpx.red_led

    def test_switch(self):
        self.cpx._Express__state["switch"] = True
        assert self.cpx.switch

    def test_temperature(self):
        self.cpx._Express__state["temperature"] = 31
        assert 31 == self.cpx.temperature

    def test_light(self):
        self.cpx._Express__state["light"] = 255
        assert 255 == self.cpx.light

    def test_shake(self):
        self.cpx._Express__state["shake"] = True
        assert self.cpx.shake()

    def test_touch_A1(self):
        self.cpx._Express__state["touch"][0] = True
        assert self.cpx.touch_A1

    def test_touch_A2(self):
        self.cpx._Express__state["touch"][1] = True
        assert self.cpx.touch_A2

    def test_touch_A3(self):
        self.cpx._Express__state["touch"][2] = True
        assert self.cpx.touch_A3

    def test_touch_A4(self):
        self.cpx._Express__state["touch"][3] = True
        assert self.cpx.touch_A4

    def test_touch_A5(self):
        self.cpx._Express__state["touch"][4] = True
        assert self.cpx.touch_A5

    def test_touch_A6(self):
        self.cpx._Express__state["touch"][5] = True
        assert self.cpx.touch_A6

    def test_touch_A7(self):
        self.cpx._Express__state["touch"][6] = True
        assert self.cpx.touch_A7

    def test_play_file_mp4_wrong_type(self):
        with pytest.raises(TypeError):
            self.cpx.play_file("sample.mp4")

    def test_play_file_mp4(self):
        playsound.playsound = mock.Mock()
        self.cpx.play_file("sample.wav")
        playsound.playsound.assert_called_once()
