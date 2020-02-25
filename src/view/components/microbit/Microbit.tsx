// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { MICROBIT_TOOLBAR_ID } from "../../components/toolbar/SensorModalUtils";
import { SENSOR_LIST, VSCODE_MESSAGES_TO_WEBVIEW } from "../../constants";
import "../../styles/Simulator.css";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import ToolBar from "../toolbar/ToolBar";
import { MicrobitSimulator } from "./MicrobitSimulator";

// Component grouping the functionality for micro:bit functionalities
interface IState {
    sensors: { [key: string]: number };
}
const DEFAULT_STATE = {
    sensors: {
        [SENSOR_LIST.TEMPERATURE]: 0,
        [SENSOR_LIST.LIGHT]: 0,
        [SENSOR_LIST.MOTION_X]: 0,
        [SENSOR_LIST.MOTION_Y]: 0,
        [SENSOR_LIST.MOTION_Z]: 0,
    },
};

export class Microbit extends React.Component<{}, IState> {
    state = DEFAULT_STATE;

    componentDidMount() {
        window.addEventListener("message", this.handleMessage);
    }

    componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        window.removeEventListener("message", this.handleMessage);
    }
    handleMessage = (event: any): void => {
        const message = event.data;

        switch (message.command) {
            case VSCODE_MESSAGES_TO_WEBVIEW.RESET:
                this.setState({ ...DEFAULT_STATE });
                break;
        }
    };
    render() {
        return (
            <React.Fragment>
                <MicrobitSimulator />
                <ToolBar
                    buttonList={MICROBIT_TOOLBAR_BUTTONS}
                    onUpdateSensor={this.updateSensor}
                    sensorValues={this.state.sensors}
                />
            </React.Fragment>
        );
    }
    updateSensor = (sensor: SENSOR_LIST, value: number) => {
        this.setState({ sensors: { ...this.state.sensors, [sensor]: value } });
    };
}

const MICROBIT_TOOLBAR_BUTTONS: Array<{ label: string; image: JSX.Element }> = [
    {
        image: TOOLBAR_SVG.PUSH_BUTTON_SVG,
        label: MICROBIT_TOOLBAR_ID.PUSH_BUTTON,
    },
    {
        image: TOOLBAR_SVG.RED_LED_SVG,
        label: MICROBIT_TOOLBAR_ID.LEDS,
    },
    {
        image: TOOLBAR_SVG.TEMPERATURE_SVG,
        label: MICROBIT_TOOLBAR_ID.TEMPERATURE,
    },
    {
        image: TOOLBAR_SVG.LIGHT_SVG,
        label: MICROBIT_TOOLBAR_ID.LIGHT,
    },
    {
        image: TOOLBAR_SVG.MOTION_SVG,
        label: MICROBIT_TOOLBAR_ID.ACCELEROMETER,
    },
];
