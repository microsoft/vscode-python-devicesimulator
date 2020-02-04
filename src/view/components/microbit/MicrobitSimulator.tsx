import * as React from "react";
import { MicrobitImage } from "./MicrobitImage";

const initialLedState = [
    [0, 0, 8, 0, 8],
    [0, 0, 8, 0, 8],
    [0, 0, 8, 0, 8],
    [0, 0, 8, 0, 8],
    [0, 0, 8, 0, 8],
];
export class MicrobitSimulator extends React.Component<any, { leds: any }> {
    constructor() {
        super({});
        this.state = { leds: initialLedState };
    }

    render() {
        return (
            <div className="simulator">
                <div className="microbit-container">
                    <MicrobitImage
                        eventTriggers={{
                            onMouseDown: this.onMouseDown,
                            onMouseUp: this.onMouseUp,
                            onMouseLeave: this.onMouseLeave,
                        }}
                        leds={this.state.leds}
                    />
                </div>
                {/* Implement actionbar here */}
            </div>
        );
    }
    protected onMouseUp(button: HTMLElement, event: Event) {
        event.preventDefault();
        console.log("To implement onMouseUp");
    }
    protected onMouseDown(button: HTMLElement, event: Event) {
        event.preventDefault();
        console.log("To implement onMouseDown");
    }
    protected onMouseLeave(button: HTMLElement, event: Event) {
        event.preventDefault();
        console.log("To implement onMouseLeave");
    }
}
