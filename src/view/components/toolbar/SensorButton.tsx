// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/SensorButton.css";
import { ISensorButtonProps } from "../../viewUtils";
import { ViewStateContext } from "../../context";
import { VIEW_STATE } from "../../constants";

class SensorButton extends React.Component<ISensorButtonProps> {
    private buttonRef: React.RefObject<HTMLButtonElement> = React.createRef();

    public setButtonClass = (isActive: boolean) => {
        const isInputDisabled = this.context === VIEW_STATE.PAUSE;

        if (isActive && !isInputDisabled && this.buttonRef.current) {
            this.buttonRef.current.setAttribute(
                "class",
                "sensor-button active-button"
            );
        } else if (this.buttonRef.current) {
            this.buttonRef!.current!.setAttribute("class", "sensor-button");
        }
    };
    render() {
        const isInputDisabled = this.context === VIEW_STATE.PAUSE;

        return (
            <button
                id={this.props.label}
                ref={this.buttonRef}
                disabled={isInputDisabled}
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
SensorButton.contextType = ViewStateContext;
export default SensorButton;
