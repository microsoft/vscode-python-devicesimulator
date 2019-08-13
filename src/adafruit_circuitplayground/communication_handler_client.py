# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import socketio
from . import express


DEFAULT_PORT = 5678
EVENTS_BUTTON_PRESS = ['button_a', 'button_b', 'switch']
EVENTS_SENSOR_CHANGED = ['temperature', 'light',
                         'motion_x', 'motion_y', 'motion_z']

# Create Socket Client
sio = socketio.Client()

# TODO: Get port from process_user_code.py via childprocess communication
# TODO: Move events sent to a constant (have it for py and ts?)

# Initialize connection
def init_connection(port=DEFAULT_PORT):
    sio.connect(f'http://localhost:{port}')

# Transfer the user's inputs to the API
def __update_api_state(data, expected_events):
    try:
        event_state = json.loads(data)
        for event in expected_events:
            express.cpx._Express__state[event] = event_state.get(
                event, express.cpx._Express__state[event])
    except Exception as e:
        print("Error trying to send event to the process : ",
              e, file=sys.stderr, flush=True)

# Method : Update State
def update_state(state):
    sio.emit('updateState', state)


## Events Handlers ##

# Event : connection
@sio.event
def connect():
    print("I'm connected!")


# Event : Button pressed (A, B, A+B, Switch)
@sio.on('button_press')
def button_press(data):
    __update_api_state(data, EVENTS_BUTTON_PRESS)


# Event : Sensor changed (Temperature, light, Motion)
@sio.on('sensor_changed')
def button_press(data):
    __update_api_state(data, EVENTS_SENSOR_CHANGED)
