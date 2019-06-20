import json
import sys
import os
import simpleaudio as sa
from .pixel import Pixel
from . import utils



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
          'red_led': False
        }

        self.pixels = Pixel(self.__state)
        self.__speaker_enabled = False
        self.__abs_path_to_code_file = ''

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

    def __show(self):
        utils.show(self.__state)

    def play_file(self, file_name):
        file_name = utils.remove_leading_slashes(file_name)
        abs_path_parent_dir = os.path.abspath(os.path.join(self.__abs_path_to_code_file, os.pardir))
        abs_path_wav_file = os.path.normpath(os.path.join(abs_path_parent_dir, file_name))

        if sys.implementation.version[0] >= 3:
            wave_obj = sa.WaveObject.from_wave_file(abs_path_wav_file)
            try:
                play_obj = wave_obj.play()
            except:
                # TODO TASK: 29054 Verfication of a "valid" .wav file
                raise EnvironmentError("The Circuit Playground Express can only play .wav files.")
            play_obj.wait_done()
        else:
            raise NotImplementedError("Please use Python 3 or higher.")
    
cpx = Express()
