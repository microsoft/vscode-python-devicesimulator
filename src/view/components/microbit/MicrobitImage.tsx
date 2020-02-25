// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Microbit.css";
import { MicrobitSvg, IRefObject } from "./Microbit_svg";
import { ViewStateContext } from "../../context";
import { VIEW_STATE } from "../../constants";

interface EventTriggers {
    onMouseUp: (event: Event, buttonKey: string) => void;
    onMouseDown: (event: Event, buttonKey: string) => void;
    onMouseLeave: (event: Event, buttonKey: string) => void;
}
interface IProps {
    eventTriggers: EventTriggers;
    leds: number[][];
}

const BUTTON_CLASSNAME = {
    ACTIVE: "sim-button-outer",
    DEACTIVATED: "sim-button-deactivated",
};

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
            if (this.context === VIEW_STATE.PAUSE) {
                disableAllButtons(this.svgRef.current.getButtons());
            } else if (this.context === VIEW_STATE.RUNNING) {
                setupAllButtons(
                    this.props.eventTriggers,
                    this.svgRef.current.getButtons()
                );
            }
        }
    }
    render() {
        return <MicrobitSvg ref={this.svgRef} />;
    }
}

MicrobitImage.contextType = ViewStateContext;
const setupButton = (
    buttonElement: SVGRectElement,
    eventTriggers: EventTriggers,
    key: string
) => {
    buttonElement.setAttribute("class", BUTTON_CLASSNAME.ACTIVE);
    buttonElement.onmousedown = e => {
        eventTriggers.onMouseDown(e, key);
    };
    buttonElement.onmouseup = e => {
        eventTriggers.onMouseUp(e, key);
    };
    buttonElement.onmouseleave = e => {
        eventTriggers.onMouseLeave(e, key);
    };
    console.log("buttons should be enabled");
};
const setupAllButtons = (
    eventTriggers: EventTriggers,
    buttonRefs: IRefObject
) => {
    for (const [key, ref] of Object.entries(buttonRefs)) {
        if (ref.current) {
            setupButton(ref.current, eventTriggers, key);
        }
    }
};
const disableAllButtons = (buttonRefs: IRefObject) => {
    for (const [, ref] of Object.entries(buttonRefs)) {
        if (ref.current) {
            // to implement
            ref.current.onmousedown = null;
            ref.current.onmouseup = null;
            ref.current.onmouseleave = null;
            ref.current.setAttribute("class", BUTTON_CLASSNAME.DEACTIVATED);
            console.log("buttons should be disabled");
        }
    }
};
const updateAllLeds = (
    leds: number[][],
    ledRefs: Array<Array<React.RefObject<SVGRectElement>>>
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
