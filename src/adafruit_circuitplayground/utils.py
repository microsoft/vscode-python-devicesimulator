import sys
import json

def show(state):
    print(json.dumps(state) + '\0', end='', flush=True)

def remove_leading_slashes(string):
    forward_slash_count = string.count('/')
    back_slash_count = string.count('\\')
        
    if forward_slash_count > 1:
        string = string.lstrip('/')
    elif back_slash_count > 0:
        string = string.lstrip('\\')
    
    return string