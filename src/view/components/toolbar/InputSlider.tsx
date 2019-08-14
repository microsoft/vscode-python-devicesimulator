// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/InputSlider.css";
import { ISliderProps } from "../../viewUtils";

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

const sendMessage = (state: any) => {
  vscode.postMessage({ command: "sensor-changed", text: state });
};

class InputSlider extends React.Component<ISliderProps, any, any> {
  constructor(props: ISliderProps) {
    super(props);
    this.state = {
      value: 0
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.validateRange = this.validateRange.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
      case "reset-state":
        this.setState({ value: 0 });
        break;
      case "set-state":
        console.log("Setting the state: " + JSON.stringify(message.state));
        break;
      default:
        console.log("Invalid message received from the extension.");
        this.setState({ value: 0 });
        break;
    }
  };

  componentDidMount() {
    console.log("Mounted");
    window.addEventListener("message", this.handleMessage);
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    window.removeEventListener("message", this.handleMessage);
  }
  render() {
    return (
      <div className="inputSlider">
        <span>{this.props.axisLabel}</span>
        <input
          type="text"
          className="sliderValue"
          value={this.state.value}
          onInput={this.handleOnChange}
          defaultValue={this.props.minValue.toLocaleString()}
          pattern="^-?[0-9]{0,3}$"
          onKeyUp={this.handleOnKeyup}
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
            aria-valuenow={this.state.value}
            value={this.state.value}
            aria-label={`${this.props.type} sensor slider`}
            defaultValue={this.props.minValue.toLocaleString()}
          />
          <span className="downLabelArea">
            <span className="minLabel">{this.props.minLabel}</span>
            <span className="maxLabel">{this.props.maxLabel}</span>
          </span>
        </span>
      </div>
    );
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = this.validateRange(this.updateValue(event));

    const newSensorState = this.writeMessage(validatedValue);
    if (newSensorState) {
      sendMessage(newSensorState);
    }
  };

  private handleOnKeyup = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const validatedValue = this.validateRange(this.updateValue(event));

    const newSensorState = this.writeMessage(validatedValue);
    if (newSensorState) {
      sendMessage(newSensorState);
    }
  };

  private writeMessage = (valueTowrite: number) => {
    let value = valueTowrite;
    if (value > this.props.maxValue) {
      value = parseInt(this.state.value, 10);
    } else if (value < this.props.minValue) {
      value = parseInt(this.state.value, 10);
    }

    return this.props.type && this.state.value
      ? { [this.props.type]: value }
      : undefined;
  };

  private updateValue = (event: any) => {
    const newValue = event.target.validity.valid
      ? event.target.value
      : this.state.value;
    this.setState({ value: newValue });
    return newValue;
  };

  private validateRange = (valueString: string) => {
    let valueInt = parseInt(valueString, 10);
    if (valueInt < this.props.minValue) {
      valueInt = this.props.minValue;
      this.setState({ value: valueInt });
    }
    if (valueInt > this.props.maxValue) {
      valueInt = this.props.maxValue;
      this.setState({ value: valueInt });
    }
    return valueInt;
  };
}

export default InputSlider;
