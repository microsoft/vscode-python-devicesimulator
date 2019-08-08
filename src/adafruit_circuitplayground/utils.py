# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import copy
from . import communication_handler_client


previousState = {}


def show(state):
    global previousState
    if state != previousState:
        message = {'type': 'state', 'data': json.dumps(state)}
        communication_handler_client.update_state(json.dumps(message))
        previousState = copy.deepcopy(state)


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string
