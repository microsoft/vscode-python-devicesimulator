// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "./LightSensorBar.css";
import { ISensorProps, ISliderProps, X_SLIDER_INDEX } from "./ToolbarUtils";

const LIGHT_SLIDER_PROPS: ISliderProps = {
  maxValue: 255,
  minValue: 0,
  minLabel: "Dark",
  maxLabel: "Bright",
  type: "light"
};

const LIGHT_SENSOR_PROPERTIES: ISensorProps = {
  LABEL: "Light sensor",
  sliderProps: [LIGHT_SLIDER_PROPS],
  unitLabel: "Lux"
};

class LightSensorBar extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="lightSensorBar">
        <div className="header">
          <div className="title">{LIGHT_SENSOR_PROPERTIES.LABEL}</div>
        </div>
        <InputSlider
          minValue={
            LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].minValue
          }
          maxValue={
            LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].maxValue
          }
          type={LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].type}
          minLabel={
            LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].minLabel
          }
          maxLabel={
            LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].maxLabel
          }
        />
      </div>
    );
  }
}

export default LightSensorBar;
