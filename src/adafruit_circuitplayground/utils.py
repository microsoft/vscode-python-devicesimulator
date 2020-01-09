# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import copy
import time
from . import constants as CONSTANTS
from . import debugger_communication_client
from applicationinsights import TelemetryClient

previous_state = {}


def show(state, debug_mode=False, microbit=False):
    global previous_state
    if state != previous_state:
        previous_state = copy.deepcopy(state)
        if microbit:
            message = {'device':'mb', 'type': 'state', 'data': json.dumps(state)}
        else:
            message = {'device':'cpx', 'type': 'state', 'data': json.dumps(state)}
        if debug_mode:
            debugger_communication_client.update_state(json.dumps(message))
        else:
            print(json.dumps(message) + '\0', end='',
                  file=sys.__stdout__, flush=True)
            time.sleep(CONSTANTS.TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string


def escape_if_OSX(file_name):
    if sys.platform.startswith(CONSTANTS.MAC_OS):
        file_name = file_name.replace(" ", "%20")
    return file_name