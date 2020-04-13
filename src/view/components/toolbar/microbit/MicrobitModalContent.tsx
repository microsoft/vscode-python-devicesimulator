import * as React from "react";
import { GESTURES_MICROBIT, SENSOR_LIST } from "../../../constants";
import { TAG_INPUT_SVG } from "../../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../../svgs/tag_output_svg";
import { GenericSliderComponent } from "../GenericSliderComponent";
import { Gesture } from "../Gesture";
import { FEATURE_REQUEST_ON_GITHUB, IModalContent } from "../SensorModalUtils";
import * as SENSOR_PROPERTIES from "./MicrobitSensorProperties";

export const ACCELEROMETER_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    // this object will be accessed with the axis label
    const accelerometerSensorValues = {
        X: sensorValues[SENSOR_LIST.MOTION_X],
        Y: sensorValues[SENSOR_LIST.MOTION_Y],
        Z: sensorValues[SENSOR_LIST.MOTION_Z],
    };
    return {
        components: (
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={accelerometerSensorValues}
                axisProperties={SENSOR_PROPERTIES.MOTION_SENSOR_PROPERTIES}
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
export const LED_CONTENT = (
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

export const BUTTON_CONTENT = (
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
export const SOUND_CONTENT = (
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
export const GPIO_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-gpio.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-microbit-gpio.description",
        tryItDescription: "toolbar-microbit-gpio.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "microbit_gpio",
    };
};
export const COMPASS_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-compass-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-microbit-compass-sensor.description",
        tryItDescription: "toolbar-microbit-compass-sensor.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "microbit_compass",
    };
};
export const WIRELESS_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-wireless.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-microbit-wireless.description",
        tryItDescription: "toolbar-microbit-wireless.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "microbit_wireless",
    };
};
export const GESTURE_CONTENT = (
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    sendGesture?: (isActive: boolean) => void
): IModalContent => {
    return {
        descriptionTitle: "toolbar-microbit-gesture-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-microbit-gesture-sensor.description",
        tryItDescription: "toolbar-microbit-gesture-sensor.tryItDescription",
        components: [
            <Gesture
                gestures={GESTURES_MICROBIT}
                onSelectGestures={onSelectGestures}
                onSendGesture={sendGesture}
            />,
        ],
        id: "gesture_sensor",
    };
};
export const LIGHT_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const lightSensorValues = {
        L: sensorValues[SENSOR_LIST.LIGHT],
    };
    return {
        descriptionTitle: "toolbar-light-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-light-sensor.description",
        tryItDescription: "toolbar-light-sensor.tryItDescription",
        components: [
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={lightSensorValues}
                axisProperties={SENSOR_PROPERTIES.LIGHT_SENSOR_PROPERTIES}
            />,
        ],
        id: "light_sensor",
    };
};

export const TEMPERATURE_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const temperatureSensorValues = {
        T: sensorValues[SENSOR_LIST.TEMPERATURE],
    };
    return {
        components: [
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={temperatureSensorValues}
                axisProperties={SENSOR_PROPERTIES.TEMPERATURE_SENSOR_PROPERTIES}
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
