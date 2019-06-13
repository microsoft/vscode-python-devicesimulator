import * as React from "react";
import Cpx from "./cpx/Cpx";

interface IState {
  pixels: Array<Array<number>>;
  brightness: number;
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

const sendMessage = (state: any) => {
  console.log("snedmessage");
  vscode.postMessage({ command: "button-press", text: state, type: "HELOOOO" });
};

class Simulator extends React.Component<any, IState> {
  constructor(props: IMyProps) {
    super(props);
    this.state = {
      brightness: 1.0,
      button_a: false,
      button_b: false,
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
      ]
    };
    this.sendClickInfo = this.sendClickInfo.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    console.log("change state:" + message);
    this.setState(message);
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
        <Cpx
          pixels={this.state.pixels}
          brightness={this.state.brightness}
          onClick={this.sendClickInfo}
        />
      </div>
    );
  }

  sendClickInfo() {
    this.setState({
      brightness: 1.0,
      button_a: false,
      button_b: false,
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
      ]
    });
    sendMessage(this.state);
  }
}

export default Simulator;
