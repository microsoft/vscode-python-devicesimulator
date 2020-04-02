# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

import sys
import json
import socketio
import copy

from . import constants as CONSTANTS
from . import utils
import threading


from adafruit_circuitplayground.express import cpx
from adafruit_circuitplayground.constants import CPX

from microbit.__model.microbit_model import __mb as mb
from microbit.__model.constants import MICROBIT

from base_circuitpython.base_cp_constants import CLUE
from adafruit_clue import clue

device_dict = {CPX: cpx, MICROBIT: mb, CLUE: clue}
processing_state_event = threading.Event()
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
sio = socketio.Client(reconnection_attempts=CONSTANTS.CONNECTION_ATTEMPTS)

# TODO: Get port from process_user_code.py via childprocess communication


# Initialize connection
def init_connection(port=CONSTANTS.DEFAULT_PORT):
    sio.connect("http://localhost:{}".format(port))


# Transfer the user's inputs to the API
def __update_api_state(data):
    try:
        event_state = json.loads(data)
        active_device_string = event_state.get(CONSTANTS.ACTIVE_DEVICE_FIELD)

        if active_device_string is not None:
            active_device = device_dict.get(active_device_string)
            if active_device is not None:
                active_device.update_state(event_state.get(CONSTANTS.STATE_FIELD))

    except Exception as e:
        print(CONSTANTS.ERROR_SENDING_EVENT, e, file=sys.stderr, flush=True)


# Method : Update State
def update_state(state):
    processing_state_event.clear()
    sio.emit("updateState", state)
    processing_state_event.wait()


# Event : Button pressed (A, B, A+B, Switch)
# or Sensor changed (Temperature, light, Motion)
@sio.on("input_changed")
def input_changed(data):
    sio.emit("receivedState", data)
    __update_api_state(data)


@sio.on("received_state")
def received_state(data):
    processing_state_event.set()


@sio.on("process_disconnect")
def process_disconnect(data):
    sio.disconnect()
