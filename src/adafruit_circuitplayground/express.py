# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import json
import sys
import os
import playsound

from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent
from .pixel import Pixel
from . import constants as CONSTANTS
from collections import namedtuple
from applicationinsights import TelemetryClient
import common

Acceleration = namedtuple("acceleration", ["x", "y", "z"])


class Express:
    def __init__(self):
        # State in the Python process
        self.__state = {
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
        }
        self.__debug_mode = False
        self.__abs_path_to_code_file = ""
        self.pixels = Pixel(self.__state, self.__debug_mode)

    @property
    def acceleration(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_ACCELERATION)
        return Acceleration(
            self.__state["motion_x"], self.__state["motion_y"], self.__state["motion_z"]
        )

    @property
    def button_a(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_BUTTON_A)
        return self.__state["button_a"]

    @property
    def button_b(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_BUTTON_B)
        return self.__state["button_b"]

    @property
    def detect_taps(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_DETECT_TAPS)
        return self.__state["detect_taps"]

    @detect_taps.setter
    def detect_taps(self, value):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_DETECT_TAPS)
        value_int = int(value)
        self.__state["detect_taps"] = (
            value_int if (value_int == 1 or value_int == 2) else 1
        )

    @property
    def tapped(self):
        """  Not Implemented!
        """
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_TAPPED)
        utils.print_for_unimplemented_functions("tapped")

    @property
    def red_led(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_RED_LED)
        return self.__state["red_led"]

    @red_led.setter
    def red_led(self, value):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_RED_LED)
        self.__state["red_led"] = bool(value)
        self.__show()

    @property
    def switch(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_SWITCH)
        return self.__state["switch"]

    @property
    def temperature(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_TEMPERATURE)
        return self.__state["temperature"]

    @property
    def light(self):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_LIGHT)
        return self.__state["light"]

    def __show(self):
        if self.__debug_mode:
            common.debugger_communication_client.debug_send_to_simulator(
                self.__state, CONSTANTS.CPX
            )
        else:
            utils.send_to_simulator(self.__state, CONSTANTS.CPX)

    def __touch(self, i):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_TOUCH)
        return self.__state["touch"][i - 1]

    @property
    def touch_A1(self):
        return self.__touch(1)

    @property
    def touch_A2(self):
        return self.__touch(2)

    @property
    def touch_A3(self):
        return self.__touch(3)

    @property
    def touch_A4(self):
        return self.__touch(4)

    @property
    def touch_A5(self):
        return self.__touch(5)

    @property
    def touch_A6(self):
        return self.__touch(6)

    @property
    def touch_A7(self):
        return self.__touch(7)

    def adjust_touch_threshold(self, adjustment):
        """Not implemented!
        The CPX Simulator doesn't use capacitive touch threshold.
        """
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_ADJUST_THRESHOLD)
        utils.print_for_unimplemented_functions(
            Express.adjust_touch_threshold.__name__
        )

    def shake(self, shake_threshold=30):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_SHAKE)
        return self.__state["shake"]

    def play_file(self, file_name):
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_PLAY_FILE)
        file_name = utils.remove_leading_slashes(file_name)
        abs_path_parent_dir = os.path.abspath(
            os.path.join(self.__abs_path_to_code_file, os.pardir)
        )
        abs_path_wav_file = os.path.normpath(
            os.path.join(abs_path_parent_dir, file_name)
        )
        abs_path_wav_file = utils.escape_if_OSX(abs_path_wav_file)

        if sys.implementation.version[0] >= 3:
            if file_name.endswith(".wav"):
                try:
                    playsound.playsound(abs_path_wav_file)
                except:
                    # TODO TASK: 29054 Verfication of a "valid" .wav file
                    raise EnvironmentError(CONSTANTS.NOT_SUITABLE_FILE_ERROR)
            else:
                raise TypeError(file_name + " is not a path to a .wav file.")
        else:
            raise NotImplementedError("Please use Python 3 or higher.")

    def play_tone(self, frequency, duration):
        """ Not Implemented!
        """
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_PLAY_TONE)
        utils.print_for_unimplemented_functions(Express.play_tone.__name__)

    def start_tone(self, frequency):
        """ Not Implemented!
        """
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_START_TONE)
        utils.print_for_unimplemented_functions(Express.start_tone.__name__)

    def stop_tone(self):
        """ Not Implemented!
        """
        telemetry_py.send_telemetry(TelemetryEvent.CPX_API_STOP_TONE)
        utils.print_for_unimplemented_functions(Express.stop_tone.__name__)

    def update_state(self, new_state):
        for event in CONSTANTS.ALL_EXPECTED_INPUT_EVENTS:
            self._Express__state[event] = new_state.get(
                event, self._Express__state[event]
            )


cpx = Express()
