from .model import microbit_model
<<<<<<< HEAD
from .model import image

microbit = microbit_model.mb
Image = image.Image
display = microbit.display
=======
>>>>>>> users/t-xunguy/leds


def sleep(n):
    microbit_model.mb.sleep(n)


def running_time():
    microbit_model.mb.running_time()
