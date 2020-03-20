# overriden neopixel_write library to write to frontend

# original implementation docs for neopixel_write:
# https://circuitpython.readthedocs.io/en/5.0.x/shared-bindings/neopixel_write/__init__.html

import constants as CONSTANTS

import pathlib
import sys
import os

from common import utils
from adafruit_circuitplayground import cp


def neopixel_write(gpio, buf):
    """Write buf out on the given DigitalInOut."""

    if len(tuple(buf)) > 0:
        # if we are explicitly given
        # the clue pin, that means that
        # the clue is definitely the active device
        # because the constructor for the
        # clue is what calls neopixel
        # with the clue pin argument
        if gpio.pin != CONSTANTS.CLUE_PIN:
            send_cpx(buf)
        send_clue(buf)


def send_clue(buf):
    sendable_json = {CONSTANTS.PIXELS: [tuple(buf)]}
    utils.send_to_simulator(sendable_json, CONSTANTS.CLUE)


def send_cpx(buf):
    buf_list = list(buf)
    ret_list = []
    temp_list = []
    for idx, elem in enumerate(buf_list):
        if idx % 3 == 0 and idx != 0:
            ret_list.append(tuple(temp_list))
            temp_list = []
        temp_list.append(elem)

    if len(temp_list) == 3:
        ret_list.append(tuple(temp_list))

    max_index = min(len(ret_list), 10)
    cp.pixels[0:max_index] = ret_list[0:max_index]
