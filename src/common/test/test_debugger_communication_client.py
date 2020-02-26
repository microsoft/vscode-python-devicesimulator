import pytest
import json  # Remove
from unittest import mock
import socketio
import threading

from adafruit_circuitplayground import express
from common import debugger_communication_client
from common import constants as CONSTANTS
from adafruit_circuitplayground.constants import CPX


class TestDebuggerCommunicationClient(object):
    @mock.patch("socketio.Client.connect")
    def test_init_connection(self, mock_connect):
        mock_connect.return_value = None
        debugger_communication_client.init_connection()
        mock_connect.assert_called_once()

    def test_init_connection1(self):
        socketio.Client.connect = mock.Mock()
        socketio.Client.connect.return_value = None
        debugger_communication_client.init_connection()
        socketio.Client.connect.assert_called_once()

    def test_update_state(self):
        threading.Event.clear = mock.Mock()
        threading.Event.wait = mock.Mock()
        socketio.Client.emit = mock.Mock()
        socketio.Client.emit.return_value = None
        debugger_communication_client.update_state(
            {CONSTANTS.ACTIVE_DEVICE_FIELD: CPX, CONSTANTS.STATE_FIELD: {}}
        )
        socketio.Client.emit.assert_called_once()

    @mock.patch.dict(
        express.cpx._Express__state,
        {
            "brightness": 1.0,
            "button_a": False,
            "button_b": False,
            "pixels": [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
            ],
            "red_led": False,
            "switch": False,
            "temperature": 0,
            "light": 0,
            "motion_x": 0,
            "motion_y": 0,
            "motion_z": 0,
            "touch": [False] * 7,
            "shake": False,
        },
        clear=True,
    )
    def test_button_press(self):
        data = {
            CONSTANTS.ACTIVE_DEVICE_FIELD: CPX,
            CONSTANTS.STATE_FIELD: {"button_a": True, "button_b": True, "switch": True},
        }
        expected_data = {
            "brightness": 1.0,
            "button_a": True,
            "button_b": True,
            "pixels": [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
            ],
            "red_led": False,
            "switch": True,
            "temperature": 0,
            "light": 0,
            "motion_x": 0,
            "motion_y": 0,
            "motion_z": 0,
            "touch": [False] * 7,
            "shake": False,
        }
        serialized_data = json.dumps(data)
        debugger_communication_client.input_changed(serialized_data)
        assert expected_data == express.cpx._Express__state

    @mock.patch.dict(
        express.cpx._Express__state,
        {
            "brightness": 1.0,
            "button_a": False,
            "button_b": False,
            "pixels": [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
            ],
            "red_led": False,
            "switch": False,
            "temperature": 0,
            "light": 0,
            "motion_x": 0,
            "motion_y": 0,
            "motion_z": 0,
            "touch": [False] * 7,
            "shake": False,
        },
        clear=True,
    )
    def test_input_changed(self):
        data = {
            CONSTANTS.ACTIVE_DEVICE_FIELD: CPX,
            CONSTANTS.STATE_FIELD: {
                "temperature": 1,
                "light": 2,
                "motion_x": 3,
                "motion_y": 4,
                "motion_z": 5,
            },
        }
        expected_data = {
            "brightness": 1.0,
            "button_a": False,
            "button_b": False,
            "pixels": [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
            ],
            "red_led": False,
            "switch": False,
            "temperature": 1,
            "light": 2,
            "motion_x": 3,
            "motion_y": 4,
            "motion_z": 5,
            "touch": [False] * 7,
            "shake": False,
        }
        serialized_data = json.dumps(data)
        debugger_communication_client.input_changed(serialized_data)
        assert expected_data == express.cpx._Express__state

    @mock.patch("builtins.print")
    @mock.patch.dict(express.cpx._Express__state, {}, clear=True)
    def test_update_api_state_fail(self, mocked_print):
        data = []
        debugger_communication_client.input_changed(data)
        # Exception is caught and a print is stated to stderr
        mocked_print.assert_called_once()
