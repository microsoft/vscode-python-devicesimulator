# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

ASSIGN_PIXEL_TYPE_ERROR = "The pixel color value type should be tuple, list or hexadecimal."

BRIGHTNESS_RANGE_ERROR = "The brightness value should be a number between 0 and 1."

INDEX_ERROR = "The index is not a valid number, you can access the Neopixels from 0 to 9."

NOT_IMPLEMENTED_ERROR = "This method is not implemented by the simulator"

NOT_SUITABLE_FILE_ERROR = "Your .wav file is not suitable for the Circuit Playground Express."

PIXEL_RANGE_ERROR = "The pixel hexadicimal color value should be in range #000000 and #FFFFFF."

VALID_PIXEL_ASSIGN_ERROR = "The pixel color value should be a tuple with three values between 0 and 255 or a hexadecimal color between 0x000000 and 0xFFFFFF."


TELEMETRY_EVENT_NAMES = {
    'TAPPED': "TAPPED",
    'PLAY_FILE': "PLAY.FILE",
    'PLAY_TONE': "PLAY.TONE",
    'START_TONE': "START.TONE",
    'STOP_TONE': "STOP.TONE",
    'DETECT_TAPS': "DETECT.TAPS",
    'ADJUST_THRESHOLD': "ADJUST_THRESHOLD"
}
