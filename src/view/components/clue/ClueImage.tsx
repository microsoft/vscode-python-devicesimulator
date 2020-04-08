// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { BUTTON_CLASSNAME, VIEW_STATE } from "../../constants";
import CONSTANTS, { BUTTON_STYLING_CLASSES } from "../../constants";
import { ViewStateContext } from "../../context";
import { ClueSvg, IRefObject } from "./Clue_svg";

interface EventTriggers {
    onMouseUp: (event: Event, buttonKey: string) => void;
    onMouseDown: (event: Event, buttonKey: string) => void;
    onMouseLeave: (event: Event, buttonKey: string) => void;
    onKeyEvent: (event: KeyboardEvent, active: boolean, key: string) => void;
}
interface IProps {
    eventTriggers: EventTriggers;
    displayMessage: string;
    neopixel: number[];
}

export enum BUTTONS_KEYS {
    BTN_A = "BTN_A",
    BTN_B = "BTN_B",
    BTN_AB = "BTN_AB",
}
// Displays the SVG and call necessary svg modification.
export class ClueImage extends React.Component<IProps, {}> {
    private svgRef: React.RefObject<ClueSvg> = React.createRef();
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount() {
        const svgElement = this.svgRef.current;
        if (svgElement) {
            setupAllButtons(this.props.eventTriggers, svgElement.getButtons());
            this.setupKeyPresses(this.props.eventTriggers.onKeyEvent);
        }
    }
    componentDidUpdate() {
        if (this.svgRef.current) {
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
        window.document.removeEventListener("keydown", this.handleKeyDown);
        window.document.removeEventListener("keyup", this.handleKeyUp);
    }
    setupKeyPresses = (
        onKeyEvent: (event: KeyboardEvent, active: boolean, key: string) => void
    ) => {
        window.document.addEventListener("keydown", this.handleKeyDown);
        window.document.addEventListener("keyup", this.handleKeyUp);
    };
    handleKeyDown = (event: KeyboardEvent) => {
        const keyEvents = [event.key, event.code];
        // Don't listen to keydown events for the run button, restart button and enter key
        if (
            !(
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.CAPITAL_R) ||
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
        return (
            <ClueSvg
                ref={this.svgRef}
                displayImage={this.props.displayMessage}
                neopixel={this.props.neopixel}
            />
        );
    }
    public updateButtonAttributes(key: BUTTONS_KEYS, isActive: boolean) {
        if (this.svgRef.current) {
            const button = this.svgRef.current.getButtons()[key].current;
            if (button) {
                button.focus();
                if (isActive) {
                    button.children[0].setAttribute(
                        "class",
                        BUTTON_STYLING_CLASSES.KEYPRESSED
                    );
                } else {
                    button.children[0].setAttribute(
                        "class",
                        BUTTON_STYLING_CLASSES.DEFAULT
                    );
                }
                button.setAttribute("pressed", `${isActive}`);
                button.setAttribute("aria-pressed", `${isActive}`);
            }
        }
    }
}

ClueImage.contextType = ViewStateContext;
const setupButton = (
    buttonElement: SVGRectElement,
    eventTriggers: EventTriggers,
    key: string
) => {
    buttonElement.setAttribute("class", BUTTON_CLASSNAME.ACTIVE);
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
        // ensure that the keydown is enter,
        // or else it may register shortcuts twice
        if (e.key === CONSTANTS.KEYBOARD_KEYS.ENTER) {
            eventTriggers.onKeyEvent(e, true, key);
        }
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
            ref.current.onkeydown = null;
            ref.current.onkeyup = null;
            ref.current.setAttribute("class", BUTTON_CLASSNAME.DEACTIVATED);
        }
    }
};
