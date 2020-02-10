# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

ACTIVE_DEVICE_FIELD = "active_device"

CPX_DRIVE_NAME = "CIRCUITPY"

DEVICE_NOT_IMPLEMENTED_ERROR = "Device not implemented."

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

EXPECTED_INPUT_ACCEL_MICROBIT = {"motion_x": "x", "motion_y": "y", "motion_z": "z"}

EXPECTED_INPUT_BUTTONS_MICROBIT = [
    "button_a",
    "button_b",
]

EXPECTED_INPUT_LIGHT_MICROBIT = "light"

EXPECTED_INPUT_SENSORS_MICROBIT = [
    "temperature",
    "light",
]
EXPECTED_INPUT_TEMP_MICROBIT = "temperature"

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

STATE_FIELD = "state"

UTF_FORMAT = "utf-8"

WINDOWS_OS = "win32"

DEFAULT_PORT = "5577"

CPX = "CPX"

MICROBIT = "micro:bit"
