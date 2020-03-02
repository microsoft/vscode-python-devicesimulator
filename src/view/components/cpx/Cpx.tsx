// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { CPX_TOOLBAR_ICON_ID } from "../../components/toolbar/SensorModalUtils";
import ToolBar from "../../components/toolbar/ToolBar";
import { SENSOR_LIST, VSCODE_MESSAGES_TO_WEBVIEW } from "../../constants";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import Simulator from "./CpxSimulator";

// Component grouping the functionality for circuit playground express
const DEFAULT_STATE = {
    sensors: {
        [SENSOR_LIST.TEMPERATURE]: 0,
        [SENSOR_LIST.LIGHT]: 0,
        [SENSOR_LIST.MOTION_X]: 0,
        [SENSOR_LIST.MOTION_Y]: 0,
        [SENSOR_LIST.MOTION_Z]: 0,
    },
};

export class Cpx extends React.Component {
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
                <Simulator />
                <ToolBar
                    buttonList={CPX_TOOLBAR_BUTTONS}
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

const CPX_TOOLBAR_BUTTONS: Array<{ label: any; image: any }> = [
    {
        image: TOOLBAR_SVG.SLIDER_SWITCH_SVG,
        label: CPX_TOOLBAR_ICON_ID.SWITCH,
    },
    {
        image: TOOLBAR_SVG.PUSH_BUTTON_SVG,
        label: CPX_TOOLBAR_ICON_ID.PUSH_BUTTON,
    },
    {
        image: TOOLBAR_SVG.RED_LED_SVG,
        label: CPX_TOOLBAR_ICON_ID.RED_LED,
    },
    {
        image: TOOLBAR_SVG.SOUND_SVG,
        label: CPX_TOOLBAR_ICON_ID.SOUND,
    },
    {
        image: TOOLBAR_SVG.TEMPERATURE_SVG,
        label: CPX_TOOLBAR_ICON_ID.TEMPERATURE,
    },
    {
        image: TOOLBAR_SVG.LIGHT_SVG,
        label: CPX_TOOLBAR_ICON_ID.LIGHT,
    },
    {
        image: TOOLBAR_SVG.NEO_PIXEL_SVG,
        label: CPX_TOOLBAR_ICON_ID.NEO_PIXEL,
    },
    {
        image: TOOLBAR_SVG.SPEAKER_SVG,
        label: CPX_TOOLBAR_ICON_ID.SPEAKER,
    },
    {
        image: TOOLBAR_SVG.MOTION_SVG,
        label: CPX_TOOLBAR_ICON_ID.MOTION,
    },
    {
        image: TOOLBAR_SVG.IR_SVG,
        label: CPX_TOOLBAR_ICON_ID.IR,
    },
    {
        image: TOOLBAR_SVG.GPIO_SVG,
        label: CPX_TOOLBAR_ICON_ID.GPIO,
    },
];
