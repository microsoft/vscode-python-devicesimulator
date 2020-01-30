import time

import pytest
from unittest import mock
from .. import shim
from ..model import microbit_model


class TestShim(object):
    def test_sleep(self):
        n = 100
        microbit_model.mb.sleep = mock.Mock()
        shim.sleep(n)
        microbit_model.mb.sleep.assert_called_with(n)

    def test_running_time(self):
        microbit_model.mb.running_time = mock.Mock()
        shim.running_time()
        microbit_model.mb.running_time.assert_called_once()
