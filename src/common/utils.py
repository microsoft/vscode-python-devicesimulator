# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from . import constants as CONSTANTS
import json
import copy
import time
import sys

previous_state = {}

abs_path_to_user_file = ""
debug_mode = False


def update_state_with_device_name(state, device_name):
    updated_state = dict(state)

    state_ext = {
        "device_name": device_name,
    }
    updated_state.update(state_ext)

    return updated_state


def create_message(msg,send_type="state"):
    if isinstance(msg,dict):
        msg = json.dumps(msg)

    message = {"type": send_type, "data": msg}
    return message


def send_to_simulator(state, device_name):
    global previous_state

    updated_state = update_state_with_device_name(state, device_name)
    message = create_message(updated_state)

    if updated_state != previous_state:
        previous_state = copy.deepcopy(updated_state)
        print(json.dumps(message) + "\0", end="", file=sys.__stdout__, flush=True)
        time.sleep(CONSTANTS.TIME_DELAY)


def send_print_to_simulator(raw_msg):
    data_str = str(raw_msg)
    message = create_message(data_str,"print")
    print(json.dumps(message) + "\0", file=sys.__stdout__, flush=True)
    time.sleep(CONSTANTS.TIME_DELAY)

def remove_leading_slashes(string):
    string = string.lstrip("\\/")
    return string


def escape_if_OSX(file_name):
    if sys.platform == CONSTANTS.MAC_OS:
        file_name = file_name.replace(" ", "%20")
    return file_name


def print_for_unimplemented_functions(function_name):
    unimp_msg = f"'{function_name}' is not implemented in the simulator but it will work on the actual device!\n"
    send_print_to_simulator(unimp_msg)
