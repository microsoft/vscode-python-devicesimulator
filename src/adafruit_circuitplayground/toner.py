import threading
from pysine import sine
from scipy.io.wavfile import write
import numpy as np
import struct
from . import utils
import sys
import os
import simpleaudio as sa
import re 
BIT_RATE = 44100

FILENAME = "tone.wav"


def _get_filename_absolute_path( file_name):
        abs_path_to_code_file = ''
        abs_path_parent_dir = os.path.abspath(
            os.path.join(abs_path_to_code_file, os.curdir))
        abs_path_wav_file = os.path.normpath(
            os.path.join(abs_path_parent_dir, file_name))
        parts = abs_path_wav_file.split('\\')
        for element in parts:
            if re.search(r'[\s]', element):
                abs_path_wav_file.replace(element,'hi')
                print('path is now')
                print(abs_path_wav_file,flush=True)
        print("path is",flush=True)
        print(abs_path_wav_file,flush =True)
        return abs_path_wav_file

class TonerThread(threading.Thread):
    """Thread class with a stop() method. The thread itself has to check
    regularly for the stopped() condition."""

    def __init__(self):
        super(TonerThread, self).__init__()
        self._stop_event = threading.Event()
        self._start_event = threading.Event()
        self._play_tone_event = threading.Event()
        self.frequency = 440
        self.duration = 0.2
        self.filepath = _get_filename_absolute_path(FILENAME)

    def stop_tone(self):
        if self._start_event.is_set():
            self._start_event.clear()
        self._stop_event.set()

    def start_tone(self):
        self.write_wave_file(self.frequency, 0.2)
        if self._stop_event.is_set():
            self._stop_event.clear()
        self._start_event.set()

    def play_tone(self):
        # print('attempt at writing', flush=True)
        # # self.write_wave_file(self.frequency, self.duration)
        # print('finished writing', flush=True)
        self._play_tone_event.set()

    def stopped(self):
        return self._stop_event.is_set()

    def run(self):
        while True:
            if self._start_event.is_set() and not self.stopped():
                print('should start', flush=True)
                # utils.play_wave_file(
                #     self.filepath)
            elif self._play_tone_event.is_set():
                print('should play', flush=True)
                print(self.filepath)
                utils.play_wave_file(self.filepath)
                self.createTone(self.frequency, self.duration)
                self._play_tone_event.clear()



    def set_frequency(self, frequency):
        self.frequency = frequency

    def set_duration(self, duration):
        self.duration = duration

    def write_wave_file(self, frequency, duration):
        each_sample_number = np.arange(duration * BIT_RATE)
        waveform = np.sin(2 * np.pi * each_sample_number *
                          frequency / BIT_RATE)
        waveform_attenuated = waveform * 0.5
        waveform_integers = np.int16(waveform_attenuated * 32767)
        print("writing")
        print(self.filepath)
        write(self.filepath, BIT_RATE, waveform_integers)

    def createTone(self, frequency, duration):
        each_sample_number = np.arange(duration * BIT_RATE)
        waveform = np.sin(2 * np.pi * each_sample_number *
                          frequency / BIT_RATE)
        waveform_attenuated = waveform * 0.5
        waveform_integers = np.int16(waveform_attenuated * 32767)
        play_obj = sa.play_buffer(waveform_integers, 1, 2, BIT_RATE)
