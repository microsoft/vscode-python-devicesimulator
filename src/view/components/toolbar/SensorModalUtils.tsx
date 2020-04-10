// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import { SENSOR_LIST } from "../../constants";
import { ARROW_RIGHT_SVG } from "../../svgs/arrow_right_svg";
import { TAG_INPUT_SVG } from "../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../svgs/tag_output_svg";
import * as CLUE_MODAL from "./clue/ClueModalContent";
import LightSensorBar from "./LightSensorBar";
import * as MICROBIT_MODAL from "./microbit/MicrobitModalContent";
import MotionSensorBar from "./motion/MotionSensorBar";
import TemperatureSensorBar from "./TemperatureSensorBar";

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
    TEMPERATURE: "toolbar-temperature-sensor",
    LIGHT: "toolbar-light-sensor",
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

export const GPIO_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-gpio.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-gpio.description",
        tryItDescription: "toolbar-gpio.tryItDescription",
        components: undefined,
        id: "GPIO",
    };
};

export const IR_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-ir-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-ir-sensor.description",
        tryItDescription: "toolbar-ir-sensor.tryItDescription",
        components: [TRY_IT_MAKE_CODE, FEATURE_REQUEST_ON_GITHUB],
        id: "IR",
    };
};
export const LIGHT_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-light-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-light-sensor.description",
        tryItDescription: "toolbar-light-sensor.tryItDescription",
        components: [
            <LightSensorBar
                onUpdateValue={onUpdateValue}
                value={sensorValues[SENSOR_LIST.LIGHT]}
            />,
        ],
        id: "light_sensor",
    };
};
export const MOTION_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const motionSensorValues = {
        X: sensorValues[SENSOR_LIST.MOTION_X],
        Y: sensorValues[SENSOR_LIST.MOTION_Y],
        Z: sensorValues[SENSOR_LIST.MOTION_Z],
    };
    return {
        descriptionTitle: "toolbar-motion-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-motion-sensor.description",
        tryItDescription: "toolbar-motion-sensor.tryItDescription",
        components: [
            <MotionSensorBar
                onUpdateValue={onUpdateValue}
                axisValues={motionSensorValues}
            />,
            TRY_IT_MAKE_CODE,
            FEATURE_REQUEST_ON_GITHUB,
        ],
        id: "motion_sensor",
    };
};
export const NEOP_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-neo-pixels.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-neo-pixels.description",
        tryItDescription: "toolbar-neo-pixels.tryItDescription",
        components: undefined,
        id: "neon_pixel",
    };
};
export const PUSHB_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-a-b-push.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-a-b-push.description",
        tryItDescription: "toolbar-a-b-push.tryItDescription",
        components: undefined,
        id: "push_btn",
    };
};
export const RED_LED_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-red-led.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-red-led.description",
        tryItDescription: "toolbar-red-led.tryItDescription",
        components: undefined,
        id: "red_LED",
    };
};
export const SOUND_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-sound-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-sound-sensor.description",
        tryItDescription: "toolbar-sound-sensor.tryItDescription",
        components: [TRY_IT_MAKE_CODE, FEATURE_REQUEST_ON_GITHUB],
        id: "sound_sensor",
    };
};
export const SWITCH_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-slider-switch.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-slider-switch.description",
        tryItDescription: "toolbar-slider-switch.tryItDescription",
        components: undefined,
        id: "slider_switch",
    };
};
export const SPEAKER_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-speaker.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-speaker.description",
        tryItDescription: "toolbar-speaker.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "speaker",
    };
};
export const TEMPERATURE_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        components: [
            <TemperatureSensorBar
                onUpdateSensor={onUpdateValue}
                value={sensorValues[SENSOR_LIST.TEMPERATURE]}
            />,
        ],
        descriptionText: "toolbar-temperature-sensor.description",
        descriptionTitle: "toolbar-temperature-sensor.title",
        id: "temperature",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-temperature-sensor.tryItDescription",
    };
};

export const LABEL_TO_MODAL_CONTENT_CONSTRUCTOR = new Map([
    [CPX_TOOLBAR_ICON_ID.GPIO, GPIO_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.IR, IR_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.LIGHT, LIGHT_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.MOTION, MOTION_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.NEO_PIXEL, NEOP_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.PUSH_BUTTON, PUSHB_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.RED_LED, RED_LED_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.SOUND, SOUND_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.SPEAKER, SPEAKER_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.SWITCH, SWITCH_MODAL_CONTENT],
    [CPX_TOOLBAR_ICON_ID.TEMPERATURE, TEMPERATURE_MODAL_CONTENT],
    [
        MICROBIT_TOOLBAR_ICON_ID.ACCELEROMETER,
        MICROBIT_MODAL.ACCELEROMETER_CONTENT,
    ],
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
