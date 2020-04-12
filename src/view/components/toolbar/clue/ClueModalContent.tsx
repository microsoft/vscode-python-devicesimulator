import * as React from "react";
import { GESTURES_CLUE, SENSOR_LIST } from "../../../constants";
import { TAG_INPUT_SVG } from "../../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../../svgs/tag_output_svg";
import { GenericSliderComponent } from "../GenericSliderComponent";
import { Gesture } from "../motion/Gesture";
import { FEATURE_REQUEST_ON_GITHUB, IModalContent } from "../SensorModalUtils";
import TemperatureSensorBar from "../TemperatureSensorBar";
import * as SENSOR_PROPERTIES from "./ClueSensorProperties";

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
                onUpdateValue={onUpdateValue}
                axisValues={temperatureSensorValues}
                axisProperties={SENSOR_PROPERTIES.TEMPERATURE_SENSOR_PROPERTIES}
            />,
        ],
        descriptionText: "toolbar-clue-temperature-sensor.description",
        descriptionTitle: "toolbar-clue-temperature-sensor.title",
        id: "temperature",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-clue-temperature-sensor.tryItDescription",
    };
};

export const GPIO_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-clue-gpio.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-clue-gpio.description",
        tryItDescription: "toolbar-clue-gpio.tryItDescription",
        components: undefined,
        id: "GPIO",
    };
};

export const ACCELEROMETER_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
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
        descriptionText: "toolbar-clue-accelerometer-sensor.description",
        descriptionTitle: "toolbar-clue-accelerometer-sensor.title",
        id: "accelerometer",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-clue-accelerometer-sensor.tryItDescription",
    };
};
export const GYROSCOPE_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const gyroSensorValues = {
        X: sensorValues[SENSOR_LIST.GYRO_X],
        Y: sensorValues[SENSOR_LIST.GYRO_Y],
        Z: sensorValues[SENSOR_LIST.GYRO_Z],
    };
    return {
        components: (
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={gyroSensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE_GYRO_PROPERTIES}
            />
        ),
        descriptionText: "toolbar-clue-gyroscope-sensor.description",
        descriptionTitle: "toolbar-clue-gyroscope-sensor.title",
        id: "gyroscope",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-clue-gyroscope-sensor.tryItDescription",
    };
};
export const MAGNETOSCOPE_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const magnetSensorValues = {
        X: sensorValues[SENSOR_LIST.MAGNET_X],
        Y: sensorValues[SENSOR_LIST.MAGNET_Y],
        Z: sensorValues[SENSOR_LIST.MAGNET_Z],
    };
    return {
        components: (
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={magnetSensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE_MAGNET_PROPERTIES}
            />
        ),
        descriptionText: "toolbar-clue-magnet-sensor.description",
        descriptionTitle: "toolbar-clue-magnet-sensor.title",
        id: "magnetoscope",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-clue-magnet-sensor.tryItDescription",
    };
};

export const LIGHT_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const lightSensorValues = {
        R: sensorValues[SENSOR_LIST.LIGHT_R],
        G: sensorValues[SENSOR_LIST.LIGHT_G],
        B: sensorValues[SENSOR_LIST.LIGHT_B],
        C: sensorValues[SENSOR_LIST.LIGHT_C],
    };
    return {
        components: (
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={lightSensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE_LIGHT_PROPERTIES}
            />
        ),
        descriptionText: "toolbar-clue-light-sensor.description",
        descriptionTitle: "toolbar-clue-light-sensor.title",
        id: "light_sensor",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        tryItDescription: "toolbar-clue-light-sensor.tryItDescription",
    };
};

export const HUMIDITY_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const humiditySensorValues = {
        H: sensorValues[SENSOR_LIST.HUMIDITY],
    };
    return {
        descriptionTitle: "toolbar-clue-humidity-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-clue-humidity-sensor.description",
        tryItDescription: "toolbar-clue-humidity-sensor.tryItDescription",
        components: [
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={humiditySensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE_HUMIDITY_PROPERTIES}
            />,
        ],
        id: "humidity_sensor",
    };
};

export const GESTURE_CONTENT = (
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    sendGesture?: (isActive: boolean) => void
): IModalContent => {
    return {
        descriptionTitle: "toolbar-clue-gesture-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-clue-gesture-sensor.description",
        tryItDescription: "toolbar-clue-gesture-sensor.tryItDescription",
        components: [
            <Gesture
                gestures={GESTURES_CLUE}
                onSelectGestures={onSelectGestures}
                onSendGesture={sendGesture}
            />,
        ],
        id: "gesture_sensor",
    };
};

export const PROXIMITY_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const proximitySensorValues = {
        P: sensorValues[SENSOR_LIST.PROXIMITY],
    };
    return {
        descriptionTitle: "toolbar-clue-proximity-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-clue-proximity-sensor.description",
        tryItDescription: "toolbar-clue-proximity-sensor.tryItDescription",
        components: [
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={proximitySensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE__PROXIMITY_PROPERTIES}
            />,
        ],
        id: "proximity_sensor",
    };
};

export const PRESSURE_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    const pressureSensorValues = {
        P: sensorValues[SENSOR_LIST.PRESSURE],
    };
    return {
        descriptionTitle: "toolbar-clue-pressure-sensor.title",
        tagInput: TAG_INPUT_SVG,
        tagOutput: undefined,
        descriptionText: "toolbar-clue-pressure-sensor.description",
        tryItDescription: "toolbar-clue-pressure-sensor.tryItDescription",
        components: [
            <GenericSliderComponent
                onUpdateValue={onUpdateValue}
                axisValues={pressureSensorValues}
                axisProperties={SENSOR_PROPERTIES.CLUE_PRESSURE_PROPERTIES}
            />,
        ],
        id: "pressure_sensor",
    };
};

export const BUTTON_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-clue-a-b-push.title",
        tagInput: undefined,
        tagOutput: TAG_INPUT_SVG,
        descriptionText: "toolbar-clue-a-b-push.description",
        tryItDescription: "toolbar-clue-a-b-push.tryItDescription",
        components: undefined,
        id: "microbit_button",
    };
};

export const BLUETOOTH_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-clue-bluetooth.title",
        tagInput: undefined,
        tagOutput: TAG_INPUT_SVG,
        descriptionText: "toolbar-clue-bluetooth.description",
        tryItDescription: "toolbar-clue-bluetooth.tryItDescription",
        components: undefined,
        id: "bluetooth",
    };
};

export const SOUND_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-clue-sound-sensor.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-clue-sound-sensor.description",
        tryItDescription: "toolbar-clue-sound-sensor.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "sound_sensor",
    };
};

export const LED_CONTENT = (
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void,
    sensorValues: { [key: string]: number }
): IModalContent => {
    return {
        descriptionTitle: "toolbar-clue-led.title",
        tagInput: undefined,
        tagOutput: TAG_OUTPUT_SVG,
        descriptionText: "toolbar-clue-led.description",
        tryItDescription: "toolbar-clue-led.tryItDescription",
        components: undefined,
        id: "clue_neopixel",
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
        descriptionText: "toolbar-clue-speaker.description",
        tryItDescription: "toolbar-speaker.tryItDescription",
        components: [FEATURE_REQUEST_ON_GITHUB],
        id: "speaker",
    };
};
