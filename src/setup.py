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
            print("read"+read_val)
            # lock.release()
            if not read_val:
                break
            try:
                read_val = json.loads(read_val)
                print("hi " + read_val)
            except:
                break


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

# Execute the user's code.py file
abs_path_to_code_file = sys.argv[1]
with open(abs_path_to_code_file) as file:
    user_code = file.read()
    exec(user_code)

for x in threads:
    x.join()
