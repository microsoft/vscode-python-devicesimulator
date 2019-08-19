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


telemetry_client = TelemetryClient('__AIKEY__')
EXTENSION_NAME = '__EXTENSIONNAME__'


def show(state, debug_mode=False):
    global previous_state
    if state != previous_state:
        previous_state = copy.deepcopy(state)
        message = {'type': 'state', 'data': json.dumps(state)}
        if debug_mode:
            debugger_communication_client.update_state(json.dumps(message))
        else:
            print(json.dumps(message) + '\0', end='',
                  file=sys.__stdout__, flush=True)
            time.sleep(CONSTANTS.TIME_DELAY)


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string


def send_telemetry(event_name):
    print(f"calling with tstate {event_name}", flush=True)
    telemetry_client.track_event(
        '{}/{}'.format(EXTENSION_NAME, CONSTANTS.TELEMETRY_EVENT_NAMES[event_name]))
    telemetry_client.flush()
