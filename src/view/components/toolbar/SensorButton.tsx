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
    this.state = {
      isActive: false
    };
    this.handleOnclick = this.handleOnclick.bind(this);
  }

  render() {
    return (
      <button
        onClick={this.handleOnclick}
        aria-label={`${this.props.type} sensor button`}
      >
        {this.props.label}
      </button>
    );
  }

  private handleOnclick() {
    this.writeMessage(true);
  }
  private writeMessage(isActive: boolean) {
    const messageState = { [this.props.type]: true };
    sendMessage(messageState);
  }
}

export default SensorButton;
