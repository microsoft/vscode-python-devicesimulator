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

        # reset bmp_img to all black
        displayio.img.paste(
            "black", [0, 0, displayio.img.size[0], displayio.img.size[1]]
        )

        utils.send_to_simulator = mock.Mock()

    def test_clue_display_text(self):
        img = Image.open(
            os.path.join(self.abs_path, CONSTANTS.IMG_DIR_NAME, f"test_clue_text_1.bmp")
        )
        img.putalpha(255)
        expected = img.load()
        clue_data = clue.simple_text_display(title="LET'S TEST!", title_scale=2)

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

        helper._Helper__test_image_equality(displayio.bmp_img, expected)

    def test_buttons(self):
        BUTTON_A = "button_a"
        BUTTON_B = "button_b"

        clue._Clue__update_button(BUTTON_A, True)
        assert clue.button_a
        clue._Clue__update_button(BUTTON_A, False)
        assert not clue.button_a

        clue._Clue__update_button(BUTTON_B, True)
        assert clue.button_b
        clue._Clue__update_button(BUTTON_B, False)
        assert not clue.button_b

        assert set(["A", "B"]) == clue.were_pressed
        assert set() == clue.were_pressed

    def test_acceleration(self):
        MOCK_MOTION_X_A = 1
        MOCK_MOTION_Y = 2
        MOCK_MOTION_Z = 3
        MOCK_MOTION_X_B = 4

        clue._Clue__state["acceleration"] = {"x": MOCK_MOTION_X_A, "y": MOCK_MOTION_Y, "z": MOCK_MOTION_Z}
        assert clue.acceleration == (MOCK_MOTION_X_A, MOCK_MOTION_Y, MOCK_MOTION_Z)
        clue._Clue__state["acceleration"]["x"] = MOCK_MOTION_X_B
        assert clue.acceleration == (MOCK_MOTION_X_B, MOCK_MOTION_Y, MOCK_MOTION_Z)

    def test_color(self):
        MOCK_COLOR_R_A = 1
        MOCK_COLOR_G = 2
        MOCK_COLOR_B = 3
        MOCK_COLOR_C = 4
        MOCK_COLOR_R_B = 5

        clue._Clue__state["color"] = {"r": MOCK_COLOR_R_A, "g": MOCK_COLOR_G, "b": MOCK_COLOR_B, "c": MOCK_COLOR_C}
        assert clue.color == (MOCK_COLOR_R_A, MOCK_COLOR_G, MOCK_COLOR_B, MOCK_COLOR_C)
        assert clue._Clue__state["color"]["r"] = MOCK_COLOR_R_B
        assert clue.color == (MOCK_COLOR_R_B, MOCK_COLOR_G, MOCK_COLOR_B, MOCK_COLOR_C)

    def test_temperature(self):
        MOCK_TEMP_A = 10
        MOCK_TEMP_B = -10
        clue._Clue__state["temperature"] = MOCK_TEMP_A
        assert MOCK_TEMP_A == clue.temperature
        clue._Clue__state["temperature"] = MOCK_TEMP_B
        assert MOCK_TEMP_B == clue.temperature
    
    def test_magnetic(self):
        MOCK_MAGNETIC_X_A = 1
        MOCK_MAGNETIC_Y = 2
        MOCK_MAGNETIC_Z = 3
        MOCK_MAGNETIC_X_B = 4

        clue._Clue__state["magnetometer"] = {"x": MOCK_MAGNETIC_X_A, "y": MOCK_MAGNETIC_Y, "z": MOCK_MAGNETIC_Z}
        assert clue.acceleration == (MOCK_MAGNETIC_X_A, MOCK_MAGNETIC_Y, MOCK_MAGNETIC_Z)
        clue._Clue__state["magnetometer"]["x"] = MOCK_MAGNETIC_X_B
        assert clue.acceleration == (MOCK_MAGNETIC_X_B, MOCK_MAGNETIC_Y, MOCK_MAGNETIC_Z)

    def test_proximity(self):
        MOCK_DISTANCE_A = 10
        MOCK_DISTANCE_B = 250
        clue._Clue__state["proximity"] = MOCK_DISTANCE_A
        assert MOCK_DISTANCE_A == clue.proximity
        clue._Clue__state["proximity"] = MOCK_DISTANCE_B
        assert MOCK_DISTANCE_B == clue.proximity

    def test_gyro(self):
        MOCK_GYRO_X_A = 1
        MOCK_GYRO_Y = 2
        MOCK_GYRO_Z = 3
        MOCK_GYRO_X_B = 4

        clue._Clue__state["gyro"] = {"x": MOCK_GYRO_X_A, "y": MOCK_GYRO_Y, "z": MOCK_GYRO_Z}
        assert clue.gyro == (MOCK_GYRO_X_A, MOCK_GYRO_Y, MOCK_GYRO_Z)
        clue._Clue__state["gyro"]["x"] = MOCK_GYRO_X_B
        assert clue.gyro == (MOCK_GYRO_X_B, MOCK_GYRO_Y, MOCK_GYRO_Z)

    def test_gesture(self):
        NONE = 0
        UP = 1
        clue._Clue__state["gesture"] = NONE
        assert NONE == clue.gesture
        clue._Clue__state["gesture"] = UP
        assert UP == clue.gesture

    def test_humidity(self):
        MOCK_HUMIDITY_A = 10
        MOCK_HUMIDITY_B = 50
        clue._Clue__state["humidity"] = MOCK_HUMIDITY_A
        assert MOCK_HUMIDITY_A == clue.humidity
        clue._Clue__state["humidity"] = MOCK_HUMIDITY_B
        assert MOCK_HUMIDITY_B == clue.humidity

    def test_pressure(self):
        MOCK_PRESSURE_A = 10
        MOCK_PRESSURE_B = 50
        clue._Clue__state["pressure"] = MOCK_PRESSURE_A
        assert MOCK_PRESSURE_A == clue.pressure
        clue._Clue__state["pressure"] = MOCK_PRESSURE_B
        assert MOCK_PRESSURE_B == clue.pressure

    def test_altitude(self):
        MOCK_PRESSURE_A = 1000
        MOCK_PRESSURE_B = 1030
        MOCK_ALTITUDE_A = 125.42
        MOCK_ALTITUDE_B = -123.93
        SEA_LEVEL_PRESSURE = 1015
        clue.sea_level_pressure = SEA_LEVEL_PRESSURE
        clue._Clue__state["pressure"] = MOCK_PRESSURE_A
        assert MOCK_ALTITUDE_A == pytest.approx(clue.altitude)
        clue._Clue__state["pressure"] = MOCK_PRESSURE_B
        assert MOCK_ALTITUDE_B == pytest.approx(clue.altitude)

    def test_sea_level_pressure(self):
        MOCK_PRESSURE = 1040
        clue.sea_level_pressure = MOCK_PRESSURE
        assert MOCK_PRESSURE == clue.sea_level_pressure

    def test_pixel(self):
        MOCK_RED = (255, 0, 0)
        MOCK_WHITE = (255, 255, 255)
        clue.pixel.fill(MOCK_RED)
        assert MOCK_RED == clue.pixel
        clue.pixel.fill(MOCK_WHITE)
        assert MOCK_WHITE == clue.pixel
    