# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from . import constants as CONSTANTS
import json
import copy
import time
import sys

previous_state = {}


def show(state, device_name, debug_mode=False):
    global previous_state

    if not device_name in previous_state or state != previous_state[device_name]:

        previous_state[device_name] = copy.deepcopy(state)
        state_ext = {
            "device_name": device_name,
        }
        state.update(state_ext)
        message = {"type": "state", "data": json.dumps(state)}
        print(json.dumps(message) + "\0", end="", file=sys.__stdout__, flush=True)
        time.sleep(CONSTANTS.TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip("\\/")
    return string


def escape_if_OSX(file_name):
    if sys.platform.startswith(CONSTANTS.MAC_OS):
        file_name = file_name.replace(" ", "%20")
    return file_name

