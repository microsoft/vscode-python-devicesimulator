// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import { ISensorProps, ISliderProps, X_SLIDER_INDEX } from "./Toolbar_utils";
import "../../styles/TemperatureSensorBar.css";

const TEMPERATURE_SLIDER_PROPS: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Cold",
  maxLabel: "Hot",
  type: "temperature"
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
        <div className="header">
          <div className="title">
            {`${TEMPERATURE_SENSOR_PROPERTIES.LABEL} (${
              TEMPERATURE_SENSOR_PROPERTIES.unitLabel
            })`}
          </div>
        </div>
        <InputSlider
          minValue={
            TEMPERATURE_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].minValue
          }
          maxValue={
            TEMPERATURE_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].maxValue
          }
          type={TEMPERATURE_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].type}
          minLabel={
            TEMPERATURE_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].minLabel
          }
          maxLabel={
            TEMPERATURE_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].maxLabel
          }
        />
      </div>
    );
  }
}

export default TemperatureSensorBar;
