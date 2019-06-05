import os
import sys

# Insert absolute path to Adafruit library into sys.path
abs_path_to_lib = os.path.abspath(os.getcwd()) + "\\adafruit_circuitplayground"
sys.path.insert(0, abs_path_to_lib)