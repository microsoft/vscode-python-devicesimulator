from .model import constants as CONSTANTS
from .microbit.model.microbit_model import mb

# from . import debugger_communication_client
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
        print(json.dumps(message) + "\0", end="", file=sys.__stdout__, flush=True)
        time.sleep(CONSTANTS.TIME_DELAY)
