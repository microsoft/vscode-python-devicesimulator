// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { BUTTON_NEUTRAL, BUTTON_PRESSED } from "./cpx/Cpx_svg_style";
import Cpx, { updateSwitch, updatePinTouch } from "./cpx/Cpx";
import Button from "./Button";
import { CONSTANTS } from "../constants";
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
  touch: boolean[];
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
  switch: false,
  touch: [false, false, false, false, false, false, false]
};

const SIMULATOR_BUTTON_WIDTH = 60;

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
    this.togglePlayClick = this.togglePlayClick.bind(this);
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
            onClick={this.togglePlayClick}
            image={image}
            styleLabel="play"
            label="play"
            width={SIMULATOR_BUTTON_WIDTH}
          />
          <Button
            onClick={this.refreshSimulatorClick}
            image={RefreshLogo}
            styleLabel="refresh"
            label="refresh"
            width={SIMULATOR_BUTTON_WIDTH}
          />
        </div>
      </div>
    );
  }

  protected togglePlayClick() {
    sendMessage("play-simulator", !this.state.play_button);
    this.setState({ ...this.state, play_button: !this.state.play_button });
    const button =
      window.document.getElementById(CONSTANTS.ID_NAME.PLAY_BUTTON) ||
      window.document.getElementById(CONSTANTS.ID_NAME.STOP_BUTTON);
    if (button) {
      button.focus();
    }
  }

  protected refreshSimulatorClick() {
    sendMessage("refresh-simulator", true);
    const button = window.document.getElementById(
      CONSTANTS.ID_NAME.REFRESH_BUTTON
    );
    if (button) {
      button.focus();
    }
  }

  protected onKeyEvent(event: KeyboardEvent, active: boolean) {
    let element;
    const target = event.target as SVGElement;
    // Guard Clause
    if (target === undefined) {
      return;
    }

    if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)) {
      element = window.document.getElementById(target.id);
    } else if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.A)) {
      element = window.document.getElementById(CONSTANTS.ID_NAME.BUTTON_A);
    } else if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.B)) {
      element = window.document.getElementById(CONSTANTS.ID_NAME.BUTTON_B);
    } else if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.S)) {
      element = window.document.getElementById(CONSTANTS.ID_NAME.SWITCH);
    } else if (event.key === CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) {
      this.togglePlayClick();
    } else if (event.key === CONSTANTS.KEYBOARD_KEYS.CAPITAL_R) {
      this.refreshSimulatorClick();
    } else {
      if (event.shiftKey) {
        switch (event.code) {
          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_ONE:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A1);
            break;

          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_TWO:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A2);
            break;

          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_THREE:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A3);
            break;

          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_FOUR:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A4);
            break;

          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_FIVE:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A5);
            break;

          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_SIX:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A6);
            break;

          case CONSTANTS.KEYBOARD_KEYS.NUMERIC_SEVEN:
            element = window.document.getElementById(CONSTANTS.ID_NAME.PIN_A7);
            break;
        }
      }
    }
    if (element) {
      event.preventDefault();
      this.handleClick(element, active);
      element.focus();
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

  private handleClick(element: HTMLElement, active: boolean) {
    let newState;
    let message;
    if (element.id.includes("BTN")) {
      newState = this.handleButtonClick(element, active);
      message = "button-press";
    } else if (element.id.includes("SWITCH")) {
      newState = this.handleSwitchClick();
      message = "button-press";
    } else if (element.id.includes("PIN")) {
      newState = this.handleTouchPinClick(element, active);
      message = "sensor-changed";
    } else {
      return;
    }

    if (newState && message) {
      sendMessage(message, newState);
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

  private handleTouchPinClick(pin: HTMLElement, active: boolean): any {
    let cpxState = this.state.cpx;
    const pinIndex = parseInt(pin.id.charAt(pin.id.length - 1)) - 1;
    let pinState = cpxState.touch;
    pinState[pinIndex] = active;
    cpxState = { ...cpxState, touch: pinState };
    this.setState({ ...this.state, ...cpxState });
    updatePinTouch(active, pin.id);
    return { touch: pinState };
  }
}

export default Simulator;
