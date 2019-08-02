import * as React from "react";
import { ISensorButtonProps } from "./Toolbar_utils";
import { CONSTANTS } from "../../constants";
import "../../styles/SensorButton.css";

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

const sendMessage = (state: any) => {
  vscode.postMessage({ command: "sensor-changed", text: state });
};

class SensorButton extends React.Component<ISensorButtonProps, any, any> {
  constructor(props: any) {
    super(props);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  render() {
    return (
      <button
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        aria-label={`${this.props.type} sensor button`}
        className="sensor-button"
      >
        {this.props.label}
      </button>
    );
  }

  private onMouseDown() {
    this.handleOnclick(true);
  }
  private onKeyUp(event: React.KeyboardEvent<HTMLButtonElement>) {
    this.onKeyEvent(event, false);
  }
  private onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    this.onKeyEvent(event, true);
  }
  private onMouseUp() {
    this.handleOnclick(false);
  }
  private handleOnclick(active: boolean) {
    this.writeMessage(active);
  }
  private writeMessage(isActive: boolean) {
    const messageState = { [this.props.type]: isActive };
    sendMessage(messageState);
  }

  private onKeyEvent(
    event: React.KeyboardEvent<HTMLButtonElement>,
    active: boolean
  ) {
    if ([event.keyCode, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)) {
      this.handleOnclick(active);
    }
  }
}

export default SensorButton;
