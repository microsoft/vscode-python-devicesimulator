import sys
import json

def show(state):
    print(json.dumps(state) + '\0', end='')
    sys.stdout.flush()