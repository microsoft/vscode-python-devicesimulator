// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/SensorButton.css";
import { ISensorButtonProps } from "../../viewUtils";

class SensorButton extends React.Component<ISensorButtonProps> {
    private buttonRef: React.RefObject<HTMLButtonElement> = React.createRef();

    public setButtonClass = (isActive: boolean) => {
        if (isActive) {
            this.buttonRef!.current!.setAttribute(
                "class",
                "sensor-button active-button"
            );
        } else {
            this.buttonRef!.current!.setAttribute("class", "sensor-button");
        }
    };
    render() {
        return (
            <button
                id={this.props.label}
                ref={this.buttonRef}
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onKeyUp={this.props.onKeyUp}
                onKeyDown={this.props.onKeyDown}
                aria-label={`${this.props.type} sensor`}
                className="sensor-button"
            >
                {this.props.label}
            </button>
        );
    }
}

export default SensorButton;
