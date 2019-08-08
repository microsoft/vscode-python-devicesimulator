// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import SensorButton from "./SensorButton";

import {
  ISensorProps,
  ISliderProps,
  X_SLIDER_INDEX,
  Z_SLIDER_INDEX,
  Y_SLIDER_INDEX
} from "../../viewUtils";

import "../../styles/MotionSensorBar.css";
import { CONSTANTS } from "../../constants";

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

const sendMessage = (state: any) => {
  vscode.postMessage({ command: "sensor-changed", text: state });
};

const MOTION_SLIDER_PROPS_X: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Left",
  maxLabel: "Right",
  type: "motion_x",
  axisLabel: "X"
};
const MOTION_SLIDER_PROPS_Y: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Back",
  maxLabel: "Front",
  type: "motion_y",
  axisLabel: "Y"
};
const MOTION_SLIDER_PROPS_Z: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Up",
  maxLabel: "Down",
  type: "motion_z",
  axisLabel: "Z"
};

const MOTION_SENSOR_PROPERTIES: ISensorProps = {
  LABEL: "Motion sensor",
  sliderProps: [
    MOTION_SLIDER_PROPS_X,
    MOTION_SLIDER_PROPS_Y,
    MOTION_SLIDER_PROPS_Z
  ],
  unitLabel: "Lux"
};

class MotionSensorBar extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="MotionSensorBar">
        <div className="header">
          <div className="title">{MOTION_SENSOR_PROPERTIES.LABEL}</div>
        </div>
        <SensorButton
          label="Shake"
          type="shake"
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
        />
        <br />
        <InputSlider
          minValue={
            MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].minValue
          }
          maxValue={
            MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].maxValue
          }
          type={MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].type}
          minLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].minLabel
          }
          maxLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].maxLabel
          }
          axisLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].axisLabel
          }
        />
        <br />
        <InputSlider
          minValue={
            MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].minValue
          }
          maxValue={
            MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].maxValue
          }
          type={MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].type}
          minLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].minLabel
          }
          maxLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].maxLabel
          }
          axisLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].axisLabel
          }
        />
        <br />
        <InputSlider
          minValue={
            MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].minValue
          }
          maxValue={
            MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].maxValue
          }
          type={MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].type}
          minLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].minLabel
          }
          maxLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].maxLabel
          }
          axisLabel={
            MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].axisLabel
          }
        />
        <br />
      </div>
    );
  }

  private onMouseDown = () => this.handleOnclick(true, "shake");

  private onKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) =>
    this.onKeyEvent(event, false);

  private onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) =>
    this.onKeyEvent(event, true);

  private onMouseUp = () => this.handleOnclick(false, "shake");

  private handleOnclick = (active: boolean, type: string) => {
    const messageState = { [type]: active };
    sendMessage(messageState);
  };

  private onKeyEvent(
    event: React.KeyboardEvent<HTMLButtonElement>,
    active: boolean
  ) {
    if ([event.keyCode, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)) {
      this.handleOnclick(active, "shake");
    }
  }
}

export default MotionSensorBar;
