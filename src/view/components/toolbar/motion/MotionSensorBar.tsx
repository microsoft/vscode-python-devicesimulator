// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { CONSTANTS } from "../../../constants";
import "../../../styles/MotionSensorBar.css";
import { ISensorProps, ISliderProps } from "../../../viewUtils";
import svg from "../../cpx/Svg_utils";
import SensorButton from "../SensorButton";
import { ThreeDimensionSlider } from "./threeDimensionSlider/ThreeDimensionSlider";

interface vscode {
    postMessage(message: any): void;
}

declare const vscode: vscode;

const sendMessage = (state: any) => {
    vscode.postMessage({ command: "sensor-changed", text: state });
};

const MOTION_SLIDER_PROPS_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Right",
    maxValue: 78,
    minLabel: "Left",
    minValue: -78,
    type: "motion_x",
};
const MOTION_SLIDER_PROPS_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Front",
    maxValue: 78,
    minLabel: "Back",
    minValue: -78,
    type: "motion_y",
};
const MOTION_SLIDER_PROPS_Z: ISliderProps = {
    maxValue: 78,
    minValue: -78,
    minLabel: "Up",
    maxLabel: "Down",
    type: "motion_z",
    axisLabel: "Z",
};

const MOTION_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Motion sensor",
    sliderProps: [
        MOTION_SLIDER_PROPS_X,
        MOTION_SLIDER_PROPS_Y,
        MOTION_SLIDER_PROPS_Z,
    ],
    unitLabel: "Lux",
};

class MotionSensorBar extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="MotionSensorBar">
                <SensorButton
                    label="Shake"
                    type="shake"
                    onMouseUp={this.onMouseUp}
                    onMouseDown={this.onMouseDown}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                />
                <br />
                <ThreeDimensionSlider
                    axisProperties={MOTION_SENSOR_PROPERTIES}
                />
                <br />
            </div>
        );
    }

    private onMouseDown = (event: React.PointerEvent<HTMLButtonElement>) => {
        this.updateShakePress(true, event.currentTarget.id);
        this.handleOnclick(true, "shake");
    };

    private onKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) =>
        this.onKeyEvent(event, false);

    private onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) =>
        this.onKeyEvent(event, true);

    private onMouseUp = (event: React.PointerEvent<HTMLButtonElement>) => {
        this.updateShakePress(false, event.currentTarget.id);
        this.handleOnclick(false, "shake");
    };

    private handleOnclick = (active: boolean, type: string) => {
        const messageState = { [type]: active };
        sendMessage(messageState);
    };

    private onKeyEvent(
        event: React.KeyboardEvent<HTMLButtonElement>,
        active: boolean
    ) {
        if (
            [event.keyCode, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)
        ) {
            this.handleOnclick(active, "shake");
        }
    }

    private updateShakePress = (shakeState: boolean, id: string): void => {
        const svgElement = window.document.getElementById("cpx_svg");
        const buttonElement = window.document.getElementById(id);
        const cpxSvg: SVGElement = (svgElement as unknown) as SVGElement;

        if (svgElement && cpxSvg && buttonElement) {
            buttonElement.setAttribute("aria-pressed", shakeState.toString());
            shakeState
                ? svg.addClass(cpxSvg, "shake-pressed")
                : svg.removeClass(cpxSvg, "shake-pressed");
        }
    };
}

export default MotionSensorBar;
