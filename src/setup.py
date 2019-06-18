import os
import sys
import json
import threading
import copy
from pathlib import Path

read_val = ""


class UserInput(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        from adafruit_circuitplayground.express import cpx
        while True:
            read_val = sys.stdin.readline()
            sys.stdin.flush()
            try:
                new_state = json.loads(read_val)
                cpx.state['button_a'] = new_state.get(
                    'button_a', cpx.state['button_a'])
                cpx.state['button_b'] = new_state.get(
                    'button_b', cpx.state['button_b'])
            except Exception as e:
                print("oh no", e)


# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
library_name = "adafruit_circuitplayground"
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, library_name)
sys.path.insert(0, abs_path_to_lib)

threads = []
user_input = UserInput()
threads.append(user_input)
user_input.start()


# User code thread
def execute_user_code(abs_path_to_code_file):
    # Execute the user's code.py file
    with open(abs_path_to_code_file) as file:
        user_code = file.read()
        try:
            exec(user_code)
        except Exception as e:
            print("Error in code execution : ", e)
            sys.stdout.flush()


user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code)
threads.append(user_code)
user_code.start()

for thread in threads:
    thread.join()
