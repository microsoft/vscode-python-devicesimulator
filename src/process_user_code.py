# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import os
import io
import sys
import copy
import json
import threading
import traceback
import python_constants as CONSTANTS
from pathlib import Path
import check_python_dependencies

# will propagate errors if dependencies aren't sufficient
check_python_dependencies.check_for_dependencies()

read_val = ""
threads = []
# Redirecting the process stdout
user_stdout = io.StringIO()
sys.stdout = user_stdout

abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))

# Insert absolute path to library for CLUE into sys.path
sys.path.insert(0, os.path.join(abs_path_to_parent_dir, CONSTANTS.CLUE_DIR))

# Insert absolute path to Circuitpython libraries for CLUE into sys.path
sys.path.insert(0, os.path.join(abs_path_to_parent_dir, CONSTANTS.CIRCUITPYTHON))

# Insert absolute path to Adafruit library for CPX into sys.path
abs_path_to_adafruit_lib = os.path.join(
    abs_path_to_parent_dir, CONSTANTS.ADAFRUIT_LIBRARY_NAME
)
sys.path.insert(0, abs_path_to_adafruit_lib)

# Insert absolute path to Micropython libraries for micro:bit into sys.path
abs_path_to_micropython_lib = os.path.join(
    abs_path_to_parent_dir, CONSTANTS.MICROPYTHON_LIBRARY_NAME
)
sys.path.insert(0, abs_path_to_micropython_lib)

# This import must happen after the sys.path is modified
from common.telemetry import telemetry_py
from common import utils
from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground.constants import CPX

from microbit.__model.microbit_model import __mb as mb
from microbit.__model.constants import MICROBIT

from adafruit_clue import clue
from base_circuitpython.base_cp_constants import CLUE
import board

# get handle to terminal for clue
curr_terminal = board.DISPLAY.terminal

# Handle User Inputs Thread
class UserInput(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        device_dict = {CPX: cpx, MICROBIT: mb, CLUE: clue}
        while True:
            read_val = sys.stdin.readline()
            sys.stdin.flush()
            try:
                new_state_message = json.loads(read_val)
                device = new_state_message.get(CONSTANTS.ACTIVE_DEVICE_FIELD)
                new_state = new_state_message.get(CONSTANTS.STATE_FIELD, {})
                if device in device_dict:
                    device_dict[device].update_state(new_state)
                else:
                    raise Exception(CONSTANTS.DEVICE_NOT_IMPLEMENTED_ERROR)

            except Exception as e:
                print(CONSTANTS.ERROR_SENDING_EVENT, e, file=sys.stderr, flush=True)


user_input = UserInput()
threads.append(user_input)
user_input.start()


# Handle User's Print Statements Thread
def handle_user_prints():
    global user_stdout
    global curr_terminal
    while True:
        if user_stdout.getvalue():
            message = {"type": "print", "data": user_stdout.getvalue()}

            # when I use the value for user_stdout.getvalue() directly
            # as the argument for add_str_to_terminal, it only sends the first
            # line of the stream.

            # hence, I parse it out of the message dict and take off the
            # extra newline at the end.

            data_str = str(message["data"])
            curr_terminal.add_str_to_terminal(data_str[:-1])
            print(json.dumps(message), file=sys.__stdout__, flush=True)
            user_stdout.truncate(0)
            user_stdout.seek(0)


user_prints = threading.Thread(target=handle_user_prints)
threads.append(user_prints)
user_prints.start()


# Execute User Code Thread
def execute_user_code(abs_path_to_code_file):
    global curr_terminal
    curr_terminal.add_str_to_terminal(CONSTANTS.CODE_START_MSG_CLUE)
    utils.abs_path_to_user_file = abs_path_to_code_file
    # Execute the user's code.py file
    with open(abs_path_to_code_file, encoding="utf8") as user_code_file:
        user_code = user_code_file.read()
        try:
            codeObj = compile(user_code, abs_path_to_code_file, CONSTANTS.EXEC_COMMAND)
            exec(codeObj, {})
            sys.stdout.flush()
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            errorMessage = CONSTANTS.ERROR_TRACEBACK
            stackTrace = traceback.format_exception(exc_type, exc_value, exc_traceback)

            for frameIndex in range(2, len(stackTrace) - 1):
                errorMessage += "\t" + str(stackTrace[frameIndex])
            print(e, errorMessage, file=sys.stderr, flush=True)

            curr_terminal.add_str_to_terminal(errorMessage)

    curr_terminal.add_str_to_terminal(CONSTANTS.CODE_FINISHED_MSG_CLUE)
    board.DISPLAY.show(None)


user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code)
telemetry_state = json.loads(sys.argv[2])

telemetry_py._Telemetry__enable_telemetry = telemetry_state.get(
    CONSTANTS.ENABLE_TELEMETRY, True
)
threads.append(user_code)
user_code.start()

for thread in threads:
    thread.join()
