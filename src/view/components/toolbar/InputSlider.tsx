// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "./InputSlider.css";

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

const sendMessage = (state: any) => {
  vscode.postMessage({ command: "sensor-changed", text: state });
};

interface ISliderProps {
  min: number;
  max: number;
  min_label: string;
  max_label: string;
  step: number;
  type: string;
}

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
        <input
          type="text"
          className="sliderValue"
          value={this.state.value}
          onInput={this.handleOnChange}
          defaultValue={this.props.min.toLocaleString()}
          pattern="^-?[0-9]*$"
          onKeyUp={this.validateRange}
        />
        <div className="sliderArea">
          <div className="upLabelArea">
            <div className="minLabel">{this.props.min_label}</div>
            <div className="maxLabel">{this.props.max_label}</div>
          </div>
          <input
            type="range"
            className="slider"
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            onChange={this.handleOnChange}
            value={this.state.value}
            defaultValue={this.props.min.toLocaleString()}
          />
          <div className="downLabelArea">
            <div className="minLabel">{this.props.min}</div>
            <div className="maxLabel">{this.props.max}</div>
          </div>
        </div>
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
      ? { temperature: parseInt(event.target.value, 10) }
      : undefined;
  }

  private updateValue(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.validity.valid
      ? event.target.value
      : this.state.value;
    console.log(`set state to ${this.state.value}`);
    this.setState({ value: newValue });
  }

  private validateRange() {
    if (this.state.value < this.props.min) {
      this.setState({ value: this.props.min });
    }
    if (this.state.value > this.props.max) {
      this.setState({ value: this.props.max });
    }
  }
}

export default InputSlider;
