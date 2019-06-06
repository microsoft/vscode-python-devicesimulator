import os
import sys

# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.abspath(os.getcwd())
library_name = "adafruit_circuitplayground"
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, library_name)
sys.path.insert(0, abs_path_to_lib)