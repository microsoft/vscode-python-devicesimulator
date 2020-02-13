# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import socketio
import copy

from . import constants as CONSTANTS
from . import utils


from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground.constants import CPX

from microbit.__model.microbit_model import __mb as mb
from microbit.__model.constants import MICROBIT


device_dict = {CPX: cpx, MICROBIT: mb}
previous_state = {}

# similar to utils.send_to_simulator, but for debugging
# (needs handle to device-specific debugger)
def debug_send_to_simulator(state, active_device):
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
def __update_api_state(data):
    try:
        event_state = json.loads(data)
        active_device = event_state.get(CONSTANTS.ACTIVE_DEVICE_FIELD)
        # can we do without this?
        device_dict[active_device].update_state(data)
    except Exception as e:
        print(CONSTANTS.ERROR_SENDING_EVENT, e, file=sys.stderr, flush=True)


# Method : Update State
def update_state(state):
    sio.emit("updateState", state)


## Events Handlers ##


# Event : Button pressed (A, B, A+B, Switch)
@sio.on("button_press")
def button_press(data):
    __update_api_state(data)


# Event : Sensor changed (Temperature, light, Motion)
@sio.on("sensor_changed")
def sensor_changed(data):
    __update_api_state(data)
