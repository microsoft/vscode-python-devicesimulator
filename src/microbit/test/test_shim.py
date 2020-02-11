import time

import pytest
from unittest import mock

from .. import *
from ..__model.microbit_model import MicrobitModel

# tests methods in __init__.py


class TestShim(object):
    def test_sleep(self):
        milliseconds = 100
        MicrobitModel.sleep = mock.Mock()
        sleep(milliseconds)
        MicrobitModel.sleep.assert_called_with(milliseconds)

    def test_running_time(self):
        MicrobitModel.running_time = mock.Mock()
        running_time()
        MicrobitModel.running_time.assert_called_once()
