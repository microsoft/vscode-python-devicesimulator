import socketio

# Create Socket Client
sio = socketio.Client(reconnection_attempts=2)

# Initialize connection
# TODO: Check port value ??


def initConnection(port=5555):
    sio.connect('http://localhost:' + str(port))


## Add events handler

# Event : Message from server
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
