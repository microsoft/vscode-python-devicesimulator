"use strict";

import * as React from "react";
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
        lights: [
          {
            red: 255,
            green: 0,
            blue: 0
          }
        ],
        sensors: {}
      }
    };
    this.sendClickInfo = this.sendClickInfo.bind(this);
  }
  render() {
    return (
      <div>
        <Light light={this.state.cpx.lights[0]} onClick={this.sendClickInfo} />
      </div>
    );
  }

  sendClickInfo() {
    this.setState({
      cpx: { lights: [{ red: 0, green: 255, blue: 0 }] }
    });
    addCategory();
  }
}

export default Simulator;
