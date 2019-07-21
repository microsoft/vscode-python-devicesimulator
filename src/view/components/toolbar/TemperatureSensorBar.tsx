// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "./TemperatureSensorBar.css";

const TEMPERATURE_SENSOR_PROPERTIES = {
  LABEL: "Temperature sensor",
  MAX_LABEL: "Hot",
  MIN_LABEL: "Cold",
  TYPE: "temperature"
};

interface ITemperatureUnit {
  unitLabel: string;
  minValue: number;
  maxValue: number;
}

const CELSIUS_STATE: ITemperatureUnit = {
  maxValue: 40,
  minValue: -40,
  unitLabel: "°C"
};

class TemperatureSensorBar extends React.Component<any, ITemperatureUnit, any> {
  constructor(props: any) {
    super(props);
    this.state = CELSIUS_STATE;
  }

  render() {
    return (
      <div className="temperatureSensorBar">
        <div className="header">
          <div className="title">
            {`${TEMPERATURE_SENSOR_PROPERTIES.LABEL} ${CELSIUS_STATE.unitLabel}`}
          </div>
        </div>
        <InputSlider
          min={this.state.minValue}
          max={this.state.maxValue}
          type={TEMPERATURE_SENSOR_PROPERTIES.TYPE}
          min_label={TEMPERATURE_SENSOR_PROPERTIES.MIN_LABEL}
          max_label={TEMPERATURE_SENSOR_PROPERTIES.MAX_LABEL}
          step={1}
        />
      </div>
    );
  }
}

export default TemperatureSensorBar;
