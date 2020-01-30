from .model import microbit

def show_message(message):
    microbit.mb.show_message(message)