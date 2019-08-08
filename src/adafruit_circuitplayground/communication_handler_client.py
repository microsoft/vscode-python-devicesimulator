# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import socketio
import json
from . import express


DEFAULT_PORT = 5555

# Create Socket Client
sio = socketio.Client()

# TODO: Get port from process_user_code.py via childprocess communication
# TODO: Move events sent to a constant (have it for py and ts?)

# Initialize connection
def init_connection(port=DEFAULT_PORT):
    sio.connect(f'http://localhost:{port}')

# Method : Update State
def update_state(state):
    sio.emit('updateState', state)


## Events Handlers ##

# Event : connection
@sio.event
def connect():
    print("I'm connected!")


# Event : Button A Pressed
@sio.on('button_a_pressed')
def button_a_pressed(data):
    event_state = json.loads(data)
    express.cpx._Express__state['button_a'] = event_state.get(
        'button_a', express.cpx._Express__state['button_a'])
    print(f'MESSAGE BUTTONS A received from server: {data}', flush=True)

# ## User inputs
# EXPECTED_INPUT_EVENTS = [
#     'button_a',
#     'button_b',
#     'switch',
#     'temperature',
#     'light',
#     'motion_x',
#     'motion_y',
#     'motion_z'
# ]
