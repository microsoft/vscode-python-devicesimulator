import sys
import json

def show(state):
    print(json.dumps(state) + '\0', end='', flush=True)

def remove_leading_slashes(string):
    string = string.lstrip('\\/')
    
    return string