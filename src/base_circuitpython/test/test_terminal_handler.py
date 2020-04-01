import pytest

import base_circuitpython.terminal_handler
from common import utils
from unittest import mock


class TestTerminal(object):
    def setup_method(self):

        utils.send_to_simulator = mock.Mock()

    @pytest.mark.parametrize(
        "str_vals",
        [
            (["potato", "Lorem ipsum"]),
            ([""]),
            ([".......", "123456", "", "test"]),
            (["123456789 123456789 123456789 1234567"]),
        ],
    )
    def test_single_line(self, str_vals):
        self.terminal = base_circuitpython.terminal_handler.Terminal()
        for s in str_vals:
            self.terminal.add_str_to_terminal(s)

        result = list(self.terminal._Terminal__output_values)
        result.reverse()

        # output should just be the reversed version since all lines
        # don't have newline or exceed 37 characters
        assert str_vals == result

    @pytest.mark.parametrize(
        "str_vals, expected",
        [
            (
                ["\nCode done running. Waiting for reload."],
                [".", "Code done running. Waiting for reload", ""],
            ),
            (
                ["TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST"],
                ["ESTTESTTEST", "TESTTESTTESTTESTTESTTESTTESTTESTTESTT"],
            ),
            (
                ["\nCode done running. Waiting for reload.", "........."],
                [".........", ".", "Code done running. Waiting for reload", ""],
            ),
            (
                ["TEST TEST TEST TEST TEST              ", "..."],
                ["...", " ", "TEST TEST TEST TEST TEST             "],
            ),
        ],
    )
    def test_multiline(self, str_vals, expected):
        self.terminal = base_circuitpython.terminal_handler.Terminal()
        for s in str_vals:
            self.terminal.add_str_to_terminal(s)

        result = list(self.terminal._Terminal__output_values)
        assert result == expected
