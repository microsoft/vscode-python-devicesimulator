// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Microbit.css";
import { MICROBIT_SVG } from "./Microbit_svg";

interface EventTriggers {
    onMouseUp: (button: HTMLElement, event: Event, buttonKey: string) => void;
    onMouseDown: (button: HTMLElement, event: Event, buttonKey: string) => void;
    onMouseLeave: (
        button: HTMLElement,
        event: Event,
        buttonKey: string
    ) => void;
}
interface IProps {
    eventTriggers: EventTriggers;
    leds: number[][];
}
interface IState {
    microbitImageRef: React.RefObject<SVGSVGElement>;
    buttonRefs: { [key: string]: React.RefObject<SVGRectElement> };
}

// Displays the SVG and call necessary svg modification.
export class MicrobitImage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            microbitImageRef: React.createRef(),
            buttonRefs: {
                BTN_A: React.createRef(),
                BTN_B: React.createRef(),
                BTN_AB: React.createRef(),
            },
        };
    }
    componentDidMount() {
        const svgElement = this.state.microbitImageRef.current;
        if (svgElement) {
            updateAllLeds(this.props.leds);
            setupAllButtons(this.props.eventTriggers, this.state.buttonRefs);
        }
    }
    componentDidUpdate() {
        updateAllLeds(this.props.leds);
    }
    render() {
        return MICROBIT_SVG(this.state.microbitImageRef, this.state.buttonRefs);
    }
}
const setupButton = (
    buttonElement: HTMLElement,
    eventTriggers: EventTriggers,
    key: string
) => {
    buttonElement.onmousedown = e => {
        eventTriggers.onMouseDown(buttonElement, e, key);
    };
    buttonElement.onmouseup = e => {
        eventTriggers.onMouseUp(buttonElement, e, key);
    };
    buttonElement.onmouseleave = e => {
        eventTriggers.onMouseLeave(buttonElement, e, key);
    };
};
const setupAllButtons = (eventTriggers: EventTriggers, buttonRefs: Object) => {
    for (const [key, ref] of Object.entries(buttonRefs)) {
        setupButton(ref.current, eventTriggers, key);
    }
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
