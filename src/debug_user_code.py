# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import os
import sys
import traceback
from pathlib import Path
import python_constants as CONSTANTS
from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground import debugger_communication_client


# Init Communication
debugger_communication_client.init_connection()

# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, CONSTANTS.LIBRARY_NAME)
sys.path.insert(0, abs_path_to_lib)


# Execute User Code
abs_path_to_code_file = ''
if len(sys.argv) > 1 and sys.argv[1]:
    abs_path_to_code_file = sys.argv[1]
else:
    raise FileNotFoundError(CONSTANTS.ERROR_NO_FILE)

cpx._Express__abs_path_to_code_file = abs_path_to_code_file
cpx._Express__debug_mode = True
cpx.pixels._Pixel__set_debug_mode(True)

# Execute the user's code file
with open(abs_path_to_code_file) as user_code_file:
    user_code = user_code_file.read()
    try:
        codeObj = compile(user_code, abs_path_to_code_file,
                          CONSTANTS.EXEC_COMMAND)
        exec(codeObj, {})
        sys.stdout.flush()
    except Exception as e:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        errorMessage = CONSTANTS.ERROR_TRACEBACK
        stackTrace = traceback.format_exception(
            exc_type, exc_value, exc_traceback)

        for frameIndex in range(2, len(stackTrace) - 1):
            errorMessage += '\t' + str(stackTrace[frameIndex])
        print(e, errorMessage, file=sys.stderr, flush=True)
