// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "../../styles/TemperatureSensorBar.css";
import { ISensorProps, ISliderProps } from "../../view_utils";

const TEMPERATURE_SLIDER_PROPS: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Cold",
  maxLabel: "Hot",
  type: "temperature",
  axisLabel: ""
};
const TEMPERATURE_SENSOR_PROPERTIES: ISensorProps = {
  LABEL: "Temperature sensor",
  sliderProps: [TEMPERATURE_SLIDER_PROPS],
  unitLabel: "°C"
};

class TemperatureSensorBar extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="temperatureSensorBar">
        <InputSlider
          minValue={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[0].minValue}
          maxValue={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[0].maxValue}
          type={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[0].type}
          minLabel={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[0].minLabel}
          maxLabel={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[0].maxLabel}
          axisLabel={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[0].axisLabel}
        />
      </div>
    );
  }
}

export default TemperatureSensorBar;
