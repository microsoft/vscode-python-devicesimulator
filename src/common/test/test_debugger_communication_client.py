import pytest
import json  # Remove
from unittest import mock
import socketio

from adafruit_circuitplayground import express
from .. import debugger_communication_client


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
        socketio.Client.emit = mock.Mock()
        socketio.Client.emit.return_value = None
        debugger_communication_client.update_state({})
        socketio.Client.emit.assert_called_once()

    @mock.patch.dict(
        express.cpx._Express__state,
        {"button_a": False, "button_b": False, "switch": True},
        clear=True,
    )
    def test_button_press(self):
        data = {"button_a": True, "button_b": True, "switch": True}
        serialized_data = json.dumps(data)
        debugger_communication_client.input_changed(serialized_data)
        assert data == express.cpx._Express__state

    @mock.patch.dict(
        express.cpx._Express__state,
        {"temperature": 0, "light": 0, "motion_x": 0, "motion_y": 0, "motion_z": 0},
        clear=True,
    )
    def test_sensor_changed(self):
        data = {
            "temperature": 1,
            "light": 2,
            "motion_x": 3,
            "motion_y": 4,
            "motion_z": 5,
        }
        serialized_data = json.dumps(data)
        debugger_communication_client.input_changed(serialized_data)
        assert data == express.cpx._Express__state

    @mock.patch("builtins.print")
    @mock.patch.dict(express.cpx._Express__state, {}, clear=True)
    def test_update_api_state_fail(self, mocked_print):
        data = []
        debugger_communication_client.sensor_changed(data)
        # Exception is caught and a print is stated to stderr
        mocked_print.assert_called_once()
