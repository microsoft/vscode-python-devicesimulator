"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Light from "./lights/Light";

interface IState {
  cpx: any;
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
      cpx: {
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
      }
    };
    this.sendClickInfo = this.sendClickInfo.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    console.log("In handle message");
    switch (message.command) {
      case "state":
        console.log("change state");
        this.setState({
          cpx: {
            pixels: [
              [255, 0, 0],
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
          }
        });
        break;
    }
  };

  componentDidMount() {
    console.log("Mounted");
    const ref: any = ReactDOM.findDOMNode(this);
    if (ref !== null) {
      console.log("ref not null");
      ref.addEventListener("message", this.handleMessage);
    } else {
      console.log("The ref is null :(");
    }
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    const ref: any = ReactDOM.findDOMNode(this);
    if (ref !== null) {
      ref.removeEventListener("message", this.handleMessage);
    }
  }
  render() {
    return (
      <div>
        <Light light={this.state.cpx.pixels[0]} onClick={this.sendClickInfo} />
      </div>
    );
  }

  sendClickInfo() {
    this.setState({
      cpx: {
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
      }
    });
    addCategory();
  }
}

export default Simulator;
