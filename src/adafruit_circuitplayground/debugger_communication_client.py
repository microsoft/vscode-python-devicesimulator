# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import socketio
from . import express
from . import constants as CONSTANTS


# Create Socket Client
sio = socketio.Client(reconnection_attempts=2)

# TODO: Get port from process_user_code.py via childprocess communication


# Initialize connection
def init_connection(port=CONSTANTS.DEFAULT_PORT):
    sio.connect(f'http://localhost:{port}')


# Transfer the user's inputs to the API
def __update_api_state(data, expected_events):
    try:
        event_state = json.loads(data)
        for event in expected_events:
            express.cpx._Express__state[event] = event_state.get(
                event, express.cpx._Express__state[event])
    except Exception as e:
        print(CONSTANTS.ERROR_SENDING_EVENT,
              e, file=sys.stderr, flush=True)


# Method : Update State
def update_state(state):
    sio.emit('updateState', state)


## Events Handlers ##


# Event : Button pressed (A, B, A+B, Switch)
@sio.on('button_press')
def button_press(data):
    __update_api_state(data, CONSTANTS.EVENTS_BUTTON_PRESS)


# Event : Sensor changed (Temperature, light, Motion)
@sio.on('sensor_changed')
def button_press(data):
    __update_api_state(data, CONSTANTS.EVENTS_SENSOR_CHANGED)
