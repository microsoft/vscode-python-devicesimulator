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
}

// Displays the SVG and call necessary svg modification.
export class MicrobitImage extends React.Component<IProps, any> {
    componentDidMount() {
        const svgElement = window.document.getElementById("microbit_svg");
        if (svgElement) {
            setupAllButtons(this.props.eventTriggers);
        }
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
