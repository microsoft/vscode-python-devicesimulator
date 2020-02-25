# from https://stackoverflow.com/questions/1871549/determine-if-python-is-running-inside-virtualenv
import sys

isVenv = hasattr(sys, "real_prefix") or (
    hasattr(sys, "base_prefix") and sys.base_prefix != sys.prefix
)

# prints result for frontend to read
# 1 -> is a venv
# 0 -> is NOT a venv
print(int(isVenv))
