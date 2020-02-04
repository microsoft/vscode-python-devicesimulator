// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Microbit.css";
import { MICROBIT_SVG } from "./Microbit_svg";

interface EventTriggers {
    onMouseUp: (button: HTMLElement, event: Event) => void;
    onMouseDown: (button: HTMLElement, event: Event) => void;
    onMouseLeave: (button: HTMLElement, event: Event) => void;
}
interface IProps {
    eventTriggers: EventTriggers;
    leds: number[][];
}

// Displays the SVG and call necessary svg modification.
export class MicrobitImage extends React.Component<IProps, any> {
    componentDidMount() {
        const svgElement = window.document.getElementById("microbit_svg");
        if (svgElement) {
            setupAllButtons(this.props.eventTriggers);
            updateAllLeds(this.props.leds);
        }
    }
    componentDidUpdate() {
        updateAllLeds(this.props.leds);
    }
    render() {
        return MICROBIT_SVG;
    }
}
const setupButton = (
    buttonElement: HTMLElement,
    eventTriggers: EventTriggers
) => {
    buttonElement.onmousedown = e => {
        eventTriggers.onMouseDown(buttonElement, e);
    };
    buttonElement.onmouseup = e => {
        eventTriggers.onMouseUp(buttonElement, e);
    };

    buttonElement.onmouseleave = e => {
        eventTriggers.onMouseLeave(buttonElement, e);
    };
};
const setupAllButtons = (eventTriggers: EventTriggers) => {
    const buttonsId = ["BTN_A_OUTER", "BTN_B_OUTER", "BTN_AB_OUTER"];
    buttonsId.forEach(buttonId => {
        const buttonElement = window.document.getElementById(buttonId);
        if (buttonElement) {
            setupButton(buttonElement, eventTriggers);
        }
    });
};
const updateAllLeds = (leds: number[][]) => {
    for (let j = 0; j < leds.length; j++) {
        for (let i = 0; i < leds[0].length; i++) {
            const ledElement = document.getElementById(`LED-${j}-${i}`);
            if (ledElement) {
                setupLed(ledElement, leds[i][j]);
            }
        }
    }
};
const setupLed = (ledElement: HTMLElement, brightness: number) => {
    ledElement.style.opacity = (brightness / 10).toString();
};
