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
  TEMPERATURE: "toolbar-temperatur-sensor"
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
  descriptionTitle: "GPIO",
  tagInput: TAG_INPUT_SVG,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "8 GPIOs on CPX! Pin A1 - A7 can also be used as capacitive touch sensors, and A0 is a true analog output pin.",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in the Pacifica. You can try it on MakeCode!",
  component: TRY_IT_MAKE_CODE,
  id: "GPIO"
};

export const IR_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "IR Transmit & Receiver",
  tagInput: TAG_INPUT_SVG,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "Allows you to send commands to the CPX with a remote control, or even send messages between multiple CPXs! You can also do very simple proximity sensing since it reads the reflected light.",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in the Pacifica. You can try it on MakeCode!",
  component: TRY_IT_MAKE_CODE,
  id: "IR"
};
export const LIGHT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Light Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "An analog light sensor can be used to detect ambient light, with similar spectral response to the human eye.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Change the brightness from 0 - 255 here!",
  component: <LightSensorBar />,
  id: "light_sensor"
};
export const MOTION_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Motion Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "Detects acceleration in XYZ orientations. And can also detect 'tap' and 'double tap' strikes on the board and when the board is shaken.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Change the acceleration here and click on the sensor on the board to simulate the “tap”!",
  component: <MotionSensorBar />,
  id: "motion_sensor"
};
export const NEOP_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "NeoPixels",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "The 10 full color RGB LEDs surrounding the outer edge of the boards can be set to any color. Great for beautiful lighting effects!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Run your code and see the cool effects on the simulator!",
  component: undefined,
  id: "neon_pixel"
};
export const PUSHB_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Push Buttons",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "Two push buttons A and B are connected to digital pin #4 (Left) and #5 (Right) each.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Click them with your mouse or pressing “A” “B” on your keyboard!",
  component: undefined,
  id: "push_btn"
};
export const RED_LED_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Red LED",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "This Red LED is connected to the digital #13 GPIO pin. It can be very handy when you want an indicator LED.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Run your code and see the cool effects on the simulator!",
  component: undefined,
  id: "red_LED"
};
export const SOUND_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Sound Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "A digital microphone can detect audio volume and even perform basic FFT functions but cannot read it like an analog voltage.",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in the Pacifica. You can try it on MakeCode!",
  component: TRY_IT_MAKE_CODE,
  id: "sound_sensor"
};
export const SWITCH_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Slide Switch ",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "This slide switch returns True or False depending on whether it's ON or OFF and can be used as a toggle switch in your code!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Click it with your mouse to switch it ON and OFF!",
  component: undefined,
  id: "slider_switch"
};
export const SPEAKER_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Speaker ",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "This speaker can play .wav file and different tones and also has a class D amplifier that is connected to an output A0 pin built in! You can turn it off using the shutdown control on pin #11 on the physical device.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Run your code and you’ll hear music!",
  component: undefined,
  id: "speaker"
};
export const TEMPERATURE_MODAL_CONTENT: IModalContent = {
  component: <TemperatureSensorBar />,
  descriptionText:
    "This sensor uses an NTC thermistor to sense temperature an calculate it with the analog voltage on analog pin #A9.",
  descriptionTitle: "Temperature Sensor",
  id: "temperature",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  tryItDescriptrion: "You can set the temperature range from your code!",
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
