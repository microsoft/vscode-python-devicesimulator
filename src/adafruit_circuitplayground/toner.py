import threading
from pysine import sine
from scipy.io.wavfile import write
import numpy as np
import struct
from . import utils
import sys
import os
import simpleaudio as sa
import tempfile

BIT_RATE = 44100
FILENAME = "tone.wav"
LOOP_TONE_DURATION = 0.3


def _get_filename_absolute_path(file_name):

    tone_dir = tempfile.mkdtemp()
    abs_path_wav_file = os.path.join(tone_dir, file_name)
    return abs_path_wav_file


class TonerThread(threading.Thread):

    def __init__(self):
        super(TonerThread, self).__init__()
        self._stop_event = threading.Event()
        self._start_event = threading.Event()
        self._play_tone_event = threading.Event()
        self.filepath = _get_filename_absolute_path(FILENAME)

    def stop_tone(self):
        if self._start_event.is_set():
            self._start_event.clear()
        self._stop_event.set()
        self.clean_dir()

    def start_tone(self, frequency):
        self.write_wave_file(frequency, LOOP_TONE_DURATION)
        if self._stop_event.is_set():
            self._stop_event.clear()
        self._start_event.set()

    def play_tone(self, frequency, duration):
        if(self._stop_event.is_set()):
            self._stop_event.clear()
        self.write_wave_file(frequency, duration)
        self._play_tone_event.set()

    def run(self):
        while True:
            if self._start_event.is_set() and not self._stop_event.is_set():
                utils.play_wave_file(self.filepath)
            elif self._play_tone_event.is_set():
                print(self.filepath)
                utils.play_wave_file(self.filepath)
                self._play_tone_event.clear()

    def write_wave_file(self, frequency, duration):
        each_sample_number = np.arange(duration * BIT_RATE)
        waveform = np.sin(2 * np.pi * each_sample_number *
                          frequency / BIT_RATE)
        waveform_attenuated = waveform * 0.5
        waveform_integers = np.int16(waveform_attenuated * 32767)
        write(self.filepath, BIT_RATE, waveform_integers)

    def clean_dir(self):
        os.remove(self.filepath)
