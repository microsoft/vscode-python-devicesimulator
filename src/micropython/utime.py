import time

from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


def sleep(seconds):
    """
    Sleep for the given number of seconds. You can use a floating-point number
    to sleep for a fractional number of seconds, or use the
    :func:`utime.sleep_ms()` and :func:`utime.sleep_us()` functions.
    """
    time.sleep(seconds)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)

def sleep_ms(ms):
    """
    Delay for given number of milliseconds, should be positive or 0.
    """
    time.sleep(ms / 1000)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)

def sleep_us(us):
    """
    Delay for given number of microseconds, should be positive or 0.
    """
    time.sleep(us / 1000000)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)


def ticks_ms():
    """
    This function is not implemented in the simulator.

    Returns an increasing millisecond counter with an arbitrary reference point,
    that wraps around after some value.
    """
    utils.print_for_unimplemented_functions(ticks_ms.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)

def ticks_us():
    """
    This function is not implemented in the simulator.

    Just like :func:`utime.ticks_ms()` above, but in microseconds.
    """
    utils.print_for_unimplemented_functions(ticks_us.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)

def ticks_add(ticks, delta):
    """
    This function is not implemented in the simulator.

    Offset ticks value by a given number, which can be either positive or
    negative. Given a ticks value, this function allows to calculate ticks
    value delta ticks before or after it, following modular-arithmetic
    definition of tick values.

    Example:

    .. code-block:: python

        # Find out what ticks value there was 100ms ago
        print(ticks_add(time.ticks_ms(), -100))

        # Calculate deadline for operation and test for it
        deadline = ticks_add(time.ticks_ms(), 200)
        while ticks_diff(deadline, time.ticks_ms()) > 0:
            do_a_little_of_something()

        # Find out TICKS_MAX used by this port
        print(ticks_add(0, -1))
    """
    utils.print_for_unimplemented_functions(ticks_add.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)

def ticks_diff(ticks1, ticks2):
    """
    This function is not implemented in the simulator.

    Measure ticks difference between values returned from
    :func:`utime.ticks_ms()` or :func:`ticks_us()` functions, as a signed value
    which may wrap around.

    The argument order is the same as for subtraction operator,
    ``ticks_diff(ticks1, ticks2)`` has the same meaning as ``ticks1 - ticks2``.

    :func:`utime.ticks_diff()` is designed to accommodate various usage
    patterns, among them:

    Polling with timeout. In this case, the order of events is known, and you
    will deal only with positive results of :func:`utime.ticks_diff()`:

    .. code-block:: python

        # Wait for GPIO pin to be asserted, but at most 500us
        start = time.ticks_us()
        while pin.value() == 0:
            if time.ticks_diff(time.ticks_us(), start) > 500:
                raise TimeoutError


    Scheduling events. In this case, :func:`utime.ticks_diff()` result may be
    negative if an event is overdue:


    .. code-block:: python

        # This code snippet is not optimized
        now = time.ticks_ms()
        scheduled_time = task.scheduled_time()
        if ticks_diff(scheduled_time, now) > 0:
            print("Too early, let's nap")
            sleep_ms(ticks_diff(scheduled_time, now))
            task.run()
        elif ticks_diff(scheduled_time, now) == 0:
            print("Right at time!")
            task.run()
        elif ticks_diff(scheduled_time, now) < 0:
            print("Oops, running late, tell task to run faster!")
            task.run(run_faster=true)
    """
    utils.print_for_unimplemented_functions(ticks_diff.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_UTIME)  