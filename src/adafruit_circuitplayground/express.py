# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import json
import sys
import os
from playsound import playsound
from .pixel import Pixel
from . import utils
from . import constants as CONSTANTS
from collections import namedtuple
from applicationinsights import TelemetryClient

Acceleration = namedtuple('acceleration', ['x', 'y', 'z'])


class Express:
    def __init__(self):
        # State in the Python process
        self.__state = {
            'brightness': 1.0,
            'button_a': False,
            'button_b': False,
            'pixels': [
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0),
                (0, 0, 0)
            ],
            'red_led': False,
            'switch': False,
            'temperature': 0,
            'light': 0,
            'motion_x': 0,
            'motion_y': 0,
            'motion_z': 0,
            'touch': [False]*7,
            'shake': False,
        }
        self.telemetry_state = {
            "DETECT_TAPS": False,
            "TAPPED": False,
            "RED_LED": False,
            "ADJUST_THRESHOLD": False,
            "PLAY_FILE": False,
            "PLAY_TONE": False,
            "START_TONE": False,
            "STOP_TONE": False,
        }
        self.__debug_mode = False
        self.__abs_path_to_code_file = ''
        self.pixels = Pixel(self.__state, self.__debug_mode)

    @property
    def acceleration(self):
        return Acceleration(self.__state['motion_x'], self.__state['motion_y'], self.__state['motion_z'])

    @property
    def button_a(self):
        return self.__state['button_a']

    @property
    def button_b(self):
        return self.__state['button_b']

    @property
    def detect_taps(self):
        if(not self.telemetry_state["DETECT_TAPS"]):
            utils.send_telemetry("DETECT_TAPS")
            self.telemetry_state["DETECT_TAPS"] = True
        return self.__state['detect_taps']

    @detect_taps.setter
    def detect_taps(self, value):
        value_int = int(value)
        self.__state['detect_taps'] = value_int if (
            value_int == 1 or value_int == 2) else 1

    @property
    def tapped(self):
        """  Not Implemented!
        """
        if(not self.telemetry_state["TAPPED"]):
            utils.send_telemetry("TAPPED")
            self.telemetry_state["TAPPED"] = True
        raise NotImplementedError(CONSTANTS.NOT_IMPLEMENTED_ERROR)

    @property
    def red_led(self):
        if(not self.telemetry_state["RED_LED"]):
            utils.send_telemetry("RED_LED")
            self.telemetry_state["RED_LED"] = True
        return self.__state['red_led']

    @red_led.setter
    def red_led(self, value):
        if(not self.telemetry_state["RED_LED"]):
            utils.send_telemetry("RED_LED")
            self.telemetry_state["RED_LED"] = True
        self.__state['red_led'] = bool(value)
        self.__show()

    @property
    def switch(self):
        return self.__state['switch']

    @property
    def temperature(self):
        return self.__state['temperature']

    @property
    def light(self):
        return self.__state['light']

    def __show(self):
        utils.show(self.__state, self.__debug_mode)

    def __touch(self, i):
        return self.__state['touch'][i-1]

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

    def adjust_touch_threshold(self, adjustement):
        """Not implemented!
        The CPX Simulator doesn't use capacitive touch threshold.
        """
        if(not self.telemetry_state["ADJUST_THRESHOLD"]):
            utils.send_telemetry("ADJUST_THRESHOLD")
            self.telemetry_state["ADJUST_THRESHOLD"] = True

        raise NotImplementedError(
            CONSTANTS.NOT_IMPLEMENTED_ERROR)

    def shake(self, shake_threshold=30):
        return self.__state['shake']

    def play_file(self, file_name):
        if(not self.telemetry_state["PLAY_FILE"]):
            utils.send_telemetry("PLAY_FILE")
            self.telemetry_state["PLAY_FILE"] = True
        file_name = utils.remove_leading_slashes(file_name)
        abs_path_parent_dir = os.path.abspath(
            os.path.join(self.__abs_path_to_code_file, os.pardir))
        abs_path_wav_file = os.path.normpath(
            os.path.join(abs_path_parent_dir, file_name))
        abs_path_wav_file = utils.escape_if_OSX(abs_path_wav_file)

        if sys.implementation.version[0] >= 3:
            if file_name.endswith(".wav"):
                try:
                    playsound(abs_path_wav_file)
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
        if(not self.telemetry_state["PLAY_TONE"]):
            utils.send_telemetry("PLAY_TONE")
            self.telemetry_state["PLAY_TONE"] = True
        raise NotImplementedError(
            CONSTANTS.NOT_IMPLEMENTED_ERROR)

    def start_tone(self, frequency):
        """ Not Implemented!
        """
        if(not self.telemetry_state["START_TONE"]):
            utils.send_telemetry("START_TONE")
            self.telemetry_state["START_TONE"] = True
        raise NotImplementedError(
            CONSTANTS.NOT_IMPLEMENTED_ERROR)

    def stop_tone(self):
        """ Not Implemented!
        """
        if(not self.telemetry_state["STOP_TONE"]):
            utils.send_telemetry("STOP_TONE")
            self.telemetry_state["STOP_TONE"] = True
        raise NotImplementedError(
            CONSTANTS.NOT_IMPLEMENTED_ERROR)


cpx = Express()
