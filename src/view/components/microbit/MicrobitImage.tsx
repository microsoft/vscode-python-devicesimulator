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
    onKeyEvent: (event: KeyboardEvent, active: boolean, key: string) => void;
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
            this.setupKeyPresses(this.props.eventTriggers.onKeyEvent);
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
    componentWillUnmount() {
        window.document.removeEventListener("keydown", this.handleKeyUp);
        window.document.removeEventListener("keyup", this.handleKeyUp);
    }
    setupKeyPresses = (
        onKeyEvent: (event: KeyboardEvent, active: boolean, key: string) => void
    ) => {
        window.document.addEventListener("keydown", this.handleKeyUp);
        window.document.addEventListener("keyup", this.handleKeyDown);
    };
    handleKeyDown = (event: KeyboardEvent) => {
        const keyEvents = [event.key, event.code];
        // Don't listen to keydown events for the switch, run button and enter key
        if (
            !(
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.S) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.ENTER)
            )
        ) {
            this.props.eventTriggers.onKeyEvent(event, true, event.key);
        }
    };
    handleKeyUp = (event: KeyboardEvent) => {
        this.props.eventTriggers.onKeyEvent(event, false, event.key);
    };
    render() {
        return <MicrobitSvg ref={this.svgRef} />;
    }
    public updateButtonAttributes(key: BUTTONS_KEYS, isActive: boolean) {
        if (this.svgRef.current) {
            const button = this.svgRef.current.getButtons()[key].current;
            if (button) {
                button.focus();
                if (isActive) {
                    button.children[0].setAttribute(
                        "class",
                        MICROBIT_BUTTONS_CLASSES.KEYPRESSED
                    );
                } else {
                    button.children[0].setAttribute(
                        "class",
                        MICROBIT_BUTTONS_CLASSES.DEFAULT
                    );
                }
                button.setAttribute("pressed", `${isActive}`);
                button.setAttribute("aria-pressed", `${isActive}`);
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
    buttonElement.onmousedown = e => {
        buttonElement.focus();
        eventTriggers.onMouseDown(e, key);
    };
    buttonElement.onmouseup = e => {
        eventTriggers.onMouseUp(e, key);
    };
    buttonElement.onmouseleave = e => {
        eventTriggers.onMouseLeave(e, key);
    };
    buttonElement.onkeydown = e => {
        eventTriggers.onKeyEvent(e, true, key);
    };
    buttonElement.onkeyup = e => {
        eventTriggers.onKeyEvent(e, false, key);
    };
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
