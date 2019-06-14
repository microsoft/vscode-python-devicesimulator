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
  console.log("sendmessage");
  vscode.postMessage({ command: "button-press", text: state });
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    console.log("change state:" + message);
    this.setState(message);
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
      <div>
        <Cpx
          pixels={this.state.pixels}
          brightness={this.state.brightness}
          onMouseEvent={this.handleClick}
        />
      </div>
    );
  }

  handleClick(id: string, active: boolean, event: Event) {
    const a: boolean = id.match(/BTN_A/) !== null;
    const b: boolean = id.match(/BTN_B/) !== null;

    if (a) {
      const newState = {
        button_a: active
      };
      this.setState(newState);
      sendMessage(newState);
    } else if (b) {
      const newState = {
        button_b: active
      };
      this.setState(newState);
      sendMessage(newState);
    }
  }
}

export default Simulator;
