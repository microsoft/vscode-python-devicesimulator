# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import os
import sys
import traceback
from pathlib import Path
import python_constants as CONSTANTS
import check_python_dependencies

# will propagate errors if dependencies aren't sufficient
check_python_dependencies.check_for_dependencies()

abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))

# Insert absolute path to Adafruit library for CPX into sys.path
abs_path_to_adafruit_lib = os.path.join(abs_path_to_parent_dir, CONSTANTS.ADAFRUIT_LIBRARY_NAME)
sys.path.insert(0, abs_path_to_adafruit_lib)

# Insert absolute path to Micropython libraries for micro:bit into sys.path
abs_path_to_micropython_lib = os.path.join(abs_path_to_parent_dir, CONSTANTS.MICROPYTHON_LIBRARY_NAME)
sys.path.insert(0, abs_path_to_micropython_lib)

# This import must happen after the sys.path is modified
from adafruit_circuitplayground.express import cpx
from micropython.microbit.__model.microbit_model import __mb as mb
from common import debugger_communication_client


## Execute User Code ##


# Get user's code path
abs_path_to_code_file = ""
if len(sys.argv) > 1 and sys.argv[1]:
    abs_path_to_code_file = sys.argv[1]
else:
    raise FileNotFoundError(CONSTANTS.ERROR_NO_FILE)

# Get Debugger Server Port
server_port = CONSTANTS.DEFAULT_PORT
if len(sys.argv) > 2:
    server_port = sys.argv[2]

# Init Communication
debugger_communication_client.init_connection(server_port)

# Init API variables
cpx._Express__abs_path_to_code_file = abs_path_to_code_file
cpx._Express__debug_mode = True
cpx.pixels._Pixel__set_debug_mode(True)
mb._MicrobitModel__set_debug_mode(True)

# Execute the user's code file
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
