// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { BUTTON_NEUTRAL, BUTTON_PRESSED } from "./cpx/Cpx_svg_style";
import Cpx from "./cpx/Cpx";
import svg from "./cpx/Svg_utils";

interface IState {
  pixels: Array<Array<number>>;
  brightness: number;
  red_led: boolean;
  button_a: boolean;
  button_b: boolean;
  switch: boolean;
}
interface IMyProps {
  children?: any;
}

const DEFAULT_STATE: IState = {
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
  red_led: false,
  switch: false
};

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
    this.state = DEFAULT_STATE;

    this.handleClick = this.handleClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
      case "reset-state":
        console.log("Clearing the state");
        this.setState(DEFAULT_STATE);
        break;
      case "set-state":
        console.log("Setting the state: " + JSON.stringify(message.state));
        this.setState(message.state);
        break;
      default:
        console.log("Invalid message received from the extension.");
        this.setState(DEFAULT_STATE);
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
      <div>
        <Cpx
          pixels={this.state.pixels}
          brightness={this.state.brightness}
          red_led={this.state.red_led}
          switch={this.state.switch}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.onMouseLeave}
        />
      </div>
    );
  }

  protected onMouseDown(button: HTMLElement, event: Event) {
    event.preventDefault();
    this.handleClick(button, true);
    button.focus();
  }
  protected onMouseUp(button: HTMLElement, event: Event) {
    event.preventDefault();
    this.handleClick(button, false);
  }
  protected onMouseLeave(button: HTMLElement, event: Event) {
    event.preventDefault();

    if (button.getAttribute("pressed") === "true") {
      this.handleClick(button, false);
    }
  }

  private handleClick(button: HTMLElement, active: boolean) {
    let newState = undefined;
    if (button.id.includes("BTN")) {
      newState = this.handleButtonClick(button, active);
    } else if (button.id.includes("SWITCH")) {
      newState = this.handleSwitchClick(button);
    } else return;

    if (newState) sendMessage(newState);
  }

  private handleButtonClick(button: HTMLElement, active: boolean) {
    const ButtonA: boolean = button.id.match(/BTN_A/) !== null;
    const ButtonB: boolean = button.id.match(/BTN_B/) !== null;
    const ButtonAB: boolean = button.id.match(/BTN_AB/) !== null;
    let innerButton;
    let newState;
    if (ButtonAB) {
      innerButton = window.document.getElementById("BTN_AB_INNER");
      newState = {
        button_a: active,
        button_b: active
      };
      this.setState(newState);
    } else if (ButtonA) {
      innerButton = window.document.getElementById("BTN_A_INNER");
      newState = {
        button_a: active
      };
      this.setState(newState);
    } else if (ButtonB) {
      innerButton = window.document.getElementById("BTN_B_INNER");
      newState = {
        button_b: active
      };
      this.setState(newState);
    }
    if (innerButton) innerButton.style.fill = this.getButtonColor(active);
    button.setAttribute("pressed", `${active}`);
    return newState;
  }

  private getButtonColor(pressed: boolean) {
    const buttonUps = BUTTON_NEUTRAL;
    const buttonDown = BUTTON_PRESSED;
    return pressed ? buttonDown : buttonUps;
  }

  private handleSwitchClick(button: HTMLElement) {
    const switchInner = (window.document.getElementById(
      "SWITCH_INNER"
    ) as unknown) as SVGElement;

    svg.addClass(switchInner, "sim-slide-switch-inner");

    let switchIsOn: boolean = !this.state.switch;

    if (switchIsOn) {
      svg.addClass(switchInner, "on");
      switchInner.setAttribute("transform", "translate(-5,0)");
    } else {
      svg.removeClass(switchInner, "on");
      switchInner.removeAttribute("transform");
    }
    this.setState({ switch: switchIsOn });
    button.setAttribute("aria-pressed", switchIsOn.toString());
    return { switch: switchIsOn };
  }
}

export default Simulator;
