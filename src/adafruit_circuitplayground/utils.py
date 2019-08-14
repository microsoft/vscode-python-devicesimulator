# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import copy
import time
from . import constants as CONSTANTS
from . import communication_handler_client


previous_state = {}


def show(state, debug_mode=False):
    global previous_state
    if state != previous_state:
        previous_state = copy.deepcopy(state)
        message = {'type': 'state', 'data': json.dumps(state)}
        if debug_mode:
            communication_handler_client.update_state(json.dumps(message))
        else:
            print(json.dumps(message) + '\0', end='',
                  file=sys.__stdout__, flush=True)
            time.sleep(CONSTANTS.TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string
