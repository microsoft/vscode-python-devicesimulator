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
          onKeyUp={this.validateRange}
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

  private handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateValue(event);
    this.validateRange();
    const newSensorState = this.writeMessage(event);
    if (newSensorState) {
      sendMessage(newSensorState);
    }
  }

  private writeMessage(event: React.ChangeEvent<HTMLInputElement>) {
    return this.props.type && this.state.value && event.target.value
      ? { [this.props.type]: parseInt(event.target.value, 10) }
      : undefined;
  }

  private updateValue(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.validity.valid
      ? event.target.value
      : this.state.value;
    this.setState({ value: newValue });
  }

  private sendTelemetry = () => {
    vscode.postMessage({ command: "slider-telemetry", text: this.props.type });
  };

  private validateRange() {
    if (this.state.value < this.props.minValue) {
      this.setState({ value: this.props.minValue });
    }
    if (this.state.value > this.props.maxValue) {
      this.setState({ value: this.props.maxValue });
    }
  }
}

export default InputSlider;
