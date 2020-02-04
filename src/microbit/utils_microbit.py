from . import constants as CONSTANTS
from . import debugger_communication_client
import json
import copy
import time
import sys


previous_state = {}


def show(state, debug_mode=False):
    global previous_state
    if state != previous_state:
        previous_state = copy.deepcopy(state)
        message = {"type": "state", "data": json.dumps(state)}
        if debug_mode:
            debugger_communication_client.update_state(json.dumps(message))
        else:
            print(json.dumps(message) + "\0", end="", file=sys.__stdout__, flush=True)
            time.sleep(CONSTANTS.TIME_DELAY)
