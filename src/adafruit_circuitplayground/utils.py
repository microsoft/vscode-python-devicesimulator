# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import copy
from . import communicationHandlerClient


previousState = {}

def show(state):
    global previousState
    if state != previousState:
        message = {'type': 'state', 'data': json.dumps(state)}
        # print(json.dumps(message) + '\0', end='')
        # sys.stdout.flush()
        communicationHandlerClient.updateState(json.dumps(message))
        previousState = copy.deepcopy(state)



def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string
