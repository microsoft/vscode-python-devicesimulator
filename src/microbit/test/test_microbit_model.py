import time

import pytest
from unittest import mock
from ..__model import constants as CONSTANTS
from ..__model.microbit_model import MicrobitModel


class TestMicrobitModel(object):
    def setup_method(self):
        self.__mb = MicrobitModel()

    @pytest.mark.parametrize("value", [9, 30, 1999])
    def test_sleep(self, value):
        time.sleep = mock.Mock()
        self.__mb.sleep(value)
        time.sleep.assert_called_with(value / 1000)

    def test_running_time(self):
        mock_start_time = 10
        mock_end_time = 300
        self.__mb._MicrobitModel__start_time = mock_start_time
        time.time = mock.MagicMock(return_value=mock_end_time)
        assert mock_end_time - mock_start_time == pytest.approx(
            self.__mb.running_time()
        )

    @pytest.mark.parametrize(
        "temperature",
        [
            CONSTANTS.MIN_TEMPERATURE,
            CONSTANTS.MIN_TEMPERATURE + 1,
            0,
            CONSTANTS.MAX_TEMPERATURE - 1,
            CONSTANTS.MAX_TEMPERATURE,
        ],
    )
    def test_temperature(self, temperature):
        self.__mb._MicrobitModel__set_temperature(temperature)
        assert temperature == self.__mb.temperature()

    @pytest.mark.parametrize(
        "invalid_temperature",
        [CONSTANTS.MIN_TEMPERATURE - 1, CONSTANTS.MAX_TEMPERATURE + 1],
    )
    def test_invalid_temperature(self, invalid_temperature):
        with pytest.raises(ValueError):
            self.__mb._MicrobitModel__set_temperature(invalid_temperature)
