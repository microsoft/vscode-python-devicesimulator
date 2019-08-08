import threading
from pysine import sine
import numpy as np
import struct
import sys
import os
import simpleaudio as sa
import sounddevice as sd

BIT_RATE = 44100


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
        self._play_tone_event.set()

    def run(self):
        while True:
            if self._start_event.is_set() and not self._stop_event.is_set():
                self.createTone(self.frequency, 0.5)
            elif self._play_tone_event.is_set():
                self.createTone(self.frequency, self.duration)
                self._play_tone_event.clear()

    def _get_filename_absolute_path(self, file_name):
        abs_path_to_code_file = ''
        abs_path_parent_dir = os.path.abspath(
            os.path.join(abs_path_to_code_file, os.curdir))
        abs_path_wav_file = os.path.normpath(
            os.path.join(abs_path_parent_dir, file_name))

    def set_frequency(self, frequency):
        self.frequency = frequency

    def set_duration(self, duration):
        self.duration = duration

    def createTone(self, frequency, duration):
        each_sample_number = np.arange(duration * BIT_RATE)
        waveform = np.sin(2 * np.pi * each_sample_number *
                          frequency / BIT_RATE)
        waveform_attenuated = waveform * 0.5
        waveform_integers = np.int16(waveform_attenuated * 32767)
        # play_obj = sa.play_buffer(waveform_integers, 1, 2, BIT_RATE)
        print("calling play", flush=True)
        sd.play(waveform_integers, BIT_RATE)
