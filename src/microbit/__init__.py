from .__model.image import Image
from .__model.microbit_model import __mb

button_a = __mb.button_a
button_b = __mb.button_b
display = __mb.display


def sleep(n):
    """
    Wait for ``n`` milliseconds. One second is 1000 milliseconds, so::
    microbit.sleep(1000)
    will pause the execution for one second.  ``n`` can be an integer or
    a floating point number.
    :param n: amount of milliseconds
    """
    __mb.sleep(n)


def running_time():
    """
    Return the number of milliseconds since the board was switched on or
    restarted.
    """
    __mb.running_time()
