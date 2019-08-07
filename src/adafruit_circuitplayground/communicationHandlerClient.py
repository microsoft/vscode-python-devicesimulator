import socketio
import json
from . import express

# Create Socket Client
sio = socketio.Client(reconnection_attempts=2)

# Initialize connection
# TODO: Check port value ??


def initConnection(port=5555):
    sio.connect('http://localhost:' + str(port))


## Add events handler

@sio.on('messageFromServer')
def message(data):
    print('Message received from server:')
    print(data)

# Event : connection
@sio.event
def connect():
    print("I'm connected!")

# Method : Test Message
def sendMessage(state):
    sio.emit('messageFromClient', {'state': 'json'})

# Method : Update State
def updateState(state):
    sio.emit('updateState', state)

# Event : Message from server
@sio.on('messageFromServer')
def message(data):
    print('Message received from server:')
    print(data)

# Event : Button A Pressed
@sio.on('button_a_pressed')
def message(data):
    new_state = json.loads(data)
    express.cpx._Express__state['button_a'] = new_state.get('button_a', express.cpx._Express__state['button_a'])
    print('MESSAGE BUTTONS A received from server: ', data, flush=True)
    # print(data)

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

# new_state = json.loads(read_val)
# for event in EXPECTED_INPUT_EVENTS:
#     cpx._Express__state[event] = new_state.get(event, cpx._Express__state[event])