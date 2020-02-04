# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

CPX_DRIVE_NAME = "CIRCUITPY"

ENABLE_TELEMETRY = "enable_telemetry"
EXPECTED_INPUT_EVENTS_CPX = [
    "button_a",
    "button_b",
    "switch",
    "temperature",
    "light",
    "shake",
    "motion_x",
    "motion_y",
    "motion_z",
    "touch",
]

TAB_CHANGE_EVENT = "active_device"

EXEC_COMMAND = "exec"
ERROR_SENDING_EVENT = "Error trying to send event to the process : "
ERROR_TRACEBACK = "\n\tTraceback of code execution : \n"
ERROR_NO_FILE = "Error : No file was passed to the process to execute.\n"

LIBRARY_NAME = "adafruit_circuitplayground"
LINUX_OS = "linux"

MAC_OS = "darwin"
MOUNT_COMMAND = "mount"

NO_CPX_DETECTED_ERROR_TITLE = "No Circuit Playground Express detected"
NO_CPX_DETECTED_ERROR_DETAIL = (
    "Could not find drive with name 'CIRCUITPYTHON'. Detected OS: {}"
)
NOT_SUPPORTED_OS = 'The OS "{}" not supported.'
NOT_IMPLEMENTED_ERROR = "This method is not implemented by the simulator"

PYTHON_LIBS_DIR = "python_libs"

UTF_FORMAT = "utf-8"

WINDOWS_OS = "win32"

DEFAULT_PORT = "5577"
