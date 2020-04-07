// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { CONSTANTS, SENSOR_LIST, WEBVIEW_MESSAGES } from "../../../constants";
import "../../../styles/MotionSensorBar.css";
import { sendMessage } from "../../../utils/MessageUtils";
import { ISensorProps, ISliderProps } from "../../../viewUtils";
import svg from "../../cpx/Svg_utils";
import SensorButton from "../SensorButton";
import { GenericSliderComponent } from "../GenericSliderComponent";

const MOTION_SLIDER_PROPS_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Right",
    maxValue: 78,
    minLabel: "Left",
    minValue: -78,
    type: SENSOR_LIST.MOTION_X,
};
const MOTION_SLIDER_PROPS_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Front",
    maxValue: 78,
    minLabel: "Back",
    minValue: -78,
    type: SENSOR_LIST.MOTION_Y,
};
const MOTION_SLIDER_PROPS_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Down",
    maxValue: 78,
    minLabel: "Up",
    minValue: -78,
    type: SENSOR_LIST.MOTION_Z,
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
interface IProps {
    axisValues: {
        X: number;
        Y: number;
        Z: number;
    };
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void;
}

class MotionSensorBar extends React.Component<IProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="MotionSensorBar">
                <div className="sensor-button-container">
                    <SensorButton
                        label="Shake"
                        type="shake"
                        onMouseUp={this.onMouseUp}
                        onMouseDown={this.onMouseDown}
                        onKeyUp={this.onKeyUp}
                        onKeyDown={this.onKeyDown}
                    />
                </div>
                <br />
                <GenericSliderComponent
                    axisProperties={MOTION_SENSOR_PROPERTIES}
                    onUpdateValue={this.props.onUpdateValue}
                    axisValues={this.props.axisValues}
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
        sendMessage(WEBVIEW_MESSAGES.SENSOR_CHANGED, messageState);
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
