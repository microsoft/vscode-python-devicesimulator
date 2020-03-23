// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.a

// Key events
export const CONSTANTS = {
    CURRENTLY_RUNNING: (file: string) => {
        return `Currently running: ${file}`;
    },
    DEVICE_NAME: {
        CPX: "CPX",
        MICROBIT: "micro:bit",
    },
    ID_NAME: {
        BUTTON_A: "BTN_A_OUTER",
        BUTTON_AB: "BTN_AB_OUTER",
        BUTTON_B: "BTN_B_OUTER",
        PIN_A1: "PIN_A1",
        PIN_A2: "PIN_A2",
        PIN_A3: "PIN_A3",
        PIN_A4: "PIN_A4",
        PIN_A5: "PIN_A5",
        PIN_A6: "PIN_A6",
        PIN_A7: "PIN_A7",
        PLAY_BUTTON: "play-button",
        REFRESH_BUTTON: "refresh-button",
        STOP_BUTTON: "stop-button",
        SWITCH: "SWITCH",
    },
    KEYBOARD_KEYS: {
        A: "KeyA",
        B: "KeyB",
        C: "KeyC",
        CAPITAL_R: "R",
        CAPITAL_F: "F",
        ENTER: "Enter",
        S: "KeyS",
        NUMERIC_ONE: "Digit1",
        NUMERIC_TWO: "Digit2",
        NUMERIC_THREE: "Digit3",
        NUMERIC_FOUR: "Digit4",
        NUMERIC_FIVE: "Digit5",
        NUMERIC_SIX: "Digit6",
        NUMERIC_SEVEN: "Digit7",
    },
    FILES_PLACEHOLDER:
        "The simulator will run the .py file you have focused on.",
    SIMULATOR_BUTTON_WIDTH: 60,
    TOOLBAR_INFO: `Explore what's on the board:`,
};
export const AB_BUTTONS_KEYS = {
    BTN_A: "BTN_A",
    BTN_B: "BTN_B",
    BTN_AB: "BTN_AB",
};
export const MICROBIT_BUTTON_STYLING_CLASSES = {
    DEFAULT: "sim-button-outer",
    KEYPRESSED: "sim-button-key-press",
};
export enum DEVICE_LIST_KEY {
    CPX = "CPX",
    MICROBIT = "micro:bit",
    CLUE = "CLUE",
}

// Pauses on Debug mode alter the state of the view
export enum VIEW_STATE {
    PAUSE = "debug-pause",
    RUNNING = "running",
}

//
export enum WEBVIEW_MESSAGES {
    SWITCH_DEVICE = "switch-device",
    REFRESH_SIMULATOR = "refresh-simulator",
    TOGGLE_PLAY_STOP = "toggle-play-stop",
    BUTTON_PRESS = "button-press",
    SENSOR_CHANGED = "sensor-changed",
    SLIDER_TELEMETRY = "slider-telemetry",
}

export enum VSCODE_MESSAGES_TO_WEBVIEW {
    SET_DEVICE = "set-device",
    PAUSE_DEVICE = "pause-device",
    RUN_DEVICE = "run-device",
    RESET = "reset-state",
    CURRENT_FILE = "current-file",
    SET_STATE = "set-state",
}
export enum DEBUG_COMMANDS {
    STACK_TRACE = "stackTrace",
    CONTINUE = "continue",
    DISCONNECT = "disconnect",
}
export enum SENSOR_LIST {
    TEMPERATURE = "temperature",
    LIGHT = "light",
    ACCELEROMETER = "accelerometer",
    MOTION_X = "motion_x",
    MOTION_Y = "motion_y",
    MOTION_Z = "motion_z",
}

export default CONSTANTS;
