MICROBIT = "micro:bit"

# string arguments for constructor
BLANK_5X5 = "00000:00000:00000:00000:00000:"

# pre-defined image patterns
IMAGE_PATTERNS = {
    "HEART": "09090:99999:99999:09990:00900:",
    "HEART_SMALL": "00000:09090:09990:00900:00000:",
    "HAPPY": "00000:09090:00000:90009:09990:",
    "SMILE": "00000:00000:00000:90009:09990:",
    "SAD": "00000:09090:00000:09990:90009:",
    "CONFUSED": "00000:09090:00000:09090:90909:",
    "ANGRY": "90009:09090:00000:99999:90909:",
    "ASLEEP": "00000:99099:00000:09990:00000:",
    "SURPRISED": "09090:00000:00900:09090:00900:",
    "SILLY": "90009:00000:99999:00909:00999:",
    "FABULOUS": "99999:99099:00000:09090:09990:",
    "MEH": "09090:00000:00090:00900:09000:",
    "YES": "00000:00009:00090:90900:09000:",
    "NO": "90009:09090:00900:09090:90009:",
    "CLOCK12": "00900:00900:00900:00000:00000:",
    "CLOCK11": "09000:09000:00900:00000:00000:",
    "CLOCK10": "00000:99000:00900:00000:00000:",
    "CLOCK9": "00000:00000:99900:00000:00000:",
    "CLOCK8": "00000:00000:00900:99000:00000:",
    "CLOCK7": "00000:00000:00900:09000:09000:",
    "CLOCK6": "00000:00000:00900:00900:00900:",
    "CLOCK5": "00000:00000:00900:00090:00090:",
    "CLOCK4": "00000:00000:00900:00099:00000:",
    "CLOCK3": "00000:00000:00999:00000:00000:",
    "CLOCK2": "00000:00099:00900:00000:00000:",
    "CLOCK1": "00090:00090:00900:00000:00000:",
    "ARROW_N": "00900:09990:90909:00900:00900:",
    "ARROW_NE": "00999:00099:00909:09000:90000:",
    "ARROW_E": "00900:00090:99999:00090:00900:",
    "ARROW_SE": "90000:09000:00909:00099:00999:",
    "ARROW_S": "00900:00900:90909:09990:00900:",
    "ARROW_SW": "00009:00090:90900:99000:99900:",
    "ARROW_W": "00900:09000:99999:09000:00900:",
    "ARROW_NW": "99900:99000:90900:00090:00009:",
    "TRIANGLE": "00000:00900:09090:99999:00000:",
    "TRIANGLE_LEFT": "90000:99000:90900:90090:99999:",
    "CHESSBOARD": "09090:90909:09090:90909:09090:",
    "DIAMOND": "00900:09090:90009:09090:00900:",
    "DIAMOND_SMALL": "00000:00900:09090:00900:00000:",
    "SQUARE": "99999:90009:90009:90009:99999:",
    "SQUARE_SMALL": "00000:09990:09090:09990:00000:",
    "RABBIT": "90900:90900:99990:99090:99990:",
    "COW": "90009:90009:99999:09990:00900:",
    "MUSIC_CROTCHET": "00900:00900:00900:99900:99900:",
    "MUSIC_QUAVER": "00900:00990:00909:99900:99900:",
    "MUSIC_QUAVERS": "09999:09009:09009:99099:99099:",
    "PITCHFORK": "90909:90909:99999:00900:00900:",
    "XMAS": "00900:09990:00900:09990:99999:",
    "PACMAN": "09999:99090:99900:99990:09999:",
    "TARGET": "00900:09990:99099:09990:00900:",
    "TSHIRT": "99099:99999:09990:09990:09990:",
    "ROLLERSKATE": "00099:00099:99999:99999:09090:",
    "DUCK": "09900:99900:09999:09990:00000:",
    "HOUSE": "00900:09990:99999:09990:09090:",
    "TORTOISE": "00000:09990:99999:09090:00000:",
    "BUTTERFLY": "99099:99999:00900:99999:99099:",
    "STICKFIGURE": "00900:99999:00900:09090:90009:",
    "GHOST": "99999:90909:99999:99999:90909:",
    "SWORD": "00900:00900:00900:09990:00900:",
    "GIRAFFE": "99000:09000:09000:09990:09090:",
    "SKULL": "09990:90909:99999:09990:09990:",
    "UMBRELLA": "09990:99999:00900:90900:09900:",
    "SNAKE": "99000:99099:09090:09990:00000:",
}

IMAGE_TUPLE_LOOKUP = {
    "ALL_CLOCKS": [
        "CLOCK12",
        "CLOCK11",
        "CLOCK10",
        "CLOCK9",
        "CLOCK8",
        "CLOCK7",
        "CLOCK6",
        "CLOCK5",
        "CLOCK4",
        "CLOCK3",
        "CLOCK2",
        "CLOCK1",
    ],
    "ALL_ARROWS": [
        "ARROW_N",
        "ARROW_NE",
        "ARROW_E",
        "ARROW_SE",
        "ARROW_S",
        "ARROW_SW",
        "ARROW_W",
        "ARROW_NW",
    ],
}

