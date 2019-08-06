import threading
from pysine import sine


class TonerThread(threading.Thread):
    """Thread class with a stop() method. The thread itself has to check
    regularly for the stopped() condition."""

    def __init__(self):
        super(TonerThread, self).__init__()
        self._stop_event = threading.Event()
        self._start_event = threading.Event()
        self.frequency = 440

    def stop_tone(self):
        if self._start_event.is_set():
            self._start_event.clear()
        self._stop_event.set()

    def start_tone(self):
        if self._stop_event.is_set():
            self._stop_event.clear()
        self._start_event.set()

    def stopped(self):
        return self._stop_event.is_set()

    def run(self):
        while True:
            if self._start_event.is_set() and not self.stopped():
                sine(frequency=self.frequency, duration=0.2)

    def set_frequency(self, frequency):
        self.frequency = frequency
