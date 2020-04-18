# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.


class EXPRESS_STATE:
    BUTTON_A = "button_a"
    BUTTON_B = "button_b"
    ACCELERATION = "acceleration"
    BRIGHTNESS = "brightness"
    PIXELS = "pixels"
    RED_LED = "red_led"
    SWITCH = "switch"
    TEMPERATURE = "temperature"
    LIGHT = "light"
    MOTION_X = "motion_x"
    MOTION_Y = "motion_y"
    MOTION_Z = "motion_z"
    TOUCH = "touch"
    SHAKE = "shake"
    DETECT_TAPS = "detect_taps"


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

ERROR_SENDING_EVENT = "Error trying to send event to the process : "

TIME_DELAY = 0.03


EVENTS_BUTTON_PRESS = [
    EXPRESS_STATE.BUTTON_A,
    EXPRESS_STATE.BUTTON_B,
    EXPRESS_STATE.SWITCH,
]
EVENTS_SENSOR_CHANGED = [
    EXPRESS_STATE.TEMPERATURE,
    EXPRESS_STATE.LIGHT,
    EXPRESS_STATE.MOTION_X,
    EXPRESS_STATE.MOTION_Y,
    EXPRESS_STATE.MOTION_Z,
]

ALL_EXPECTED_INPUT_EVENTS = [
    EXPRESS_STATE.BUTTON_A,
    EXPRESS_STATE.BUTTON_B,
    EXPRESS_STATE.SWITCH,
    EXPRESS_STATE.TEMPERATURE,
    EXPRESS_STATE.LIGHT,
    EXPRESS_STATE.SHAKE,
    EXPRESS_STATE.MOTION_X,
    EXPRESS_STATE.MOTION_Y,
    EXPRESS_STATE.MOTION_Z,
    EXPRESS_STATE.TOUCH,
]
