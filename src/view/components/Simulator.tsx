// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { BUTTON_NEUTRAL, BUTTON_PRESSED } from "./cpx/Cpx_svg_style";
import Cpx, { updateSwitch } from "./cpx/Cpx";
import Button from "./Button";
import CONSTANTS from "../constants";
import PlayLogo from "../svgs/play_svg";
import StopLogo from "../svgs/stop_svg";
import RefreshLogo from "../svgs/refresh_svg";

import "../styles/Simulator.css";

interface ICpxState {
  pixels: number[][];
  brightness: number;
  red_led: boolean;
  button_a: boolean;
  button_b: boolean;
  switch: boolean;
}

interface IState {
  cpx: ICpxState;
  play_button: boolean;
}
interface IMyProps {
  children?: any;
}

const DEFAULT_CPX_STATE: ICpxState = {
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

const sendMessage = (type: string, state: any) => {
  vscode.postMessage({ command: type, text: state });
};

class Simulator extends React.Component<any, IState> {
  constructor(props: IMyProps) {
    super(props);
    this.state = {
      cpx: DEFAULT_CPX_STATE,
      play_button: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.onKeyEvent = this.onKeyEvent.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.playSimulatorClick = this.playSimulatorClick.bind(this);
    this.refreshSimulatorClick = this.refreshSimulatorClick.bind(this);
  }

  handleMessage = (event: any): void => {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
      case "reset-state":
        console.log("Clearing the state");
        this.setState({
          ...this.state,
          cpx: DEFAULT_CPX_STATE,
          play_button: false
        });
        break;
      case "set-state":
        console.log("Setting the state: " + JSON.stringify(message.state));
        this.setState({ ...this.state, cpx: message.state, play_button: true });
        break;
      default:
        console.log("Invalid message received from the extension.");
        this.setState({ ...this.state, cpx: DEFAULT_CPX_STATE });
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
    const image = this.state.play_button ? StopLogo : PlayLogo;
    return (
      <div className="simulator">
        <div>
          <Cpx
            pixels={this.state.cpx.pixels}
            brightness={this.state.cpx.brightness}
            red_led={this.state.cpx.red_led}
            switch={this.state.cpx.switch}
            on={this.state.play_button}
            onKeyEvent={this.onKeyEvent}
            onMouseUp={this.onMouseUp}
            onMouseDown={this.onMouseDown}
            onMouseLeave={this.onMouseLeave}
          />
        </div>
        <div className="buttons">
          <Button
            onClick={this.playSimulatorClick}
            image={image}
            on={this.state.play_button}
            label="play"
          />
          <Button
            onClick={this.refreshSimulatorClick}
            image={RefreshLogo}
            on={false}
            label="refresh"
          />
        </div>
      </div>
    );
  }

  protected playSimulatorClick() {
    this.setState({ ...this.state, play_button: !this.state.play_button });
    sendMessage("play-simulator", !this.state.play_button);
    const button =
      window.document.getElementById(CONSTANTS.CLASS_NAME.PLAY_BUTTON) ||
      window.document.getElementById(CONSTANTS.CLASS_NAME.STOP_BUTTON);
    if (button) {
      button.focus();
    }
  }

  protected refreshSimulatorClick() {
    sendMessage("refresh-simulator", true);
    const button = window.document.getElementById(
      CONSTANTS.CLASS_NAME.REFRESH_BUTTON
    );
    if (button) {
      button.focus();
    }
  }

  protected onKeyEvent(event: KeyboardEvent, active: boolean) {
    let button;
    const target = event.target as SVGElement;
    // Guard Clause
    if (target === undefined) {
      return;
    }
    console.log("event", event);
    if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)) {
      button = window.document.getElementById(target.id);
    } else if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.A)) {
      button = window.document.getElementById(CONSTANTS.CLASS_NAME.BUTTON_A);
    } else if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.B)) {
      button = window.document.getElementById(CONSTANTS.CLASS_NAME.BUTTON_B);
    } else if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.S)) {
      button = window.document.getElementById(CONSTANTS.CLASS_NAME.SWITCH);
    } else if (event.key === CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) {
      this.playSimulatorClick();
    } else if (event.key === CONSTANTS.KEYBOARD_KEYS.CAPITAL_R) {
      this.refreshSimulatorClick();
    }

    if (button) {
      event.preventDefault();
      this.handleClick(button, active);
      button.focus();
    }
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
    let newState;
    if (button.id.includes("BTN")) {
      newState = this.handleButtonClick(button, active);
    } else if (button.id.includes("SWITCH")) {
      newState = this.handleSwitchClick();
    } else {
      return;
    }

    if (newState) {
      sendMessage("button-press", newState);
    }
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
      this.setState({ ...this.state, ...newState });
    } else if (ButtonA) {
      innerButton = window.document.getElementById("BTN_A_INNER");
      newState = {
        button_a: active
      };
      this.setState({ ...this.state, ...newState });
    } else if (ButtonB) {
      innerButton = window.document.getElementById("BTN_B_INNER");
      newState = {
        button_b: active
      };
      this.setState({ ...this.state, ...newState });
    }

    if (innerButton) {
      innerButton.style.fill = this.getButtonColor(active);
    }

    button.setAttribute("pressed", `${active}`);
    return newState;
  }

  private getButtonColor(pressed: boolean) {
    const buttonUps = BUTTON_NEUTRAL;
    const buttonDown = BUTTON_PRESSED;
    return pressed ? buttonDown : buttonUps;
  }

  private handleSwitchClick() {
    let cpxState = this.state.cpx;
    const switchIsOn: boolean = !this.state.cpx.switch;
    updateSwitch(switchIsOn);
    cpxState = { ...cpxState, switch: switchIsOn };
    this.setState({ ...this.state, ...cpxState });
    return { switch: switchIsOn };
  }
}

export default Simulator;