# 5x5 Alphabet
# Taken from https://raw.githubusercontent.com/micropython/micropython/264d80c84e034541bd6e4b461bfece4443ffd0ac/ports/nrf/boards/microbit/modules/microbitfont.h
ALPHABET = b"\x00\x00\x00\x00\x00\x08\x08\x08\x00\x08\x0a\x4a\x40\x00\x00\x0a\x5f\xea\x5f\xea\x0e\xd9\x2e\xd3\x6e\x19\x32\x44\x89\x33\x0c\x92\x4c\x92\x4d\x08\x08\x00\x00\x00\x04\x88\x08\x08\x04\x08\x04\x84\x84\x88\x00\x0a\x44\x8a\x40\x00\x04\x8e\xc4\x80\x00\x00\x00\x04\x88\x00\x00\x0e\xc0\x00\x00\x00\x00\x08\x00\x01\x22\x44\x88\x10\x0c\x92\x52\x52\x4c\x04\x8c\x84\x84\x8e\x1c\x82\x4c\x90\x1e\x1e\xc2\x44\x92\x4c\x06\xca\x52\x5f\xe2\x1f\xf0\x1e\xc1\x3e\x02\x44\x8e\xd1\x2e\x1f\xe2\x44\x88\x10\x0e\xd1\x2e\xd1\x2e\x0e\xd1\x2e\xc4\x88\x00\x08\x00\x08\x00\x00\x04\x80\x04\x88\x02\x44\x88\x04\x82\x00\x0e\xc0\x0e\xc0\x08\x04\x82\x44\x88\x0e\xd1\x26\xc0\x04\x0e\xd1\x35\xb3\x6c\x0c\x92\x5e\xd2\x52\x1c\x92\x5c\x92\x5c\x0e\xd0\x10\x10\x0e\x1c\x92\x52\x52\x5c\x1e\xd0\x1c\x90\x1e\x1e\xd0\x1c\x90\x10\x0e\xd0\x13\x71\x2e\x12\x52\x5e\xd2\x52\x1c\x88\x08\x08\x1c\x1f\xe2\x42\x52\x4c\x12\x54\x98\x14\x92\x10\x10\x10\x10\x1e\x11\x3b\x75\xb1\x31\x11\x39\x35\xb3\x71\x0c\x92\x52\x52\x4c\x1c\x92\x5c\x90\x10\x0c\x92\x52\x4c\x86\x1c\x92\x5c\x92\x51\x0e\xd0\x0c\x82\x5c\x1f\xe4\x84\x84\x84\x12\x52\x52\x52\x4c\x11\x31\x31\x2a\x44\x11\x31\x35\xbb\x71\x12\x52\x4c\x92\x52\x11\x2a\x44\x84\x84\x1e\xc4\x88\x10\x1e\x0e\xc8\x08\x08\x0e\x10\x08\x04\x82\x41\x0e\xc2\x42\x42\x4e\x04\x8a\x40\x00\x00\x00\x00\x00\x00\x1f\x08\x04\x80\x00\x00\x00\x0e\xd2\x52\x4f\x10\x10\x1c\x92\x5c\x00\x0e\xd0\x10\x0e\x02\x42\x4e\xd2\x4e\x0c\x92\x5c\x90\x0e\x06\xc8\x1c\x88\x08\x0e\xd2\x4e\xc2\x4c\x10\x10\x1c\x92\x52\x08\x00\x08\x08\x08\x02\x40\x02\x42\x4c\x10\x14\x98\x14\x92\x08\x08\x08\x08\x06\x00\x1b\x75\xb1\x31\x00\x1c\x92\x52\x52\x00\x0c\x92\x52\x4c\x00\x1c\x92\x5c\x90\x00\x0e\xd2\x4e\xc2\x00\x0e\xd0\x10\x10\x00\x06\xc8\x04\x98\x08\x08\x0e\xc8\x07\x00\x12\x52\x52\x4f\x00\x11\x31\x2a\x44\x00\x11\x31\x35\xbb\x00\x12\x4c\x8c\x92\x00\x11\x2a\x44\x98\x00\x1e\xc4\x88\x1e\x06\xc4\x8c\x84\x86\x08\x08\x08\x08\x08\x18\x08\x0c\x88\x18\x00\x00\x0c\x83\x60"
# We support ASCII characters between these indexes on the microbit
ASCII_START = 32
ASCII_END = 126
SPACE_BETWEEN_LETTERS_WIDTH = 1
WHITESPACE_WIDTH = 3

# numerical LED values
LED_HEIGHT = 5
LED_WIDTH = 5
BRIGHTNESS_MIN = 0
BRIGHTNESS_MAX = 9

# sensor max/min values
MAX_TEMPERATURE = 125
MIN_TEMPERATURE = -55
MAX_LIGHT_LEVEL = 255
MIN_LIGHT_LEVEL = 0
MAX_ACCELERATION = 1023
MIN_ACCELERATION = -1023

GESTURES = set(
    [
        "up",
        "down",
        "left",
        "right",
        "face up",
        "face down",
        "freefall",
        "3g",
        "6g",
        "8g",
        "shake",
    ]
)

# error messages
BRIGHTNESS_ERR = "brightness out of bounds"
COPY_ERR_MESSAGE = "please call copy function first"
INCORR_IMAGE_SIZE = "image data is incorrect size"
INDEX_ERR = "index out of bounds"
NOT_IMPLEMENTED_ERROR = "This method is not implemented by the simulator"
UNSUPPORTED_ADD_TYPE = "unsupported types for __add__:"
SAME_SIZE_ERR = "images must be the same size"
INVALID_GESTURE_ERR = "invalid gesture"

TIME_DELAY = 0.03
