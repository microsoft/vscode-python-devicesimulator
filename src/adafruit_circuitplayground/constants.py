# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

ASSIGN_PIXEL_TYPE_ERROR = (
    "The pixel color value type should be tuple, list or hexadecimal."
)

BRIGHTNESS_RANGE_ERROR = "The brightness value should be a number between 0 and 1."

CPX = "CPX"

INDEX_ERROR = (
    "The index is not a valid number, you can access the Neopixels from 0 to 9."
)

MAC_OS = "darwin"

NOT_IMPLEMENTED_ERROR = "This method is not implemented by the simulator"

NOT_SUITABLE_FILE_ERROR = (
    "Your .wav file is not suitable for the Circuit Playground Express."
)

PIXEL_RANGE_ERROR = (
    "The pixel hexadicimal color value should be in range #000000 and #FFFFFF."
)

VALID_PIXEL_ASSIGN_ERROR = "The pixel color value should be a tuple with three values between 0 and 255 or a hexadecimal color between 0x000000 and 0xFFFFFF."

TELEMETRY_EVENT_NAMES = {
    "CPX_API_ACCELERATION_USED": "CPX.API.ACCELERATION.USED",
    "CPX_API_ACCELERATION_TOTAL": "CPX.API.ACCELERATION.TOTAL",
    "CPX_API_BUTTON_A": "CPX.API.BUTTON.A",
    "CPX_API_BUTTON_B": "CPX.API.BUTTON.B",
    "CPX_API_SWITCH": "CPX.API.SWITCH",
    "CPX_API_TEMPERATURE": "CPX.API.TEMPERATURE",
    "CPX_API_BRIGHTNESS": "CPX.API.BRIGHTNESS",
    "CPX_API_LIGHT": "CPX.API.LIGHT",
    "CPX_API_TOUCH": "CPX.API.TOUCH",
    "CPX_API_SHAKE": "CPX.API.SHAKE",
    "CPX_API_TAPPED": "CPX.API.TAPPED",
    "CPX_API_PLAY_FILE": "CPX.API.PLAY.FILE",
    "CPX_API_PLAY_TONE": "CPX.API.PLAY.TONE",
    "CPX_API_START_TONE": "CPX.API.START.TONE",
    "CPX_API_STOP_TONE": "CPX.API.STOP.TONE",
    "CPX_API_DETECT_TAPS": "CPX.API.DETECT.TAPS",
    "CPX_API_ADJUST_THRESHOLD": "CPX.API.ADJUST.THRESHOLD",
    "CPX_API_RED_LED": "CPX.API.RED.LED",
    "CPX_API_PIXELS": "CPX.API.PIXELS",
}

ERROR_SENDING_EVENT = "Error trying to send event to the process : "

TIME_DELAY = 0.03

DEFAULT_PORT = "5577"


EVENTS_BUTTON_PRESS = ["button_a", "button_b", "switch"]
EVENTS_SENSOR_CHANGED = ["temperature", "light", "motion_x", "motion_y", "motion_z"]

ALL_EXPECTED_INPUT_EVENTS = [
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
