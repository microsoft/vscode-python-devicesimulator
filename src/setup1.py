import os
import sys
import json
import threading
import time
from adafruit_circuitplayground.express import cpx

read_val = ""


class UserInput(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)
        self.read_val = ""

    def run(self):
        while True:
            with lock:
                read_val = sys.stdin.readline()
            if read_val:
                print("sasa something")
                try:
                    read_val = json.loads(read_val)
                    print("hi " + read_val)
                except:
                    print("there was an issue")
            else:
                time.sleep(2)


# Read data from stdin


def read_in():
    print("pls pls pls")
    # lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return "hi"#json.loads(lines[0])


# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.abspath(os.getcwd())
library_name = "adafruit_circuitplayground"
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, library_name)
sys.path.insert(0, abs_path_to_lib)

# threads = []
# lock = threading.Lock()
# user_input = UserInput()
# threads.append(user_input)
# user_input.start()


# def execute_user_code(user_path):
#     # Execute the user's code.py file
#     f = open(user_path)
#     lines = f.read()
#     f.close()
#     exec(lines)


# user_code = threading.Thread(args=(sys.argv[1],), target=execute_user_code )
# threads.append(user_code)
# user_code.start()
while True:
    read_val = sys.stdin.readlines()[0]
    if read_val:
        print("sasa something")
        try:
            read_val = json.loads(read_val)
            print("hi " + read_val)
        except:
            print("there was an issue")
    else:
        print("else")
        time.sleep(2)

for x in threads:
    x.join()
