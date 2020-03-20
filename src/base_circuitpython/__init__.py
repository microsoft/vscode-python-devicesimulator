import pathlib
import os
import sys

abs_path = pathlib.Path(__file__).parent.absolute()
sys.path.insert(0, os.path.join(abs_path))
