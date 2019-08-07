# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import copy
import time


previousState = {}
TIME_DELAY = 0.01


def show(state):
    global previousState
    if state != previousState:
        message = {'type': 'state', 'data': json.dumps(state)}
        print(json.dumps(message) + '\0', end='')
        sys.stdout.flush()
        previousState = copy.deepcopy(state)
        time.sleep(TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string
