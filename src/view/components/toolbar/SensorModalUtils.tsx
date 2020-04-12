// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import { SENSOR_LIST } from "../../constants";
import { ARROW_RIGHT_SVG } from "../../svgs/arrow_right_svg";
import * as CPX_MODAL from "./cpx/CpxModalContent"
import * as CLUE_MODAL from "./clue/ClueModalContent";
import * as MICROBIT_MODAL from "./microbit/MicrobitModalContent";


export const TRY_IT_MAKE_CODE = (
    <div className="link-parent">
        <a href="https://makecode.adafruit.com/" className="link">
            Try it on MakeCode {ARROW_RIGHT_SVG}
        </a>
    </div>
);

export const FEATURE_REQUEST_ON_GITHUB = (
    <div className="link-parent">
        <a
            href="https://github.com/microsoft/vscode-python-devicesimulator/issues/268"
            className="link"
        >
            Upvote feature requests on GitHub {ARROW_RIGHT_SVG}
        </a>
    </div>
);

export const TOOLBAR_ICON_LABEL = {
    GPIO: "GPIO",
    IR: "IR",
    LEFT_EDGE: "left-edge",
    LIGHT: "Light sensor",
    MOTION: "Motion Sensor",
    NEO_PIXEL: "Neo Pixels",
    PUSH_BUTTON: "Push Button",
    RED_LED: "Red LED",
    RIGHT_EDGE: "right-edge",
    SOUND: "Sound Sensor",
    SPEAKER: "Speaker",
    SWITCH: "Switch",
    TAG_INPUT: "Tag Input",
    TAG_OUTPUT: "Tag Output",
    TEMPERATURE: "Temperature Sensor",
    WIRELESS: "Bluetooth and Radio",
};
export const CPX_TOOLBAR_ICON_ID = {
    GPIO: "toolbar-gpio",
    IR: "toolbar-ir-sensor",
    LEFT_EDGE: "left-edge",
    LIGHT: "toolbar-light-sensor",
    MOTION: "toolbar-motion-sensor",
    NEO_PIXEL: "toolbar-neo-pixels",
    PUSH_BUTTON: "toolbar-a-b-push",
    RED_LED: "toolbar-red-led",
    RIGHT_EDGE: "right-edge",
    SOUND: "toolbar-sound-sensor",
    SPEAKER: "toolbar-speaker",
    SWITCH: "toolbar-slider-switch",
    TEMPERATURE: "toolbar-temperature-sensor",
};

export const MICROBIT_TOOLBAR_ICON_ID = {
    TEMPERATURE: "toolbar-microbit-temperature-sensor",
    LIGHT: "toolbar-microbit-light-sensor",
    ACCELEROMETER: "toolbar-accelerometer-sensor",
    LEDS: "toolbar-microbit-led",
    PUSH_BUTTON: "toolbar-microbit-a-b-push",
    GPIO: "toolbar-gpio",
    SOUND: "toolbar-microbit-sound",
    WIRELESS: "toolbar-microbit-wireless",
    GESTURE: "toolbar-microbit-gesture-sensor",
    COMPASS: "toolbar-microbit-compass-sensor",
};

export const CLUE_TOOLBAR_ICON_ID = {
    TEMPERATURE: "toolbar-clue-temperature-sensor",
    LIGHT: "toolbar-clue-light-sensor",
    ACCELEROMETER: "toolbar-clue-accelerometer-sensor",
    LEDS: "toolbar-clue-led",
    PUSH_BUTTON: "toolbar-clue-a-b-push",
    GPIO: "toolbar-clue-gpio",
    SPEAKER: "toolbar-speaker",
    SOUND: "toolbar-clue-sound-sensor",
    PRESSURE: "toolbar-clue-pressure-sensor",
    HUMIDITY: "toolbar-clue-humidity-sensor",
    GESTURE: "toolbar-clue-gesture-sensor",
    PROXIMITY: "toolbar-clue-proximity-sensor",
    BLUETOOTH: "toolbar-clue-bluetooth",
    MAGNETOSCOPE: "toolbar-clue-magnet-sensor",
    GYROSCOPE: "toolbar-clue-gyroscope-sensor",
};

export interface IModalContent {
    components: any;
    descriptionText: string;
    descriptionTitle: string;
    id: string;
    tagInput: any;
    tagOutput: any;
    tryItDescription: string;
}

