# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import os
import sys
import json
import threading
import copy
from adafruit_circuitplayground.express import cpx
from pathlib import Path
import traceback

AWAITED_EVENTLIST = [
    'button_a',
    'button_b',
    'switch',
    'temperature',
    'light'
]

read_val = ""


class UserInput(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        from adafruit_circuitplayground.express import cpx
        while True:
            read_val = sys.stdin.readline()
            sys.stdin.flush()
            try:
                new_state = json.loads(read_val)
                for event in AWAITED_EVENTLIST:
                    cpx._Express__state[event] = new_state.get(
                        event, cpx._Express__state[event])

            except Exception as e:
                print("Error trying to send event to the process : ",
                      e, file=sys.stderr, flush=True)


# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
library_name = "adafruit_circuitplayground"
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, library_name)
sys.path.insert(0, abs_path_to_lib)

threads = []
user_input = UserInput()
threads.append(user_input)
user_input.start()

# User code thread


def execute_user_code(abs_path_to_code_file):
    cpx._Express__abs_path_to_code_file = abs_path_to_code_file
    # Execute the user's code.py file
    with open(abs_path_to_code_file) as file:
        user_code = file.read()
        try:
            codeObj = compile(user_code, abs_path_to_code_file, 'exec')
            exec(codeObj)
            sys.stdout.flush()
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            errorMessage = '\n\tTraceback of code execution : \n'
            stackTrace = traceback.format_exception(
                exc_type, exc_value, exc_traceback)

            for frameIndex in range(2, len(stackTrace) - 1):
                errorMessage += '\t' + str(stackTrace[frameIndex])
            print(e, errorMessage, file=sys.stderr, flush=True)


user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code)
threads.append(user_code)
user_code.start()

for thread in threads:
    thread.join()
