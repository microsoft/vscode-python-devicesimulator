# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

from . import constants as CONSTANTS
import json
import copy
import time
import sys

previous_state = {}

abs_path_to_user_file = ""


def update_state_with_device_name(state, device_name):
    updated_state = dict(state)

    state_ext = {
        "device_name": device_name,
    }
    updated_state.update(state_ext)

    return updated_state


def create_message(state):
    message = {"type": "state", "data": json.dumps(state)}
    return message


def send_to_simulator(state, device_name):
    global previous_state

    updated_state = update_state_with_device_name(state, device_name)
    message = create_message(updated_state)

    if updated_state != previous_state:
        previous_state = copy.deepcopy(updated_state)
        print(json.dumps(message) + "\0", end="", file=sys.__stdout__, flush=True)
        time.sleep(CONSTANTS.TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip("\\/")
    return string


def escape_if_OSX(file_name):
    if sys.platform == CONSTANTS.MAC_OS:
        file_name = file_name.replace(" ", "%20")
    return file_name


def print_for_unimplemented_functions(function_name, one_more_call=False):
    # Frame 0 is this function call
    # Frame 1 is the call that calls this function, which is a microbit function
    # Frame 2 is the call that calls the microbit function, which is in the user's file
    # If one_more_call is True, then there is another frame between what was originally supposed to be frame 1 and 2.
    frame_no = 2 if not one_more_call else 3
    line_number = sys._getframe(frame_no).f_lineno
    user_file_name = sys._getframe(frame_no).f_code.co_filename
    print(
        f"'{function_name}' on line {line_number} in {user_file_name} is not implemented in the simulator but it will work on the actual device!"
    )
