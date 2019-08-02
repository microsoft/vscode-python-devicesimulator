// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import LightSensorBar from "./LightSensorBar";
import TemperatureSensorBar from "./TemperatureSensorBar";
import MotionSensorBar from "./MotionSensorBar";
import * as React from "react";
import { TAG_INPUT_SVG } from "../../svgs/tag_input_svg";
import { TAG_OUTPUT_SVG } from "../../svgs/tag_output_svg";

export const CPX_EXPRESS_DOC = (
  <a
    className="link"
    href="https://learn.adafruit.com/adafruit-circuit-playground-express/makecode"
  >
    Learn More >
  </a>
);

export const TRY_IT_MAKE_CODE = (
  <div className="link-parent">
    <a href="https://makecode.adafruit.com/" className="link">
      Try it on MakeCode >
    </a>
  </div>
);

export const TOOLBAR_ICON_LABEL = {
  LIGHT: "Light sensor",
  IR: "IR",
  TEMPERATURE: "Temperature Sensor",
  MOTION: "Motion Sensor",
  SWITCH: "Switch",
  SOUND: "Sound Sensor",
  SPEAKER: "Speaker",
  GPIO: "GPIO",
  PUSH_BUTTON: "Push Button",
  RED_LED: "Red LED",
  TAG_INPUT: "Tag Input",
  TAG_OUTPUT: "Tag Output",
  LEFT_EDGE: "left-edge",
  RIGHT_EDGE: "right-edge",
  NEO_PIXEL: "Neo Pixels"
};

export interface IModalContent {
  descriptionTitle: string;
  tagInput: any;
  tagOutput: any;
  descriptionText: string;
  tryItTitle: string;
  tryItDescriptrion: string;
  component: any;
}

export const TEMPERATURE_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Temperature Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "An NTC thermistor can sense temperature. Easy to calculate the temperature based on the analog voltage on analog pin #A9",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "You can set the temperature range from your code, as well as C or F!",
  component: <TemperatureSensorBar />
};
export const LIGHT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Light Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "An analog light sensor can be used to detect ambient light, with similar spectral response to the human eye.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: " Change the brightness from 0 - 255 here!",
  component: <LightSensorBar />
};
export const DEFAULT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "default",
  tagInput: undefined,
  tagOutput: undefined,
  descriptionText: "none",
  tryItTitle: "none",
  tryItDescriptrion: "none",
  component: undefined
};
export const MOTION_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Motion Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "Detects acceleration in XYZ orientations. And can also detect tilt, gravity, motion, as well as 'tap' and 'double tap' strikes on the board. ",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Change the acceleration here and click on the sensor on the board to simulate the “tap”!  ",
  component: <MotionSensorBar />
};
export const SWITCH_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Slide Switch ",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "This slide switch returns True or False depending on whether it's left or right and can be used as a toggle switch in your code!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Click it with your mouse to switch it on and off!",
  component: undefined
};
export const PUSHB_MODAL_CONTENT: IModalContent = {
  descriptionTitle: " Push Buttons",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    "Two push buttons A and B are connected to digital pin #4 (Left) and #5 (Right) each.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Click them with your mouse or pressing “A” “B” on your keyboard!",
  component: undefined
};
export const REDL_LED_MODAL_CONTENT: IModalContent = {
  descriptionTitle: " Red LED",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "This Red LED does double duty. It's connected to the digital #13 GPIO pin, very handy for when you want an indicator LED",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    " Run your code and see the cool effects on the simulator!",
  component: undefined
};
export const SOUND_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Sound Sensor",
  tagInput: TAG_INPUT_SVG,
  tagOutput: undefined,
  descriptionText:
    " A digital microphone can detect audio volume and even perform basic FFT functions but cannot read it like an analog voltage. ",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in Pacifica(Project Name). But try it on MakeCode!",
  component: TRY_IT_MAKE_CODE
};
export const NEOP_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "NeoPixels",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "The 10 full color RGB LEDs surrounding the outer edge of the boards can be set to any color. Great for beautiful lighting effects!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Run your code and see the cool effects on the simulator!",
  component: TRY_IT_MAKE_CODE
};
export const SPEAKER_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Speaker ",
  tagInput: undefined,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "This speaker can play .wav file and different tones, also have a class D amplifier that connected to an output A0 pin built in! You can turn it off using the shutdown control on pin #11  ",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Run your code and you’ll hear the music! Press the “mute” button underneath the simulator to mute it.",
  component: undefined
};
export const IR_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "IR Transmit & Proximity",
  tagInput: TAG_INPUT_SVG,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    "Allow you to send commands to the CPX with a remote control, or even send messages between multiple CPXs! You can also do very simple proximity sensing since it reads the reflected light. ",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in Pacifica(Project Name). But try it on MakeCode!  ",
  component: TRY_IT_MAKE_CODE
};
export const GPIO_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "GPIO ",
  tagInput: TAG_INPUT_SVG,
  tagOutput: TAG_OUTPUT_SVG,
  descriptionText:
    " 8 GPIOs on CPX! Pin A1 - A7 can also be used as capacitive touch sensors, and A0 is a true analog output pin.  ",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in Pacifica(Project Name). But try it on MakeCode!  ",
  component: TRY_IT_MAKE_CODE
};

export const LABEL_TO_MODAL_CONTENT = new Map([
  [TOOLBAR_ICON_LABEL.LIGHT, LIGHT_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.TEMPERATURE, TEMPERATURE_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.MOTION, MOTION_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.IR, IR_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.PUSH_BUTTON, PUSHB_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.RED_LED, REDL_LED_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.SOUND, SOUND_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.SPEAKER, SPEAKER_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.SWITCH, SWITCH_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.GPIO, GPIO_MODAL_CONTENT],
  [TOOLBAR_ICON_LABEL.NEO_PIXEL, NEOP_MODAL_CONTENT]
]);
