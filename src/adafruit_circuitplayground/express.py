# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import json
import sys
import os
from playsound import playsound
from .pixel import Pixel
from . import utils
from collections import namedtuple


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
            'detect_taps': 1,
            'tapped': False,

        }

        self.pixels = Pixel(self.__state)
        self.__abs_path_to_code_file = ''

    @property
    def acceleration(self):
        Acceleration = namedtuple('acceleration', ['x', 'y', 'z'])

        return Acceleration(self.__state['motion_x'], self.__state['motion_y'], self.__state['motion_z'])

    @property
    def button_a(self):
        return self.__state['button_a']

    @property
    def button_b(self):
        return self.__state['button_b']

    @property
    def detect_taps(self):
        return self.__state['detect_taps']

    @detect_taps.setter
    def detect_taps(self, value):
        value_int = int(value)
        self.__state['detect_taps'] = value_int if (
            value_int == 1 or value_int == 2) else 1

    @property
    def red_led(self):
        return self.__state['red_led']

    @red_led.setter
    def red_led(self, value):
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
        utils.show(self.__state)

    def play_file(self, file_name):
        file_name = utils.remove_leading_slashes(file_name)
        abs_path_parent_dir = os.path.abspath(
            os.path.join(self.__abs_path_to_code_file, os.pardir))
        abs_path_wav_file = os.path.normpath(
            os.path.join(abs_path_parent_dir, file_name))

        if sys.implementation.version[0] >= 3:
            if file_name.endswith(".wav"):
                try:
                    playsound(abs_path_wav_file)
                except:
                    # TODO TASK: 29054 Verfication of a "valid" .wav file
                    raise EnvironmentError(
                        "Your .wav file is not suitable for the Circuit Playground Express.")
            else:
                raise TypeError(file_name + " is not a path to a .wav file.")
        else:
            raise NotImplementedError("Please use Python 3 or higher.")

    def play_tone(self, frequency, duration):
        pass

    def start_tone(self, frequency):
        pass

    def stop_stone(self, frequency):
        pass


cpx = Express()
