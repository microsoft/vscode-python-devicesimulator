import * as React from "react";
import { MicrobitImage } from "./MicrobitImage";
import ActionBar from "../simulator/ActionBar";
import PlayLogo from "../../svgs/play_svg";
import StopLogo from "../../svgs/stop_svg";
import Dropdown from "../Dropdown";
import CONSTANTS from "../../constants";

const initialLedState = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

interface vscode {
    postMessage(message: any): void;
}

declare const vscode: vscode;

const sendMessage = (type: string, state: any) => {
    vscode.postMessage({ command: type, text: state });
};
interface IState {
    active_editors: string[];
    running_file: string;
    leds: number[][];
    play_button: boolean;
    selected_file: string;
}
export class MicrobitSimulator extends React.Component<any, IState> {
    constructor() {
        super({});
        this.state = {
            leds: initialLedState,
            play_button: false,
            selected_file: "",
            active_editors: [],
            running_file: "",
        };
        this.onSelectBlur = this.onSelectBlur.bind(this);
    }
    handleMessage = (event: any): void => {
        const message = event.data;
        if (message.active_device !== CONSTANTS.DEVICE_NAME.MICROBIT) {
            return;
        }

        switch (message.command) {
            case "reset-state":
                console.log("Reset the state");
                this.setState({
                    ...this.state,
                    leds: initialLedState,
                    play_button: false,
                });
                break;
            case "set-state":
                console.log("Setting the state");
                this.setState({
                    leds: message.state.leds,
                });
                break;
            case "activate-play":
                this.setState({
                    ...this.state,
                    play_button: !this.state.play_button,
                });
                break;
            case "visible-editors":
                console.log(
                    "Setting active editors",
                    message.state.activePythonEditors
                );
                this.setState({
                    ...this.state,
                    active_editors: message.state.activePythonEditors,
                });
                break;
            case "current-file":
                console.log("Setting current file", message.state.running_file);
                this.setState({
                    ...this.state,
                    running_file: message.state.running_file,
                });
                break;
            default:
                console.log("Invalid message received from the extension.");
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
        const playStopImage = this.state.play_button ? StopLogo : PlayLogo;

        return (
            <div className="simulator">
                <div className="file-selector">
                    <Dropdown
                        label={"file-dropdown"}
                        styleLabel={"dropdown"}
                        lastChosen={this.state.running_file}
                        width={300}
                        textOptions={this.state.active_editors}
                        onBlur={this.onSelectBlur}
                    />
                </div>
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
                <ActionBar
                    onTogglePlay={this.togglePlayClick}
                    onToggleRefresh={this.refreshSimulatorClick}
                    playStopImage={playStopImage}
                />
            </div>
        );
    }
    protected togglePlayClick = () => {
        sendMessage("play-simulator", {
            active_device: CONSTANTS.DEVICE_NAME.MICROBIT,
            selected_file: this.state.selected_file,
            state: !this.state.play_button,
        });
    };
    protected onSelectBlur(event: React.FocusEvent<HTMLSelectElement>) {
        this.setState({
            ...this.state,
            selected_file: event.currentTarget.value,
        });
    }
    protected refreshSimulatorClick = () => {
        sendMessage("refresh-simulator", true);
    };
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
