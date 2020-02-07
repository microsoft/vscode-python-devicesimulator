// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Microbit.css";
import { MicrobitSvg } from "./Microbit_svg";
import { RefObject } from "office-ui-fabric-react";

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
    private svgRef: React.RefObject<MicrobitSvg> = React.createRef();
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount() {
        const svgElement = this.svgRef.current;
        if (svgElement) {
            updateAllLeds(this.props.leds);
            setupAllButtons(this.props.eventTriggers, svgElement.getButtons());
        }
    }
    componentDidUpdate() {
        updateAllLeds(this.props.leds);
    }
    render() {
        return <MicrobitSvg ref={this.svgRef} />;
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
