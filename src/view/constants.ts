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
    NO_FILES_AVAILABLE: "Choose a .py file to run on the Simulator",
    SIMULATOR_BUTTON_WIDTH: 60,
    TOOLBAR_INFO: `Explore what's on the board:`,
};
export enum DEVICE_LIST_KEY {
    CPX = "CPX",
    MICROBIT = "micro:bit",
}

export default CONSTANTS;
