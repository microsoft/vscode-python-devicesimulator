from .__model.image import Image
from .__model.microbit_model import __mb
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent

accelerometer = __mb.accelerometer
button_a = __mb.button_a
button_b = __mb.button_b
display = __mb.display


def sleep(n):
    """
    Wait for ``n`` milliseconds. One second is 1000 milliseconds, so::
    microbit.sleep(1000)
    will pause the execution for one second.  ``n`` can be an integer or
    a floating point number.
    """
    __mb.sleep(n)


def running_time():
    """
    Return the number of milliseconds since the board was switched on or
    restarted.
    """
    return __mb.running_time()


def temperature():
    """
    Return the temperature of the micro:bit in degrees Celcius.
    """
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_TEMPERATURE)
    return __mb.temperature()
