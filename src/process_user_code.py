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

# Insert absolute path to python libraries into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, CONSTANTS.PYTHON_LIBS_DIR)
sys.path.insert(0, abs_path_to_lib)

read_val = ""
threads = []
# Redirecting the process stdout
user_stdout = io.StringIO()
sys.stdout = user_stdout

# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, CONSTANTS.LIBRARY_NAME)
sys.path.insert(0, abs_path_to_lib)

# This import must happen after the sys.path is modified
from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground.telemetry import telemetry_py
from microbit.__model.microbit_model import __mb as mb


# Handle User Inputs Thread
class UserInput(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            read_val = sys.stdin.readline()
            sys.stdin.flush()
            try:
                new_state = json.loads(read_val)
                for event in CONSTANTS.EXPECTED_INPUT_EVENTS_CPX:
                    cpx._Express__state[event] = new_state.get(
                        event, cpx._Express__state[event]
                    )

            except Exception as e:
                print(CONSTANTS.ERROR_SENDING_EVENT, e, file=sys.stderr, flush=True)


user_input = UserInput()
threads.append(user_input)
user_input.start()


# Handle User's Print Statements Thread
def handle_user_prints():
    global user_stdout
    while True:
        if user_stdout.getvalue():
            message = {"type": "print", "data": user_stdout.getvalue()}
            print(json.dumps(message), file=sys.__stdout__, flush=True)
            user_stdout.truncate(0)
            user_stdout.seek(0)


user_prints = threading.Thread(target=handle_user_prints)
threads.append(user_prints)
user_prints.start()


# Execute User Code Thread
def execute_user_code(abs_path_to_code_file):
    cpx._Express__abs_path_to_code_file = abs_path_to_code_file
    # Execute the user's code.py file
    with open(abs_path_to_code_file) as user_code_file:
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


user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code)
telemetry_state = json.loads(sys.argv[2])

telemetry_py._Telemetry__enable_telemetry = telemetry_state.get(
    CONSTANTS.ENABLE_TELEMETRY, True
)
threads.append(user_code)
user_code.start()

for thread in threads:
    thread.join()
