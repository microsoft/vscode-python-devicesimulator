// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "./LightSensorBar.css";
import { ISensorProps, ISliderProps } from "./Toolbar_ressources";

const LIGHT_SLIDER_PROPS: ISliderProps = {
  maxValue: 125,
  minValue: -55,
  minLabel: "Dark",
  maxLabel: "Bright",
  type: "light"
};

const LIGHT_SENSOR_PROPERTIES: ISensorProps = {
  LABEL: "Light sensor",
  sliderProps: LIGHT_SLIDER_PROPS,
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
          <div className="title">
            {`${LIGHT_SENSOR_PROPERTIES.LABEL} (${
              LIGHT_SENSOR_PROPERTIES.unitLabel
            })`}
          </div>
        </div>
        <InputSlider
          minValue={LIGHT_SENSOR_PROPERTIES.sliderProps.minValue}
          maxValue={LIGHT_SENSOR_PROPERTIES.sliderProps.maxValue}
          type={LIGHT_SENSOR_PROPERTIES.sliderProps.type}
          minLabel={LIGHT_SENSOR_PROPERTIES.sliderProps.minLabel}
          maxLabel={LIGHT_SENSOR_PROPERTIES.sliderProps.maxLabel}
        />
      </div>
    );
  }
}

export default LightSensorBar;
