// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/SensorButton.css";
import { ISensorButtonProps } from "../../viewUtils";

const SensorButton: React.FC<ISensorButtonProps> = props => {
    return (
        <button
            id={props.label}
            onMouseUp={props.onMouseUp}
            onMouseDown={props.onMouseDown}
            onKeyUp={props.onKeyUp}
            onKeyDown={props.onKeyDown}
            aria-label={`${props.type} sensor`}
            className="sensor-button"
        >
            {props.label}
        </button>
    );
};

export default SensorButton;
