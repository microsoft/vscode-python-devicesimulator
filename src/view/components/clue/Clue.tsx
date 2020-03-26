// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { SENSOR_LIST, VSCODE_MESSAGES_TO_WEBVIEW } from "../../constants";
import "../../styles/Simulator.css";
import ToolBar from "../toolbar/ToolBar";
import { ClueSimulator } from "./ClueSimulator";

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

export class Clue extends React.Component<{}, IState> {
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
                <ClueSimulator />
                <ToolBar
                    buttonList={CLUE_TOOLBAR_BUTTONS}
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

const CLUE_TOOLBAR_BUTTONS: Array<{ label: string; image: JSX.Element }> = [
    // TODO: CLUE TOOLBAR
];
