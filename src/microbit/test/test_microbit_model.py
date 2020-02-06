import time

import pytest
from unittest import mock
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
        print(time.time())
        assert mock_end_time - mock_start_time == pytest.approx(self.__mb.running_time())
