// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { TOOLBAR_ICON_ID } from "../../components/toolbar/SensorModalUtils";
import ToolBar from "../../components/toolbar/ToolBar";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import Simulator from "./CpxSimulator";

// Component grouping the functionality for circuit playground express

export class Cpx extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Simulator />
                <ToolBar buttonList={CPX_TOOLBAR_BUTTONS} />
            </React.Fragment>
        );
    }
}

const CPX_TOOLBAR_BUTTONS: Array<{ label: any; image: any }> = [
    {
        image: TOOLBAR_SVG.SLIDER_SWITCH_SVG,
        label: TOOLBAR_ICON_ID.SWITCH,
    },
    {
        image: TOOLBAR_SVG.PUSH_BUTTON_SVG,
        label: TOOLBAR_ICON_ID.PUSH_BUTTON,
    },
    {
        image: TOOLBAR_SVG.RED_LED_SVG,
        label: TOOLBAR_ICON_ID.RED_LED,
    },
    {
        image: TOOLBAR_SVG.SOUND_SVG,
        label: TOOLBAR_ICON_ID.SOUND,
    },
    {
        image: TOOLBAR_SVG.TEMPERATURE_SVG,
        label: TOOLBAR_ICON_ID.TEMPERATURE,
    },
    {
        image: TOOLBAR_SVG.LIGHT_SVG,
        label: TOOLBAR_ICON_ID.LIGHT,
    },
    {
        image: TOOLBAR_SVG.NEO_PIXEL_SVG,
        label: TOOLBAR_ICON_ID.NEO_PIXEL,
    },
    {
        image: TOOLBAR_SVG.SPEAKER_SVG,
        label: TOOLBAR_ICON_ID.SPEAKER,
    },
    {
        image: TOOLBAR_SVG.MOTION_SVG,
        label: TOOLBAR_ICON_ID.MOTION,
    },
    {
        image: TOOLBAR_SVG.IR_SVG,
        label: TOOLBAR_ICON_ID.IR,
    },
    {
        image: TOOLBAR_SVG.GPIO_SVG,
        label: TOOLBAR_ICON_ID.GPIO,
    },
];
