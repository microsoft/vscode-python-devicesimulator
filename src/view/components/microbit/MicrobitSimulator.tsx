import * as React from "react";
import CONSTANTS, {
    WEBVIEW_MESSAGES,
    MICROBIT_BUTTONS_KEYS,
    DEVICE_LIST_KEY,
} from "../../constants";
import PlayLogo from "../../svgs/play_svg";
import StopLogo from "../../svgs/stop_svg";
import { sendMessage } from "../../utils/MessageUtils";
import Dropdown from "../Dropdown";
import ActionBar from "../simulator/ActionBar";
import { MicrobitImage } from "./MicrobitImage";

const DEFAULT_MICROBIT_STATE: IMicrobitState = {
    leds: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    buttons: { button_a: false, button_b: false },
};

interface IState {
    active_editors: string[];
    running_file: string;
    play_button: boolean;
    selected_file: string;
    microbit: IMicrobitState;
}

interface IMicrobitState {
    leds: number[][];
    buttons: { button_a: boolean; button_b: boolean };
}
export class MicrobitSimulator extends React.Component<any, IState> {
    constructor() {
        super({});
        this.state = {
            microbit: DEFAULT_MICROBIT_STATE,
            play_button: false,
            selected_file: "",
            active_editors: [],
            running_file: "",
        };
    }
    handleMessage = (event: any): void => {
        const message = event.data;

        switch (message.command) {
            case "reset-state":
                this.setState({
                    microbit: DEFAULT_MICROBIT_STATE,
                    play_button: false,
                });
                break;
            case "set-state":
                this.setState({
                    microbit: {
                        ...this.state.microbit,
                        leds: message.state.leds,
                    },
                });
                break;
            case "activate-play":
                this.setState({
                    play_button: !this.state.play_button,
                });
                break;
            case "visible-editors":
                this.setState({
                    active_editors: message.state.activePythonEditors,
                });
                break;
            case "current-file":
                this.setState({
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
                        onBlur={this.onSelectFile}
                    />
                </div>
                <div className="microbit-container">
                    <MicrobitImage
                        eventTriggers={{
                            onMouseDown: this.onMouseDown,
                            onMouseUp: this.onMouseUp,
                            onMouseLeave: this.onMouseLeave,
                        }}
                        leds={this.state.microbit.leds}
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
        sendMessage(WEBVIEW_MESSAGES.TOGGLE_PLAY_STOP, {
            active_device: CONSTANTS.DEVICE_NAME.MICROBIT,
            selected_file: this.state.selected_file,
            state: !this.state.play_button,
        });
    };
    protected onSelectFile(event: React.FocusEvent<HTMLSelectElement>) {
        this.setState({
            selected_file: event.currentTarget.value,
        });
    }
    protected refreshSimulatorClick = () => {
        sendMessage(WEBVIEW_MESSAGES.REFRESH_SIMULATOR, true);
    };
    protected handleButtonClick = (key: string, isActive: boolean) => {
        let newButtonState = this.state.microbit.buttons;
        switch (key) {
            case MICROBIT_BUTTONS_KEYS.BTN_A:
                newButtonState.button_a = isActive;
                break;
            case MICROBIT_BUTTONS_KEYS.BTN_B:
                newButtonState.button_b = isActive;
                break;
            case MICROBIT_BUTTONS_KEYS.BTN_AB:
                newButtonState = {
                    button_a: isActive,
                    button_b: isActive,
                };
                break;
        }
        sendMessage(WEBVIEW_MESSAGES.BUTTON_PRESS, {
            active_device: DEVICE_LIST_KEY.MICROBIT,
            state: newButtonState,
        });
        this.setState({
            microbit: {
                ...this.state.microbit,
                buttons: newButtonState,
            },
        });
    };
    protected onMouseUp = (button: HTMLElement, event: Event, key: string) => {
        event.preventDefault();
        this.handleButtonClick(key, false);
    };
    protected onMouseDown(button: HTMLElement, event: Event, key: string) {
        event.preventDefault();
        this.handleButtonClick(key, true);
    }

    protected onMouseLeave(button: HTMLElement, event: Event, key: string) {
        event.preventDefault();
        console.log(`To implement onMouseLeave ${key}`);
    }
}
