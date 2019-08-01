// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "./MotionSensorBar.css";
import { ISensorProps, ISliderProps } from "./Toolbar_utils";

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
          minValue={MOTION_SENSOR_PROPERTIES.sliderProps[0].minValue}
          maxValue={MOTION_SENSOR_PROPERTIES.sliderProps[0].maxValue}
          type={MOTION_SENSOR_PROPERTIES.sliderProps[0].type}
          minLabel={MOTION_SENSOR_PROPERTIES.sliderProps[0].minLabel}
          maxLabel={MOTION_SENSOR_PROPERTIES.sliderProps[0].maxLabel}
        />
        <br />
        <InputSlider
          minValue={MOTION_SENSOR_PROPERTIES.sliderProps[1].minValue}
          maxValue={MOTION_SENSOR_PROPERTIES.sliderProps[1].maxValue}
          type={MOTION_SENSOR_PROPERTIES.sliderProps[1].type}
          minLabel={MOTION_SENSOR_PROPERTIES.sliderProps[1].minLabel}
          maxLabel={MOTION_SENSOR_PROPERTIES.sliderProps[1].maxLabel}
        />
        <br />
        <InputSlider
          minValue={MOTION_SENSOR_PROPERTIES.sliderProps[2].minValue}
          maxValue={MOTION_SENSOR_PROPERTIES.sliderProps[2].maxValue}
          type={MOTION_SENSOR_PROPERTIES.sliderProps[2].type}
          minLabel={MOTION_SENSOR_PROPERTIES.sliderProps[2].minLabel}
          maxLabel={MOTION_SENSOR_PROPERTIES.sliderProps[2].maxLabel}
        />
        <br />
        <button aria-label="Shake button" onClick={() => {}}>
          "Shake"
        </button>
      </div>
    );
  }
}

export default MotionSensorBar;
