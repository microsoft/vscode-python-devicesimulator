// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import { ARROW_RIGHT_SVG } from "../../svgs/arrow_right_svg";
import { TAG_INPUT_SVG } from "../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../svgs/tag_output_svg";
import LightSensorBar from "./LightSensorBar";
import { Accelerometer } from "./motion/Accelerometer";
import MotionSensorBar from "./motion/MotionSensorBar";
import TemperatureSensorBar from "./TemperatureSensorBar";

export const TRY_IT_MAKE_CODE = (
    <div className="link-parent">
        <a href="https://makecode.adafruit.com/" className="link">
            Try it on MakeCode {ARROW_RIGHT_SVG}
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
};
export const CPX_TOOLBAR_ICON_ID = {
    GPIO: "toolbar-gpio",
    IR: "toolbar-ir-sensor",
    LEFT_EDGE: "left-edge",
    LIGHT: "toolbar-light-sensor",
    MOTION: "toolbar-motion-sensor",
    NEO_PIXEL: "toolbar-neo-pixels",
    PUSH_BUTTON: "toolbar-push-button",
    RED_LED: "toolbar-red-led",
    RIGHT_EDGE: "right-edge",
    SOUND: "toolbar-sound-sensor",
    SPEAKER: "toolbar-speaker",
    SWITCH: "toolbar-slider-switch",
    TEMPERATURE: "toolbar-temperature-sensor",
};

export const MICROBIT_TOOLBAR_ID = {
    TEMPERATURE: "toolbar-temperature-sensor",
    LIGHT: "toolbar-light-sensor",
    ACCELEROMETER: "toolbar-accelerometer",
};

export interface IModalContent {
    component: any;
    descriptionText: string;
    descriptionTitle: string;
    id: string;
    tagInput: any;
    tagOutput: any;
    tryItDescription: string;
    tryItTitle: string;
}

export const DEFAULT_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "default",
    tagInput: undefined,
    tagOutput: undefined,
    descriptionText: "none",
    tryItTitle: "none",
    tryItDescription: "none",
    component: undefined,
    id: "none",
};
export const GPIO_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-gpio.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: TAG_OUTPUT_SVG,
    descriptionText: "toolbar-gpio.description",
    tryItTitle: "Simulation Coming Soon!",
    tryItDescription: "toolbar-gpio.tryItDescription",
    component: undefined,
    id: "GPIO",
};

export const IR_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-ir-sensor.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: TAG_OUTPUT_SVG,
    descriptionText: "toolbar-ir-sensor.description",
    tryItTitle: "Simulation Coming Soon!",
    tryItDescription: "toolbar-ir-sensor.tryItDescription",
    component: TRY_IT_MAKE_CODE,
    id: "IR",
};
export const LIGHT_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-light-sensor.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    descriptionText: "toolbar-light-sensor.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-light-sensor.tryItDescription",
    component: <LightSensorBar />,
    id: "light_sensor",
};
export const MOTION_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-motion-sensor.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    descriptionText: "toolbar-motion-sensor.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-motion-sensor.tryItDescription",
    component: <MotionSensorBar />,
    id: "motion_sensor",
};
export const NEOP_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-neo-pixels.title",
    tagInput: undefined,
    tagOutput: TAG_OUTPUT_SVG,
    descriptionText: "toolbar-neo-pixels.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-neo-pixels.tryItDescription",
    component: undefined,
    id: "neon_pixel",
};
export const PUSHB_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-push-button.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    descriptionText: "toolbar-push-button.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-push-button.tryItDescription",
    component: undefined,
    id: "push_btn",
};
export const RED_LED_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-red-led.title",
    tagInput: undefined,
    tagOutput: TAG_OUTPUT_SVG,
    descriptionText: "toolbar-red-led.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-red-led.tryItDescription",
    component: undefined,
    id: "red_LED",
};
export const SOUND_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-sound-sensor.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    descriptionText: "toolbar-sound-sensor.description",
    tryItTitle: "Simulation Coming Soon!",
    tryItDescription: "toolbar-sound-sensor.tryItDescription",
    component: TRY_IT_MAKE_CODE,
    id: "sound_sensor",
};
export const SWITCH_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-slider-switch.title",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    descriptionText: "toolbar-slider-switch.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-slider-switch.tryItDescription",
    component: undefined,
    id: "slider_switch",
};
export const SPEAKER_MODAL_CONTENT: IModalContent = {
    descriptionTitle: "toolbar-speaker.title",
    tagInput: undefined,
    tagOutput: TAG_OUTPUT_SVG,
    descriptionText: "toolbar-speaker.description",
    tryItTitle: "Try it on the Simulator!",
    tryItDescription: "toolbar-speaker.tryItDescription",
    component: undefined,
    id: "speaker",
};
export const TEMPERATURE_MODAL_CONTENT: IModalContent = {
    component: <TemperatureSensorBar />,
    descriptionText: "toolbar-temperature-sensor.description",
    descriptionTitle: "toolbar-temperature-sensor.title",
    id: "temperature",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    tryItDescription: "toolbar-temperature-sensor.tryItDescription",
    tryItTitle: "Try it on the Simulator!",
};

export const ACCELEROMETER_MODAL_CONTENT: IModalContent = {
    component: <Accelerometer />,
    descriptionText: "toolbar-accelerometer-sensor.description",
    descriptionTitle: "toolbar-accelerometer-sensor.title",
    id: "temperature",
    tagInput: TAG_INPUT_SVG,
    tagOutput: undefined,
    tryItDescription: "toolbar-accelerometer-sensor.tryItDescription",
    tryItTitle: "Try it on the Simulator!",
};

export const LABEL_TO_MODAL_CONTENT = new Map([
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
    [MICROBIT_TOOLBAR_ID.ACCELEROMETER, ACCELEROMETER_MODAL_CONTENT],
]);
