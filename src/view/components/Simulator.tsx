"use strict";

import * as React from "react";
import Light from "./lights/Light";

interface IState {
  pixels: Array<Array<number>>;
  button_a: any;
  button_b: any;
}
interface IMyProps {
  children?: any;
}

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;

const addCategory = () =>
  vscode.postMessage({ command: "light-press", text: "HELOOOO" });

class Simulator extends React.Component<any, IState> {
  constructor(props: IMyProps) {
    super(props);
    this.state = {
      pixels: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      button_a: false,
      button_b: false
    };
    this.sendClickInfo = this.sendClickInfo.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    console.log("change state");
    this.setState(message.cpx);
  };

  componentDidMount() {
    console.log("Mounted");
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    window.removeEventListener("message", this.handleMessage.bind(this));
  }
  render() {
    return (
      <div>
        <Light light={this.state.pixels[0]} onClick={this.sendClickInfo} />
      </div>
    );
  }

  sendClickInfo() {
    this.setState({
      pixels: [
        [0, 255, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      button_a: false,
      button_b: false
    });
    addCategory();
  }
}

export default Simulator;
