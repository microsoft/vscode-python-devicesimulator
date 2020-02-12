# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import socketio
import copy
# from adafruit_circuitplayground import cpx
# from microbit import __mb as mb
from . import constants as CONSTANTS
from common import utils


from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground.constants import CPX

from microbit.__model.microbit_model import __mb as mb
from microbit.__model.constants import MICROBIT


device_dict = {CPX: cpx, MICROBIT: mb}
previous_state = {}

# similar to utils.send_to_simulator, but for debugging
# (needs handle to device-specific debugger)
def debug_show(state, active_device):
    global previous_state

    if state != previous_state:
        previous_state = copy.deepcopy(state)

        updated_state = utils.update_state_with_device_name(state, active_device)
        message = utils.create_message(updated_state)

        update_state(json.dumps(message))


# Create Socket Client
sio = socketio.Client(reconnection_attempts=2)

# TODO: Get port from process_user_code.py via childprocess communication


# Initialize connection
def init_connection(port=CONSTANTS.DEFAULT_PORT):
    sio.connect("http://localhost:{}".format(port))


# Transfer the user's inputs to the API
def __update_api_state(data, expected_events):
    try:
        event_state = json.loads(data)
        active_device = event_state.get("active_device")
        
        # for event in expected_events:
        #     express.cpx._Express__state[event] = event_state.get(
        #         event, express.cpx._Express__state[event]
        #     )
    except Exception as e:
        print(CONSTANTS.ERROR_SENDING_EVENT, e, file=sys.stderr, flush=True)


# Method : Update State
def update_state(state):
    sio.emit("updateState", state)


## Events Handlers ##


# Event : Button pressed (A, B, A+B, Switch)
@sio.on("button_press")
def button_press(data):
    __update_api_state(data, CONSTANTS.EVENTS_BUTTON_PRESS)


# Event : Sensor changed (Temperature, light, Motion)
@sio.on("sensor_changed")
def sensor_changed(data):
    __update_api_state(data, CONSTANTS.EVENTS_SENSOR_CHANGED)
