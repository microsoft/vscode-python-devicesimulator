import * as React from "react";
import { SENSOR_LIST } from "../../../constants";
import { IModalContent, FEATURE_REQUEST_ON_GITHUB, TRY_IT_MAKE_CODE } from "../SensorModalUtils";
import { TAG_INPUT_SVG } from "../../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../../svgs/tag_output_svg";
import { GenericSliderComponent } from "../GenericSliderComponent";
import * as SENSOR_PROPERTIES from './CpxSensorProperties'

export const GPIO_CONTENT = (
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

export const IR_CONTENT = (
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
export const LIGHT_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const lightSensorValues = {
        L: sensorValues[SENSOR_LIST.LIGHT]
    }
    return {
        descriptionTitle: "toolbar-light-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-light-sensor.description",
        tryItDescription: "toolbar-light-sensor.tryItDescription",
        components: [
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisProperties={SENSOR_PROPERTIES.LIGHT_SENSOR_PROPERTIES}
                axisValues={lightSensorValues}
            />,
        ],
        id: "light_sensor",
    };
};
export const MOTION_CONTENT = (
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
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisProperties={SENSOR_PROPERTIES.MOTION_SENSOR_PROPERTIES}
                axisValues={motionSensorValues}
            />,
            TRY_IT_MAKE_CODE,
            FEATURE_REQUEST_ON_GITHUB,
        ],
        id: "motion_sensor",
    };
};
export const NEOP_CONTENT = (
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
export const PUSHB_CONTENT = (
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
export const RED_LED_CONTENT = (
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
export const SOUND_CONTENT = (
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
export const SWITCH_CONTENT = (
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
export const SPEAKER_CONTENT = (
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
export const TEMPERATURE_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const temperatureSensorValues = {
        T: sensorValues[SENSOR_LIST.TEMPERATURE]
    }
    return {
        components: [
            <GenericSliderComponent
                axisProperties={SENSOR_PROPERTIES.TEMPERATURE_SENSOR_PROPERTIES}
                onUpdateValue={onUpdateValue}
                axisValues={temperatureSensorValues}
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