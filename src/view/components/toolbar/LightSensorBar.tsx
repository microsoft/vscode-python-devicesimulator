// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "./LightSensorBar.css";
import { ISensorProps, ISliderProps } from "./Toolbar_utils";

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
          <div className="title">
            {`${LIGHT_SENSOR_PROPERTIES.LABEL} (${
              LIGHT_SENSOR_PROPERTIES.unitLabel
            })`}
          </div>
        </div>
        <InputSlider
          minValue={LIGHT_SENSOR_PROPERTIES.sliderProps[0].minValue}
          maxValue={LIGHT_SENSOR_PROPERTIES.sliderProps[0].maxValue}
          type={LIGHT_SENSOR_PROPERTIES.sliderProps[0].type}
          minLabel={LIGHT_SENSOR_PROPERTIES.sliderProps[0].minLabel}
          maxLabel={LIGHT_SENSOR_PROPERTIES.sliderProps[0].maxLabel}
        />
      </div>
    );
  }
}

export default LightSensorBar;
