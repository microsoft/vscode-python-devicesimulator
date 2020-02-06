from .__model.image import Image
from .__model.microbit_model import __mb

button_a = __mb.button_a
button_b = __mb.button_b


def sleep(n):
    __mb.sleep(n)


def running_time():
    __mb.running_time()
