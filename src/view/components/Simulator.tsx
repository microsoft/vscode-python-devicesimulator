import * as React from "react";
import { BUTTON_NEUTRAL, BUTTON_PRESSED } from "./Cpx_svg_style";
import Cpx from "./cpx/Cpx";

interface IState {
  pixels: Array<Array<number>>;
  brightness: number;
  red_led: boolean;
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
      ],

      red_led: false
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
          red_led={this.state.red_led}
          onMouseEvent={this.handleClick}
        />
      </div>
    );
  }

  handleClick(button: HTMLElement, active: boolean, event: Event) {
    event.preventDefault();
    const a: boolean = button.id.match(/BTN_A/) !== null;
    const b: boolean = button.id.match(/BTN_B/) !== null;
    let innerButton;
    if (a && button) {
      innerButton = window.document.getElementById("BTN_A_INNER");
      const newState = {
        button_a: active
      };
      this.setState(newState);
      sendMessage(newState);
    } else if (b && button) {
      innerButton = window.document.getElementById("BTN_B_INNER");
      const newState = {
        button_b: active
      };
      this.setState(newState);
      sendMessage(newState);
    }
    if (innerButton) innerButton.style.fill = this.getButtonColor(active);
    button.focus();
  }

  getButtonColor(pressed: boolean) {
    const buttonUps = BUTTON_NEUTRAL;
    const buttonDown = BUTTON_PRESSED;
    return pressed ? buttonDown : buttonUps;
  }
}

export default Simulator;
