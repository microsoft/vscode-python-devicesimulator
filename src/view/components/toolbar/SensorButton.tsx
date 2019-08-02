import * as React from "react";
import { ISensorButtonProps } from "./Toolbar_utils";

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
    this.onKeyEvent = this.onKeyEvent.bind(this);
  }

  render() {
    return (
      <button
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
        onKeyUp={this.onKeyEvent}
        aria-label={`${this.props.type} sensor button`}
      >
        {this.props.label}
      </button>
    );
  }

  private onMouseDown() {
    this.handleOnclick(true);
  }
  private onMouseUp() {
    console.log("down");
    this.handleOnclick(false);
  }
  private handleOnclick(active: boolean) {
    this.writeMessage(active);
  }
  private writeMessage(isActive: boolean) {
    const messageState = { [this.props.type]: isActive };
    sendMessage(messageState);
  }

  protected onKeyEvent(event: KeyboardEvent, active: boolean) {
    let button;
    const target = event.target as SVGElement;
    if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)) {
      if (target) {
        button = window.document.getElementById(target.id);
        if (button) {
          event.preventDefault();
          if (button.id.includes("SWITCH")) {
            // Switch
            this.handleClick(button, active);
          } else if (active && !this.keyPressed) {
            // Send one keydown event
            this.handleClick(button, active);
            this.keyPressed = true;
          } else if (!active) {
            // Keyup event
            this.handleClick(button, active);
            this.keyPressed = false;
          }
        }
      }
    }
  }
}

export default SensorButton;
