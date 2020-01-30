// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Microbit.css";
import { MICROBIT_SVG } from "./Microbit_svg";

interface IProps {}
export class MicrobitImage extends React.Component<IProps, any> {
    componentDidMount() {
        const svgElement = window.document.getElementById("microbit_svg");
        if (svgElement) {
            setupAllButtons();
        }
    }
    render() {
        return MICROBIT_SVG;
    }
}
const setupAllButtons = () => {
    const buttonsId = ["BTN_A_OUTER", "BTN_B_OUTER", "BTN_AB_OUTER"];
    buttonsId.forEach(buttonId => {
        const buttonElement = window.document.getElementById(buttonId);
        if (buttonElement) {
            setupButton(buttonElement);
        }
    });
};
const setupButton = (buttonElement: HTMLElement) => {
    buttonElement.onmousedown = e => {
        console.log(e);
    };
    buttonElement.onmouseup = e => console.log(e);
    buttonElement.onkeydown = e => console.log(e);
    buttonElement.onkeyup = e => console.log(e);
    buttonElement.onmouseleave = e => console.log(e);
};
