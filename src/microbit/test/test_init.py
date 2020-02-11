import time

import pytest
from unittest import mock

from .. import *
from ..__model.microbit_model import MicrobitModel

# tests methods in __init__.py


class TestShim(object):
    def test_sleep(self):
        # Save pointer to function about to be mocked
        real_function = MicrobitModel.sleep

        milliseconds = 100
        MicrobitModel.sleep = mock.Mock()
        sleep(milliseconds)
        MicrobitModel.sleep.assert_called_with(milliseconds)

        # Restore original function
        MicrobitModel.sleep = real_function

    def test_running_time(self):
        # Save pointer to function about to be mocked
        real_function = MicrobitModel.running_time

        MicrobitModel.running_time = mock.Mock()
        running_time()
        MicrobitModel.running_time.assert_called_once()

        # Restore original function
        MicrobitModel.running_time = real_function

    def test_temperature(self):
        # Save pointer to function about to be mocked
        real_function = MicrobitModel.temperature

        MicrobitModel.temperature = mock.Mock()
        temperature()
        MicrobitModel.temperature.asser_called_once()

        # Restore original function
        MicrobitModel.temperature = real_function
