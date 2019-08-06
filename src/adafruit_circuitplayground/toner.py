import threading
from pysine import sine


class TonerThread(threading.Thread):
    """Thread class with a stop() method. The thread itself has to check
    regularly for the stopped() condition."""

    def __init__(self, frequency):
        super(TonerThread, self).__init__()
        self._stop_event = threading.Event()
        self.frequency = frequency

    def stop(self):
        self._stop_event.set()

    def stopped(self):
        return self._stop_event.is_set()

    def run(self):
        sine(frequency=self.frequency, duration=0.1)
