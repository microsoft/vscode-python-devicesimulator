// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { SENSOR_LIST, VIEW_STATE, WEBVIEW_MESSAGES } from "../../constants";
import { ViewStateContext } from "../../context";
import "../../styles/InputSlider.css";
import { sendMessage } from "../../utils/MessageUtils";
import { ISliderProps } from "../../viewUtils";

class InputSlider extends React.Component<ISliderProps, any, any> {
    constructor(props: ISliderProps) {
        super(props);
        this.state = {
            value: this.props.value,
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.validateRange = this.validateRange.bind(this);
    }

    render() {
        const isInputDisabled = this.context === VIEW_STATE.PAUSE;
        return (
            <div className="inputSlider">
                <span>{this.props.axisLabel}</span>
                <input
                    type="text"
                    className="sliderValue"
                    value={this.props.value}
                    onInput={this.handleOnChange}
                    defaultValue={this.props.minValue.toLocaleString()}
                    pattern="^-?[0-9]{0,4}$"
                    onKeyUp={this.handleOnChange}
                    aria-label={`${this.props.type} sensor input ${this.props.axisLabel}`}
                />
                <span className="sliderArea">
                    <span className="upLabelArea">
                        <span className="minLabel">{this.props.minValue}</span>
                        <span className="maxLabel">{this.props.maxValue}</span>
                    </span>
                    <input
                        type="range"
                        className="slider"
                        aria-valuemin={this.props.minValue}
                        aria-valuemax={this.props.maxValue}
                        min={this.props.minValue}
                        max={this.props.maxValue}
                        onChange={this.handleOnChange}
                        onKeyUp={this.sendTelemetry}
                        onMouseUp={this.sendTelemetry}
                        aria-valuenow={this.state.value}
                        value={this.props.value}
                        aria-label={`${this.props.type} sensor slider`}
                        defaultValue={this.props.minValue.toLocaleString()}
                        disabled={isInputDisabled}
                    />
                    <span className="downLabelArea">
                        <span className="minLabel">{this.props.minLabel}</span>
                        <span className="maxLabel">{this.props.maxLabel}</span>
                    </span>
                </span>
            </div>
        );
    }

    private handleOnChange = (event: any) => {
        const validatedValue = this.validateRange(this.updateValue(event));
        const newSensorState = this.writeMessage(validatedValue);
        if (newSensorState) {
            sendMessage(WEBVIEW_MESSAGES.SENSOR_CHANGED, newSensorState);
        }
    };

    private writeMessage = (valueTowrite: number) => {
        let value = valueTowrite;
        if (value > this.props.maxValue || value < this.props.minValue) {
            value = parseInt(this.state.value, 10);
        }

        return this.props.type && this.state.value !== undefined
            ? { [this.props.type]: value }
            : undefined;
    };

    private updateValue = (event: any) => {
        const newValue = event.target.validity.valid
            ? event.target.value
            : this.state.value;
        if (this.props.onUpdateValue) {
            this.props.onUpdateValue(this.props.type as SENSOR_LIST, newValue);
        }
        return newValue;
    };

    private sendTelemetry = () => {
        sendMessage(WEBVIEW_MESSAGES.SLIDER_TELEMETRY, this.props.type);
    };

    private validateRange = (valueString: string) => {
        let valueInt = parseInt(valueString, 10);
        if (valueInt < this.props.minValue) {
            valueInt = this.props.minValue;
            this.setState({ value: valueInt });
        } else if (valueInt > this.props.maxValue) {
            valueInt = this.props.maxValue;
            this.setState({ value: valueInt });
        }
        return valueInt;
    };
}
InputSlider.contextType = ViewStateContext;

export default InputSlider;
