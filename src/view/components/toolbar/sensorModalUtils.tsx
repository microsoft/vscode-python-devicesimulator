// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import LightSensorBar from "./LightSensorBar";
import TemperatureSensorBar from "./TemperatureSensorBar";
import MotionSensorBar from "./MotionSensorBar";
import * as React from "react";
import { TAG_INPUT_SVG } from "../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../svgs/tag_output_svg";
import { ARROW_RIGHT_SVG } from "../../svgs/arrow_right_svg";

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
  TEMPERATURE: "Temperature Sensor"
};
export const TOOLBAR_ICON_ID = {
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
  TEMPERATURE: "toolbar-temperature-sensor"
};

export interface IModalContent {
  component: any;
  descriptionText: string;
  descriptionTitle: string;
  id: string;
  tagInput: any;
  tagOutput: any;
  tryItDescriptrion: string;
  tryItTitle: string;
}

export const DEFAULT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "default",
  tagInput: undefined,
  tagOutput: undefined,
  descriptionText: "none",
  tryItTitle: "none",
  tryItDescriptrion: "none",
  component: undefined,
  id: "none"
};
export const GPIO_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-gpio.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText: "toolbar-gpio.description",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion: "toolbar-gpio.tryItDescriptrion",
  component: undefined,
  id: "GPIO"
};

export const IR_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-ir-sensor.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText: "toolbar-ir-sensor.description",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion: "toolbar-ir-sensor.tryItDescriptrion",
  component: TRY_IT_MAKE_CODE,
  id: "IR"
};
export const LIGHT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-light-sensor.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText: "toolbar-light-sensor.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-light-sensor.tryItDescriptrion",
  component: <LightSensorBar />,
  id: "light_sensor"
};
export const MOTION_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-motion-sensor.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText: "toolbar-motion-sensor.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-motion-sensor.tryItDescriptrion",
  component: <MotionSensorBar />,
  id: "motion_sensor"
};
export const NEOP_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-neo-pixels.title",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText: "toolbar-neo-pixels.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-neo-pixels.tryItDescriptrion",
  component: TRY_IT_MAKE_CODE,
  id: "neon_pixel"
};
export const PUSHB_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-push-button.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText: "toolbar-push-button.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-push-button.tryItDescriptrion",
  component: undefined,
  id: "push_btn"
};
export const RED_LED_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-red-led.title",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText: "toolbar-red-led.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-red-led.tryItDescriptrion",
  component: undefined,
  id: "red_LED"
};
export const SOUND_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-sound-sensor.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText: "toolbar-sound-sensor.description",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion: "toolbar-sound-sensor.tryItDescriptrion",
  component: TRY_IT_MAKE_CODE,
  id: "sound_sensor"
};
export const SWITCH_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-slider-switch.title",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText: "toolbar-slider-switch.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-slider-switch.tryItDescriptrion",
  component: undefined,
  id: "slider_switch"
};
export const SPEAKER_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "toolbar-speaker.title",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText: "toolbar-speaker.description",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "toolbar-speaker.tryItDescriptrion",
  component: undefined,
  id: "speaker"
};
export const TEMPERATURE_MODAL_CONTENT: IModalContent = {
  component: <TemperatureSensorBar />,
  descriptionText: "toolbar-temperature-sensor.description",
  descriptionTitle: "toolbar-temperature-sensor.title",
  id: "temperature",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  tryItDescriptrion: "toolbar-temperature-sensor.tryItDescriptrion",
  tryItTitle: "Try it on the Simulator!"
};

export const LABEL_TO_MODAL_CONTENT = new Map([
  [TOOLBAR_ICON_ID.GPIO, GPIO_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.IR, IR_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.LIGHT, LIGHT_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.MOTION, MOTION_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.NEO_PIXEL, NEOP_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.PUSH_BUTTON, PUSHB_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.RED_LED, RED_LED_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.SOUND, SOUND_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.SPEAKER, SPEAKER_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.SWITCH, SWITCH_MODAL_CONTENT],
  [TOOLBAR_ICON_ID.TEMPERATURE, TEMPERATURE_MODAL_CONTENT]
]);
