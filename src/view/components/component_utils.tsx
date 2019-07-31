// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export interface ISliderProps {
  minValue: number;
  maxValue: number;
  maxLabel: string;
  minLabel: string;
  type: string;
}

export interface ISensorProps {
  LABEL: string;
  sliderProps: ISliderProps[];
  unitLabel: string;
}

export interface IButtonProps {
  image: any;
  label: string;
  width: number;
  onClick: (event?: React.MouseEvent<HTMLElement>, label?: string) => void;
}

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
  RIGHT_EDGE: "right_edge"
};
