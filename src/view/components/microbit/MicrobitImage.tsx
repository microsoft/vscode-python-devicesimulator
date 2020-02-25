// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { VIEW_STATE } from "../../constants";
import { ViewStateContext } from "../../context";
import CONSTANTS, { MICROBIT_BUTTONS_CLASSES } from "../../constants";
import "../../styles/Microbit.css";
import { IRefObject, MicrobitSvg } from "./Microbit_svg";

interface EventTriggers {
    onMouseUp: (event: Event, buttonKey: string) => void;
    onMouseDown: (event: Event, buttonKey: string) => void;
    onMouseLeave: (event: Event, buttonKey: string) => void;
    onKeyEvent: (event: KeyboardEvent, active: boolean) => void;
}
interface IProps {
    eventTriggers: EventTriggers;
    leds: number[][];
}

const BUTTON_CLASSNAME = {
    ACTIVE: "sim-button-outer",
    DEACTIVATED: "sim-button-deactivated",
};

export enum BUTTONS_KEYS {
    BTN_A = "BTN_A",
    BTN_B = "BTN_B",
    BTN_AB = "BTN_AB",
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
            setupKeyPresses(this.props.eventTriggers.onKeyEvent);
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
    public sendButtonEvent(key: BUTTONS_KEYS, isActive: boolean) {
        if (this.svgRef.current) {
            const button = this.svgRef.current.getButtons()[key].current;
            if (button) {
                if (isActive) {
                    button.dispatchEvent(new Event("mousedown"));
                    button.setAttribute(
                        "class",
                        MICROBIT_BUTTONS_CLASSES.KEYPRESSED
                    );
                    button.focus();
                    console.log(JSON.stringify(button.className));
                } else {
                    button.dispatchEvent(new Event("mouseup"));
                    button.setAttribute(
                        "class",
                        MICROBIT_BUTTONS_CLASSES.DEFAULT
                    );
                }
            }
        }
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
    buttonElement.setAttribute("focusable", "true");
    buttonElement.setAttribute("tabindex", "0");
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

const setupKeyPresses = (
    onKeyEvent: (event: KeyboardEvent, active: boolean) => void
) => {
    window.document.addEventListener("keydown", event => {
        const keyEvents = [event.key, event.code];
        // Don't listen to keydown events for the switch, run button and enter key
        if (
            !(
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.S) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.ENTER)
            )
        ) {
            onKeyEvent(event, true);
        }
    });
    window.document.addEventListener("keyup", event =>
        onKeyEvent(event, false)
    );
};
