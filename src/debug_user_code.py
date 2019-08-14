# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import os
import io
import sys
import copy
import json
import threading
import traceback
from pathlib import Path
import python_constants as CONSTANTS
from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground import communication_handler_client


# Init Communication
communication_handler_client.init_connection()

# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, CONSTANTS.LIBRARY_NAME)
sys.path.insert(0, abs_path_to_lib)


# Execute User Code Thread
def execute_user_code(abs_path_to_code_file):
    cpx._Express__abs_path_to_code_file = abs_path_to_code_file
    cpx._Express__debug_mode = True
    cpx.pixels._Pixel__set_debug_mode(True)
    # Execute the user's code.py file
    with open(abs_path_to_code_file) as file:
        user_code = file.read()
        try:
            codeObj = compile(user_code, abs_path_to_code_file,
                              CONSTANTS.EXEC_COMMAND)
            exec(codeObj)
            sys.stdout.flush()
        except Exception as e:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            errorMessage = CONSTANTS.ERROR_TRACEBACK
            stackTrace = traceback.format_exception(
                exc_type, exc_value, exc_traceback)

            for frameIndex in range(2, len(stackTrace) - 1):
                errorMessage += '\t' + str(stackTrace[frameIndex])
            print(e, errorMessage, file=sys.stderr, flush=True)


user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code)
user_code.start()
user_code.join()
