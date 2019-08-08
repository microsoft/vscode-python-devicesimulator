# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import json
import sys
import os
import time
from .toner import TonerThread
from playsound import playsound
from .pixel import Pixel
from . import utils
from collections import namedtuple
from pyaudio import PyAudio
import numpy as np
import threading


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
            'play_tone': True
        }

        self.pixels = Pixel(self.__state)
        self.__abs_path_to_code_file = ''
        self.stop = False
        self.toner = TonerThread()
        self.toner.start()

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

        utils.play_wave_file(abs_path_wav_file)

    def play_tone(self, frequency, duration):
        self.toner.set_frequency(frequency)
        self.toner.set_duration(duration)
        self.toner.play_tone()

    def start_tone(self, frequency):
        self.toner.set_frequency(frequency)
        self.toner.start_tone()

    def stop_tone(self):
        self.toner.stop_tone()

    def __del__(self):
        self.toner.join


cpx = Express()