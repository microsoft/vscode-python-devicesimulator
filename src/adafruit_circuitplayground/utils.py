import sys
import json


def show(state):
    message = {'type': 'state', 'data': json.dumps(state)}
    print(json.dumps(message) + '\0', end='')
    sys.stdout.flush()


def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    return string
