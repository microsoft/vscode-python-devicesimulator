import * as React from "react";
import { IModalContent, FEATURE_REQUEST_ON_GITHUB } from "../SensorModalUtils";
import { SENSOR_LIST } from "../../../constants";
import { TAG_INPUT_SVG } from "../../../svgs/tag_input_svg";
import TemperatureSensorBar from "../TemperatureSensorBar";
import { TAG_OUTPUT_SVG } from "../../../svgs/tag_output_svg";
import { Accelerometer } from "../motion/Accelerometer";
import LightSensorBar from "../LightSensorBar";

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
export const ACCELEROMETER_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number },
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    sendGesture?: (isActive: boolean) => void
): IModalContent => {
    const accelerometerSensorValues = {
        X_AXIS: sensorValues[SENSOR_LIST.MOTION_X],
        Y_AXIS: sensorValues[SENSOR_LIST.MOTION_Y],
        Z_AXIS: sensorValues[SENSOR_LIST.MOTION_Z],
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
export const MICROBIT_BUTTON_CONTENT = (
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
export const MICROBIT_SOUND_MODAL_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-sound.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-microbit-sound.description",
        tryItDescription: "toolbar-microbit-sound.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "microbit_sound",
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
export const MICROBIT_LED_CONTENT = (
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
