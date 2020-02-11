// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Microbit.css";
import { MicrobitSvg } from "./Microbit_svg";

interface EventTriggers {
    onMouseUp: (event: Event, buttonKey: string) => void;
    onMouseDown: (event: Event, buttonKey: string) => void;
    onMouseLeave: (event: Event, buttonKey: string) => void;
}
interface IProps {
    eventTriggers: EventTriggers;
    leds: number[][];
}

// Displays the SVG and call necessary svg modification.
export class MicrobitImage extends React.Component<IProps, {}> {
    private svgRef: React.RefObject<MicrobitSvg> = React.createRef();
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount() {
        const svgElement = this.svgRef.current;
        if (svgElement) {
            updateAllLeds(this.props.leds, svgElement.getLeds());
            setupAllButtons(this.props.eventTriggers, svgElement.getButtons());
        }
    }
    componentDidUpdate() {
        if (this.svgRef.current) {
            updateAllLeds(this.props.leds, this.svgRef.current.getLeds());
        }
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
        eventTriggers.onMouseDown(e, key);
    };
    buttonElement.onmouseup = e => {
        eventTriggers.onMouseUp(e, key);
    };
    buttonElement.onmouseleave = e => {
        eventTriggers.onMouseLeave(e, key);
    };
};
const setupAllButtons = (eventTriggers: EventTriggers, buttonRefs: Object) => {
    for (const [key, ref] of Object.entries(buttonRefs)) {
        if (ref.current) {
            setupButton(ref.current, eventTriggers, key);
        }
    }
};
const updateAllLeds = (
    leds: number[][],
    ledRefs: Array<React.RefObject<SVGRectElement>>[]
) => {
    for (let j = 0; j < leds.length; j++) {
        for (let i = 0; i < leds[0].length; i++) {
            const ledElement = ledRefs[j][i].current;
            if (ledElement) {
                setupLed(ledElement, leds[i][j]);
            }
        }
    }
};
const setupLed = (ledElement: SVGRectElement, brightness: number) => {
    ledElement.style.opacity = (brightness / 10).toString();
};
