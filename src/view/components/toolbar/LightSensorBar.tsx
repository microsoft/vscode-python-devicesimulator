// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "../../styles/LightSensorBar.css";
import "./LightSensorBar.css";
import { ISensorProps, ISliderProps } from "../../view_utils";

const LIGHT_SLIDER_PROPS: ISliderProps = {
  maxValue: 255,
  minValue: 0,
  minLabel: "Dark",
  maxLabel: "Bright",
  type: "light",
  axisLabel: ""
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
        <InputSlider
          minValue={LIGHT_SENSOR_PROPERTIES.sliderProps[0].minValue}
          maxValue={LIGHT_SENSOR_PROPERTIES.sliderProps[0].maxValue}
          type={LIGHT_SENSOR_PROPERTIES.sliderProps[0].type}
          minLabel={LIGHT_SENSOR_PROPERTIES.sliderProps[0].minLabel}
          maxLabel={LIGHT_SENSOR_PROPERTIES.sliderProps[0].maxLabel}
          axisLabel={LIGHT_SENSOR_PROPERTIES.sliderProps[0].axisLabel}
        />
      </div>
    );
  }
}

export default LightSensorBar;
