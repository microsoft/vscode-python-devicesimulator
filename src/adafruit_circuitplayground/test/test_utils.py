import sys

from unittest import mock

from .. import constants as CONSTANTS
from .. import utils


class TestUtils(object):
    def test_remove_leading_slashes(self):
        original = "///a//b/"
        expected = "a//b/"
        assert expected == utils.remove_leading_slashes(original)

    def test_escape_notOSX(self):
        if sys.platform.startswith(CONSTANTS.MAC_OS):
            utils.sys = mock.MagicMock()
            utils.sys.configure_mock(platform="win32")
        original = "a b"
        assert original == utils.escape_if_OSX(original)

    def test_escape_isOSX(self):
        if not sys.platform.startswith(CONSTANTS.MAC_OS):
            utils.sys = mock.MagicMock()
            utils.sys.configure_mock(platform="darwin")
        original = "a b"
        expected = "a%20b"
        assert expected == utils.escape_if_OSX(original)
