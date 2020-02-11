// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { MICROBIT_TOOLBAR_ID } from "../../components/toolbar/SensorModalUtils";
import "../../styles/Simulator.css";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import ToolBar from "../toolbar/ToolBar";
import { MicrobitSimulator } from "./MicrobitSimulator";

// Component grouping the functionality for micro:bit functionalities

export class Microbit extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MicrobitSimulator />
                <ToolBar buttonList={MICROBIT_TOOLBAR_BUTTONS} />
            </React.Fragment>
        );
    }
}

const MICROBIT_TOOLBAR_BUTTONS: Array<{ label: string; image: JSX.Element }> = [
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