export const DEFAULT_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "default",
    tagInput: undefined,
    tagOutput: undefined,
    descriptionText: "none",
    tryItDescription: "none",
    components: undefined,
    id: "none",
};



export const LABEL_TO_MODAL_CONTENT_CONSTRUCTOR = new Map([
    [CPX_TOOLBAR_ICON_ID.GPIO, CPX_MODAL.GPIO_CONTENT],
    [CPX_TOOLBAR_ICON_ID.IR, CPX_MODAL.IR_CONTENT],
    [CPX_TOOLBAR_ICON_ID.LIGHT, CPX_MODAL.LIGHT_CONTENT],
    [CPX_TOOLBAR_ICON_ID.MOTION, CPX_MODAL.MOTION_CONTENT],
    [CPX_TOOLBAR_ICON_ID.NEO_PIXEL, CPX_MODAL.NEOP_CONTENT],
    [CPX_TOOLBAR_ICON_ID.PUSH_BUTTON, CPX_MODAL.PUSHB_CONTENT],
    [CPX_TOOLBAR_ICON_ID.RED_LED, CPX_MODAL.RED_LED_CONTENT],
    [CPX_TOOLBAR_ICON_ID.SOUND, CPX_MODAL.SOUND_CONTENT],
    [CPX_TOOLBAR_ICON_ID.SPEAKER, CPX_MODAL.SPEAKER_CONTENT],
    [CPX_TOOLBAR_ICON_ID.SWITCH, CPX_MODAL.SWITCH_CONTENT],
    [CPX_TOOLBAR_ICON_ID.TEMPERATURE, CPX_MODAL.TEMPERATURE_CONTENT],
    [
        MICROBIT_TOOLBAR_ICON_ID.ACCELEROMETER,
        MICROBIT_MODAL.ACCELEROMETER_CONTENT,
    ],
    [MICROBIT_TOOLBAR_ICON_ID.TEMPERATURE, MICROBIT_MODAL.TEMPERATURE_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.LIGHT, MICROBIT_MODAL.LIGHT_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.COMPASS, MICROBIT_MODAL.COMPASS_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.LEDS, MICROBIT_MODAL.LED_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.PUSH_BUTTON, MICROBIT_MODAL.BUTTON_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.GPIO, MICROBIT_MODAL.GPIO_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.SOUND, MICROBIT_MODAL.SOUND_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.WIRELESS, MICROBIT_MODAL.WIRELESS_CONTENT],
    [MICROBIT_TOOLBAR_ICON_ID.COMPASS, MICROBIT_MODAL.COMPASS_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.TEMPERATURE, CLUE_MODAL.TEMPERATURE_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.ACCELEROMETER, CLUE_MODAL.ACCELEROMETER_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.PUSH_BUTTON, CLUE_MODAL.BUTTON_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.GPIO, CLUE_MODAL.GPIO_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.LIGHT, CLUE_MODAL.LIGHT_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.LEDS, CLUE_MODAL.LED_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.SOUND, CLUE_MODAL.SOUND_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.PRESSURE, CLUE_MODAL.PRESSURE_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.HUMIDITY, CLUE_MODAL.HUMIDITY_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.PROXIMITY, CLUE_MODAL.PROXIMITY_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.BLUETOOTH, CLUE_MODAL.BLUETOOTH_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.ACCELEROMETER, CLUE_MODAL.ACCELEROMETER_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.SPEAKER, CLUE_MODAL.SPEAKER_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.GYROSCOPE, CLUE_MODAL.GYROSCOPE_CONTENT],
    [CLUE_TOOLBAR_ICON_ID.MAGNETOSCOPE, CLUE_MODAL.MAGNETOSCOPE_CONTENT],
]);

export const getModalContent = (
    label: string,
    onUpdateValue: (onUpdateValue: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number },
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    sendGesture?: (isActive: boolean) => void
) => {
    if (label === CLUE_TOOLBAR_ICON_ID.GESTURE) {
        return CLUE_MODAL.GESTURE_CONTENT(onSelectGestures, sendGesture);
    } else if (label === MICROBIT_TOOLBAR_ICON_ID.GESTURE) {
        return MICROBIT_MODAL.GESTURE_CONTENT(onSelectGestures, sendGesture);
    }
    const modalContentConstructor = LABEL_TO_MODAL_CONTENT_CONSTRUCTOR.get(
        label
    );
    if (modalContentConstructor) {
        return modalContentConstructor(onUpdateValue, sensorValues);
    } else {
        return;
    }
};
