import pathlib
import os
import sys

abs_path = pathlib.Path(__file__).parent.absolute()
clue_path = os.path.join(abs_path, "../clue")
sys.path.insert(0, os.path.join(abs_path))
sys.path.insert(0, os.path.join(clue_path))
