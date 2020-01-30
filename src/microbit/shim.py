from .model import microbit_model


def sleep(n):
    microbit_model.mb.sleep(n)


def running_time(n):
    microbit_model.mb.running_time(n)
