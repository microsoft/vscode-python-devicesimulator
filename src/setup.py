import os
import sys
import json
from pathlib import Path

# Insert absolute path to Adafruit library into sys.path
abs_path_to_parent_dir = os.path.dirname(os.path.abspath(__file__))
library_name = "adafruit_circuitplayground"
abs_path_to_lib = os.path.join(abs_path_to_parent_dir, library_name)
sys.path.insert(0, abs_path_to_lib)

# Add path to Adafruit library as an extra package for autocomplete
home = str(Path.home())
windows_settings_path = home + "\\AppData\\Roaming\\Code\\User\\settings.json"
with open(windows_settings_path, 'r') as settingsJSON:
    settings = json.load(settingsJSON) 

extraPaths = settings["python.autoComplete.extraPaths"]
if extraPaths and abs_path_to_parent_dir not in extraPaths:
    settings["python.autoComplete.extraPaths"].append(abs_path_to_parent_dir)
else:
    settings["python.autoComplete.extraPaths"] = [abs_path_to_parent_dir]

with open(windows_settings_path, "w") as settingsJSON:
    json.dump(settings, settingsJSON)

# Execute the user's code.py file
abs_path_to_code_file = sys.argv[1]
with open(abs_path_to_code_file) as file:
   user_code = file.read()
   exec(user_code) 