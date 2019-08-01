// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import {
  ISensorProps,
  ISliderProps,
  X_SLIDER_INDEX,
  Z_SLIDER_INDEX,
  Y_SLIDER_INDEX
} from "./Toolbar_utils";
import "../../styles/MotionSensorBar.css";

const MOTION_SLIDER_PROPS_X: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Left",
  maxLabel: "Right",
  type: "motion_x"
};
const MOTION_SLIDER_PROPS_Y: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Back",
  maxLabel: "Front",
  type: "motion_y"
};
const MOTION_SLIDER_PROPS_Z: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Up",
  maxLabel: "Down",
  type: "motion_z"
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
      <div className="lightSensorBar">
        <div className="header">
          <div className="title">
            {`${MOTION_SENSOR_PROPERTIES.LABEL} (${
              MOTION_SENSOR_PROPERTIES.unitLabel
            })`}
          </div>
        </div>
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
        />
      </div>
    );
  }
}

export default MotionSensorBar;
