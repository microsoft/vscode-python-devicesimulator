import pytest

import os
import pathlib
from PIL import Image

from unittest import mock
from unittest.mock import MagicMock, patch

from common import utils

import displayio
import terminalio

from ..adafruit_clue import clue
from .test_helpers import helper
from base_circuitpython import base_cp_constants as CONSTANTS


class TestAdafruitClue(object):
    def setup_method(self):
        self.abs_path = pathlib.Path(__file__).parent.absolute()

        self.main_img = Image.new(
            "RGBA",
            (CONSTANTS.SCREEN_HEIGHT_WIDTH, CONSTANTS.SCREEN_HEIGHT_WIDTH),
            (0, 0, 0, 0),
        )

        utils.send_to_simulator = mock.Mock()

    def test_clue_display_text(self):
        img = Image.open(
            os.path.join(self.abs_path, CONSTANTS.IMG_DIR_NAME, f"test_clue_text_1.bmp")
        )

        img.putalpha(255)
        expected = img.load()
        clue_data = clue.simple_text_display(title="LET'S TEST!", title_scale=2)

        clue_data.text_group.show = self._send_helper
        clue_data.text_group._Group__check_active_group_ref = False

        clue_data[0].text = "Lorem ipsum"
        clue_data[1].text = "dolor sit amet, consectetur "
        clue_data[2].text = "adipiscing:"

        clue_data[4].text = "e"
        clue_data[5].text = "sed do eiusmod"
        clue_data[6].text = "tempor incididunt\nut labore"
        clue_data[7].text = "ut labore"

        clue_data[10].text = "et dolore"
        clue_data[11].text = "magna"
        clue_data[12].text = "aliqua\ntestest"
        clue_data[13].text = "Ut enim ad"
        clue_data[14].text = "Excepteur sint"
        clue_data.show()
        helper._Helper__test_image_equality(self.main_img.load(), expected)

    def _send_helper(self, image):
        self.main_img = image

    def test_buttons(self):
        clue._Clue__update_button(CONSTANTS.CLUE_STATE.BUTTON_A, True)
        assert clue.button_a
        clue._Clue__update_button(CONSTANTS.CLUE_STATE.BUTTON_A, False)
        assert not clue.button_a

        clue._Clue__update_button(CONSTANTS.CLUE_STATE.BUTTON_B, True)
        assert clue.button_b
        clue._Clue__update_button(CONSTANTS.CLUE_STATE.BUTTON_B, False)
        assert not clue.button_b

        assert clue.were_pressed == set(["A", "B"])
        assert clue.were_pressed == set()

    @pytest.mark.parametrize(
        "mock_x, mock_y, mock_z", [(1, 2, 3), (0, 0, 0), (4, 6, 100)]
    )
    def test_acceleration(self, mock_x, mock_y, mock_z):
        clue._Clue__state[CONSTANTS.CLUE_STATE.MOTION_X] = mock_x
        clue._Clue__state[CONSTANTS.CLUE_STATE.MOTION_Y] = mock_y
        clue._Clue__state[CONSTANTS.CLUE_STATE.MOTION_Z] = mock_z
        assert clue.acceleration == (mock_x, mock_y, mock_z)

    @pytest.mark.parametrize(
        "mock_color_r, mock_color_g,mock_color_b,mock_color_c",
        [(1, 2, 3, 4), (255, 255, 255, 255), (120, 140, 160, 180)],
    )
    def test_color(self, mock_color_r, mock_color_g, mock_color_b, mock_color_c):
        clue._Clue__state[CONSTANTS.CLUE_STATE.LIGHT_R] = mock_color_r
        clue._Clue__state[CONSTANTS.CLUE_STATE.LIGHT_G] = mock_color_g
        clue._Clue__state[CONSTANTS.CLUE_STATE.LIGHT_B] = mock_color_b
        clue._Clue__state[CONSTANTS.CLUE_STATE.LIGHT_C] = mock_color_c
        assert clue.color == (mock_color_r, mock_color_g, mock_color_b, mock_color_c)

    @pytest.mark.parametrize("mock_temperature", [-10, 0, 10])
    def test_temperature(self, mock_temperature):
        clue._Clue__state[CONSTANTS.CLUE_STATE.TEMPERATURE] = mock_temperature
        assert clue.temperature == mock_temperature

    @pytest.mark.parametrize(
        "mock_magnetic_x, mock_magnetic_y, mock_magnetic_z",
        [(1, 2, 3), (100, 150, 200), (10, 5, 15)],
    )
    def test_magnetic(self, mock_magnetic_x, mock_magnetic_y, mock_magnetic_z):
        clue._Clue__state[CONSTANTS.CLUE_STATE.MAGNET_X] = mock_magnetic_x
        clue._Clue__state[CONSTANTS.CLUE_STATE.MAGNET_Y] = mock_magnetic_y
        clue._Clue__state[CONSTANTS.CLUE_STATE.MAGNET_Z] = mock_magnetic_z
        assert clue.magnetic == (mock_magnetic_x, mock_magnetic_y, mock_magnetic_z,)

    @pytest.mark.parametrize("mock_distance", (0, 10, 250, 255))
    def test_proximity(self, mock_distance):
        clue._Clue__state[CONSTANTS.CLUE_STATE.PROXIMITY] = mock_distance
        assert clue.proximity == mock_distance

    @pytest.mark.parametrize(
        "mock_gyro_x, mock_gyro_y, mock_gyro_z",
        [(1, 2, 3), (100, 150, 200), (10, 5, 15)],
    )
    def test_gyro(self, mock_gyro_x, mock_gyro_y, mock_gyro_z):
        clue._Clue__state[CONSTANTS.CLUE_STATE.GYRO_X] = mock_gyro_x
        clue._Clue__state[CONSTANTS.CLUE_STATE.GYRO_Y] = mock_gyro_y
        clue._Clue__state[CONSTANTS.CLUE_STATE.GYRO_Z] = mock_gyro_z
        assert clue.gyro == (mock_gyro_x, mock_gyro_y, mock_gyro_z)

    @pytest.mark.parametrize(
        "gesture_word, gesture_number",
        [("", 0), ("up", 1), ("down", 2), ("left", 3), ("right", 4)],
    )
    def test_gesture(self, gesture_word, gesture_number):
        clue._Clue__state[CONSTANTS.CLUE_STATE.GESTURE] = gesture_word
        assert clue.gesture == gesture_number

    def test_shake(self):
        NONE = "none"
        SHAKE = "shake"
        clue._Clue__state[CONSTANTS.CLUE_STATE.GESTURE] = SHAKE
        assert clue.shake()
        clue._Clue__state[CONSTANTS.CLUE_STATE.GESTURE] = NONE
        assert not clue.shake()

    @pytest.mark.parametrize("mock_humidity", [0, 10, 50, 100])
    def test_humidity(self, mock_humidity):
        clue._Clue__state[CONSTANTS.CLUE_STATE.HUMIDITY] = mock_humidity
        assert clue.humidity == mock_humidity

    @pytest.mark.parametrize("mock_pressure", [0, 10, 50, 100])
    def test_pressure(self, mock_pressure):
        clue._Clue__state[CONSTANTS.CLUE_STATE.PRESSURE] = mock_pressure
        assert clue.pressure == mock_pressure

    @pytest.mark.parametrize(
        "mock_pressure, mock_sea_level_pressure, expected_altitude",
        [
            (1000, 1015, 125.42255615546036),
            (1030, 1015, -123.93061640175468),
            (1020, 1013, -58.13176263932101),
        ],
    )
    def test_altitude(self, mock_pressure, mock_sea_level_pressure, expected_altitude):
        clue.sea_level_pressure = mock_sea_level_pressure
        clue._Clue__state[CONSTANTS.CLUE_STATE.PRESSURE] = mock_pressure
        assert expected_altitude == pytest.approx(clue.altitude)

    @pytest.mark.parametrize("mock_sea_level_pressure", [1040, 1015, 1013])
    def test_sea_level_pressure(self, mock_sea_level_pressure):
        clue.sea_level_pressure = mock_sea_level_pressure
        assert mock_sea_level_pressure == clue.sea_level_pressure

    @pytest.mark.parametrize(
        "mock_color", [(255, 0, 0), (255, 255, 255), (123, 123, 123)]
    )
    def test_pixel(self, mock_color):
        clue.pixel.fill(mock_color)
        assert clue.pixel[0] == mock_color

    @pytest.mark.parametrize(
        "value, expected",
        [(True, True), (False, False), (1, True), ("a", True), (0, False), ("", False)],
    )
    def test_red_led(self, value, expected):
        clue.red_led = value
        assert clue.red_led == expected

    @pytest.mark.parametrize(
        "value, expected",
        [(True, True), (False, False), (1, True), ("a", True), (0, False), ("", False)],
    )
    def test_white_leds(self):
        clue.white_leds = value
        assert clue.white_leds == expected
