# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from . import constants as CONSTANTS
import json
import copy
import time
import sys

previous_state = {}


def update_state_with_device_name(state, device_name):
    state_ext = {
        "device_name": device_name,
    }
    state.update(state_ext)


def create_message(state_copy):
    message = {"type": "state", "data": json.dumps(state_copy)}
    return message


def send_to_simulator(state, device_name):
    global previous_state

    update_state_with_device_name(state, device_name)
    message = create_message(state)

    if state != previous_state:
        previous_state = copy.deepcopy(state)
        print(json.dumps(message) + "\0", end="", file=sys.__stdout__, flush=True)
        time.sleep(CONSTANTS.TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip("\\/")
    return string


def escape_if_OSX(file_name):
    if sys.platform.startswith(CONSTANTS.MAC_OS):
        file_name = file_name.replace(" ", "%20")
    return file_name
