import os
import sys
import json
import threading
from adafruit_circuitplayground.express import cpx

read_val = ""


class UserInput(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        while True:
            # lock.acquire()
            read_val = sys.stdin.readline()
            # print("read"+read_val)
            # lock.release()
            if not read_val:
                print("nothing")
            try:
                # print("hi " + read_val)
                cpx.state = json.loads(read_val)
                # print(json.dumps(cpx.state))
                # sys.stdout.flush()
            except Exception as e:
                print("oh no" ,e)


# Read data from stdin


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.abspath(os.getcwd())
library_name = "adafruit_circuitplayground"
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, library_name)
sys.path.insert(0, abs_path_to_lib)

threads = []
lock = threading.Lock()
user_input = UserInput()
threads.append(user_input)
user_input.start()

def execute_user_code(abs_path_to_code_file):
    # Execute the user's code.py file
    with open(abs_path_to_code_file) as file:
        user_code = file.read()
        exec(user_code)

user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code )
threads.append(user_code)
user_code.start()

for x in threads:
    x.join()
