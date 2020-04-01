import * as React from "react";
import { IModalContent, FEATURE_REQUEST_ON_GITHUB } from "../SensorModalUtils";
import { SENSOR_LIST } from "../../../constants";
import { TAG_INPUT_SVG } from "../../../svgs/tag_input_svg";
import TemperatureSensorBar from "../TemperatureSensorBar";
import { TAG_OUTPUT_SVG } from "../../../svgs/tag_output_svg";
import { Accelerometer } from "../motion/Accelerometer";
import LightSensorBar from "../LightSensorBar";
import { ThreeDimensionSlider } from "../motion/threeDimensionSlider/ThreeDimensionSlider";
import * as SENSOR_PROPERTIES from "./ClueSensorProperties";
export const CLUE_TEMPERATURE_MODAL_CONTENT = (
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
        descriptionText: "toolbar-clue-temperature-sensor.description",
        descriptionTitle: "toolbar-temperature-sensor.title",
        id: "temperature",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-temperature-sensor.tryItDescription",
    };
};

export const CLUE_GPIO_MODAL_CONTENT = (
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
export const CLUE_ACCELEROMETER_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number },
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    sendGesture?: (isActive: boolean) => void
): IModalContent => {
    const accelerometerSensorValues = {
        X: sensorValues[SENSOR_LIST.MOTION_X],
        Y: sensorValues[SENSOR_LIST.MOTION_Y],
        Z: sensorValues[SENSOR_LIST.MOTION_Z],
    };
    return {
        components: (
            <Accelerometer
                onUpdateValue={onUpdateValue}
                axisValues={accelerometerSensorValues}
                onSelectGestures={onSelectGestures}
                onSendGesture={sendGesture}
            />
        ),
        descriptionText: "toolbar-accelerometer-sensor.description",
        descriptionTitle: "toolbar-accelerometer-sensor.title",
        id: "accelerometer",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-accelerometer-sensor.tryItDescription",
    };
};

export const CLUE_LIGHT_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const accelerometerSensorValues = {
        R: sensorValues[SENSOR_LIST.LIGHT_R],
        G: sensorValues[SENSOR_LIST.LIGHT_G],
        B: sensorValues[SENSOR_LIST.LIGHT_B],
        C: sensorValues[SENSOR_LIST.LIGHT_C],
    };
    return {
        components: (
            <ThreeDimensionSlider
                onUpdateValue={onUpdateValue}
                axisValues={accelerometerSensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE_LIGHT_PROPERTIES}
            />
        ),
        descriptionText: "toolbar-accelerometer-sensor.description",
        descriptionTitle: "toolbar-accelerometer-sensor.title",
        id: "accelerometer",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-accelerometer-sensor.tryItDescription",
    };
};
export const CLUE_HUMIDITY_MODAL_CONTENT = (
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
export const CLUE_GESTURE_MODAL_CONTENT = (
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
export const CLUE_PROXIMITY_MODAL_CONTENT = (
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
export const CLUE_PRESSURE_MODAL_CONTENT = (
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
export const CLUE_BUTTON_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-a-b-push.title",
        tagInput: undefined,
        tagOutput: TAG_INPUT_SVG,
        descriptionText: "toolbar-microbit-a-b-push.description",
        tryItDescription: "toolbar-microbit-a-b-push.tryItDescription",
        components: undefined,
        id: "microbit_button",
    };
};

export const CLUE_BLUETOOTH_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-a-b-push.title",
        tagInput: undefined,
        tagOutput: TAG_INPUT_SVG,
        descriptionText: "toolbar-microbit-a-b-push.description",
        tryItDescription: "toolbar-microbit-a-b-push.tryItDescription",
        components: undefined,
        id: "microbit_button",
    };
};

export const CLUE_SOUND_MODAL_CONTENT = (
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
export const CLUE_LED_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-led.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-microbit-led.description",
        tryItDescription: "toolbar-microbit-led.tryItDescription",
        components: undefined,
        id: "microbit_LED",
    };
};
