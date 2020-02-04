import * as React from "react";
import { MicrobitImage } from "./MicrobitImage";

const initialLedState = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];
export class MicrobitSimulator extends React.Component<any, { leds: any }> {
    constructor() {
        super({});
        this.state = { leds: initialLedState };
    }
    handleMessage = (event: any): void => {
        const message = event.data;
        switch (message.command) {
            case "reset-state":
                console.log("Reset the state");
                this.setState({
                    leds: initialLedState,
                });
                break;
            case "set-state":
                console.log("Setting the state");
                this.setState({
                    leds: message.state.leds,
                });
                break;
        }
    };
    componentDidMount() {
        window.addEventListener("message", this.handleMessage);
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.handleMessage);
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
