import sys
import json

def show(state):
    message = {'type': 'state', 'data': json.dumps(state)}
    print(json.dumps(message) + '\0', end='')
    sys.stdout.flush()