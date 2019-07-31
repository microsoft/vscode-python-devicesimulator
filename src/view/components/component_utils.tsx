// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import LightSensorBar from "./toolbar/LightSensorBar";
import TemperatureSensorBar from "./toolbar//TemperatureSensorBar";
import MotionSensorBar from "./toolbar/MotionSensorBar";
import * as React from "react";

export const TOOLBAR_ICON_LABEL = {
  LIGHT: "light_sensor",
  IR: "ir_sensor",
  TEMPERATURE: "temperature_sensor",
  MOTION: "motion_sensor",
  SWITCH: "switch",
  SOUND: "sound_sensor",
  SPEAKER: "speaker",
  GPIO: "gpio",
  PUSH_BUTTON: "push_button",
  RED_LED: "red_led",
  TAG_INPUT: "tag_input",
  TAG_OUTPUT: "tag_output",
  LEFT_EDGE: "lefy_edge",
  RIGHT_EDGE: "right_edge",
  NEO_PIXEL: "neo_pixel"
};

export interface IModalContent {
  descriptionTitle: string;
  tag: string;
  descriptionText: string;
  tryItTitle: string;
  tryItDescriptrion: string;
  component: any;
}

export const TEMPERATURE_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Temperature Sensor",
  tag: "input",
  descriptionText:
    "An NTC thermistor can sense temperature. Easy to calculate the temperature based on the analog voltage on analog pin #A9",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "You can set the temperature range from your code, as well as C or F!",
  component: <TemperatureSensorBar />
};
export const LIGHT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Light Sensor",
  tag: "input",
  descriptionText:
    "An analog light sensor can be used to detect ambient light, with similar spectral response to the human eye.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: " Change the brightness from 0 - 255 here!",
  component: <LightSensorBar />
};
export const DEFAULT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "default",
  tag: "none",
  descriptionText: "none",
  tryItTitle: "none",
  tryItDescriptrion: "none",
  component: undefined
};
export const MOTION_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Motion Sensor",
  tag: "input",
  descriptionText:
    "Detects acceleration in XYZ orientations. And can also detect tilt, gravity, motion, as well as 'tap' and 'double tap' strikes on the board. ",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Change the acceleration here and click on the sensor on the board to simulate the “tap”!  ",
  component: <MotionSensorBar />
};
export const SWITCH_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Slide Switch ",
  tag: "input",
  descriptionText:
    "This slide switch returns True or False depending on whether it's left or right and can be used as a toggle switch in your code!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Click it with your mouse to switch it on and off!",
  component: undefined
};
export const PUSHB_MODAL_CONTENT: IModalContent = {
  descriptionTitle: " Push Buttons",
  tag: "input",
  descriptionText:
    "Two push buttons A and B are connected to digital pin #4 (Left) and #5 (Right) each.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Click them with your mouse or pressing “A” “B” on your keyboard!",
  component: undefined
};
export const REDL_LED_MODAL_CONTENT: IModalContent = {
  descriptionTitle: " Red LED",
  tag: "Output ",
  descriptionText:
    "This Red LED does double duty. It's connected to the digital #13 GPIO pin, very handy for when you want an indicator LED",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    " Run your code and see the cool effects on the simulator!",
  component: undefined
};
export const SOUND_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Sound Sensor",
  tag: "Input  ",
  descriptionText:
    " A digital microphone can detect audio volume and even perform basic FFT functions but cannot read it like an analog voltage. ",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in Pacifica(Project Name). But try it on MakeCode!",
  component: undefined
};
export const NEOP_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "NeoPixels",
  tag: "Output",
  descriptionText:
    "The 10 full color RGB LEDs surrounding the outer edge of the boards can be set to any color. Great for beautiful lighting effects!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Run your code and see the cool effects on the simulator!",
  component: undefined
};
export const SPEAKER_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Speaker ",
  tag: "Output",
  descriptionText:
    "This speaker can play .wav file and different tones, also have a class D amplifier that connected to an output A0 pin built in! You can turn it off using the shutdown control on pin #11  ",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Run your code and you’ll hear the music! Press the “mute” button underneath the simulator to mute it.",
  component: undefined
};
export const IR_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "IR Transmit & Proximity",
  tag: "Input & Output",
  descriptionText:
    "Allow you to send commands to the CPX with a remote control, or even send messages between multiple CPXs! You can also do very simple proximity sensing since it reads the reflected light. ",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in Pacifica(Project Name). But try it on MakeCode!  ",
  component: undefined
};
export const GPIO_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "GPIO ",
  tag: "Input & Output",
  descriptionText:
    " 8 GPIOs on CPX! Pin A1 - A7 can also be used as capacitive touch sensors, and A0 is a true analog output pin.  ",
  tryItTitle: "Simulation Coming Soon!",
  tryItDescriptrion:
    "We’re working hard to support this sensor on the simulator in Pacifica(Project Name). But try it on MakeCode!  ",
  component: undefined
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
