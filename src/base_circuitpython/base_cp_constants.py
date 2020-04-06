class CLUE_STATE:
    BUTTON_A = "button_a"
    BUTTON_B = "button_b"
    PRESSED_BUTTONS = "pressed_buttons"
    SEA_LEVEL_PRESSURE = "sea_level_pressure"
    TEMPERATURE = "temperature"
    PROXIMITY = "proximity"
    GESTURE = "gesture"
    HUMIDITY = "humidity"
    PRESSURE = "pressure"
    PIXEL = "pixel"
    # Accelerometer
    MOTION_X = "motion_x"
    MOTION_Y = "motion_y"
    MOTION_Z = "motion_z"
    # Light/color sensor
    LIGHT_R = "light_r"
    LIGHT_G = "light_g"
    LIGHT_B = "light_b"
    LIGHT_C = "light_c"
    # Magnetometer
    MAGNET_X = "magnet_x"
    MAGNET_Y = "magnet_y"
    MAGNET_Z = "magnet_z"
    # Gyroscope
    GYRO_X = "gyro_x"
    GYRO_Y = "gyro_y"
    GYRO_Z = "gyro_z"


CPX = "CPX"
CLUE = "CLUE"
PIXELS = "pixels"
SHAKE = "shake"

CLUE_PIN = "D18"

CLUE = "CLUE"
BASE_64 = "display_base64"
IMG_DIR_NAME = "img"
SCREEN_HEIGHT_WIDTH = 240

EXPECTED_INPUT_BUTTONS = set([CLUE_STATE.BUTTON_A, CLUE_STATE.BUTTON_B])

ALL_EXPECTED_INPUT_EVENTS = set(
    [
        CLUE_STATE.TEMPERATURE,
        CLUE_STATE.LIGHT_R,
        CLUE_STATE.LIGHT_G,
        CLUE_STATE.LIGHT_B,
        CLUE_STATE.LIGHT_C,
        CLUE_STATE.MOTION_X,
        CLUE_STATE.MOTION_Y,
        CLUE_STATE.MOTION_Z,
        CLUE_STATE.HUMIDITY,
        CLUE_STATE.PRESSURE,
        CLUE_STATE.PROXIMITY,
        CLUE_STATE.GESTURE,
        CLUE_STATE.GYRO_X,
        CLUE_STATE.GYRO_Y,
        CLUE_STATE.GYRO_Z,
        CLUE_STATE.MAGNET_X,
        CLUE_STATE.MAGNET_Y,
        CLUE_STATE.MAGNET_Z,
    ]
)

BMP_IMG = "BMP"

BMP_IMG_ENDING = ".bmp"

NO_VALID_IMGS_ERR = "No valid images"

BLINKA_BMP = "blinka.bmp"
CLUE_TERMINAL_LINE_HEIGHT = 16
CLUE_TERMINAL_LINE_NUM_MAX = 15
CLUE_TERMINAL_X_OFFSET = 15
CLUE_TERMINAL_Y_OFFSET = 5
CLUE_TERMINAL_LINE_BREAK_AMT = 37
