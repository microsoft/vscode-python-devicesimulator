import sys

import pytest
from unittest import mock

import ..utils


class TestUtils(object):

    def test_remove_leading_slashes(self):
        original = "///a//b/"
        expected = "a//b/"
        assert expected == utils.remove_leading_slashes(original)
    
    def test_escape_if_OSX_notOSX(self):
        original = "a b"
        assert original == utils.escape_if_OSX(original)

    def test_escape_if_OSX_isOSX(self):
        utils.sys = mock.MagicMock()
        utils.sys.configure_mock(platform='darwin')
        original = "a b"
        expected = "a%20b"
        assert expected == utils.escape_if_OSX(original)