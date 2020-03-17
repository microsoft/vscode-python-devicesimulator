import subprocess
import sys
import pathlib
import os

os.chdir(pathlib.Path(__file__).parent.parent.absolute())
subprocess.check_call(
    [sys.executable, "-m", "pip", "install", "-r", "./out/requirements.txt"]
)
