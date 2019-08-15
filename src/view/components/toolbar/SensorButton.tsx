// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { ISensorButtonProps } from "../../viewUtils";
import "../../styles/SensorButton.css";

const SensorButton: React.FC<ISensorButtonProps> = props => {
  return (
    <button
      onMouseUp={props.onMouseUp}
      onMouseDown={props.onMouseDown}
      onKeyUp={props.onKeyUp}
      onKeyDown={props.onKeyDown}
      aria-label={`${props.type} sensor button`}
      className="sensor-button"
    >
      {props.label}
    </button>
  );
};

export default SensorButton;
