import * as React from "react";
import { MicrobitImage } from "./MicrobitImage";

export class MicrobitSimulator extends React.Component<any, any> {
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
