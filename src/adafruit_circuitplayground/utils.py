# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import copy
import time
from . import communication_handler_client


previousState = {}
TIME_DELAY = 0.03


def show(state, debug_mode=False):
    global previousState
    if state != previousState:
        previousState = copy.deepcopy(state)
        message = {'type': 'state', 'data': json.dumps(state)}
        if debug_mode:
            communication_handler_client.update_state(json.dumps(message))
        else:
            print(json.dumps(message) + '\0', end='',
                  file=sys.__stdout__, flush=True)
            time.sleep(TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string
