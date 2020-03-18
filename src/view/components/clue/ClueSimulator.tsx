import * as React from "react";
import {
    CONSTANTS,
    // DEVICE_LIST_KEY,
    MICROBIT_BUTTONS_KEYS,
    WEBVIEW_MESSAGES,
} from "../../constants";
import PlayLogo from "../../svgs/play_svg";
import StopLogo from "../../svgs/stop_svg";
import { sendMessage } from "../../utils/MessageUtils";
import Dropdown from "../Dropdown";
import ActionBar from "../simulator/ActionBar";
import { BUTTONS_KEYS, ClueImage } from "./ClueImage";

// import * as fs from "fs";

const DEFAULT_CLUE_STATE: IMicrobitState = {
    leds: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    buttons: { button_a: false, button_b: false },
    displayMessage: "",
};

interface IState {
    active_editors: string[];
    running_file: string;
    play_button: boolean;
    selected_file: string;
    clue: IMicrobitState;
}

interface IMicrobitState {
    leds: number[][];
    buttons: { button_a: boolean; button_b: boolean };
    displayMessage: string;
}
export class MicrobitSimulator extends React.Component<any, IState> {
    private imageRef: React.RefObject<ClueImage> = React.createRef();
    constructor() {
        super({});
        this.state = {
            clue: DEFAULT_CLUE_STATE,
            play_button: false,
            selected_file: "",
            active_editors: [],
            running_file: "",
        };
        this.onKeyEvent = this.onKeyEvent.bind(this);
    }
    handleMessage = (event: any): void => {
        const message = event.data;
        console.log("oowoo")
        // if (message.active_device !== DEVICE_LIST_KEY.MICROBIT) {
        //     return;
        // }

        switch (message.command) {
            case "reset-state":
                this.setState({
                    clue: DEFAULT_CLUE_STATE,
                    play_button: false,
                });
                break;
            case "set-state":
                console.log("uwu")

                // fs.writeFile('C:\\Users\\t-anmah\\Documents\\python_ds_2\\src\\output2.txt', `process output: ${message}`, function (err) {
                //     if (err) {
                //         return console.error(err);
                //     }
                //     console.log("File created!");
                // });
                // const uwu = "str \
                // ing"

                this.setState({
                    clue: {
                        ...this.state.clue,
                        displayMessage: message.state.display_base64,
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
        const playStopLabel = this.state.play_button ? "stop" : "play";
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
                    <ClueImage
                        ref={this.imageRef}
                        eventTriggers={{
                            onMouseDown: this.onMouseDown,
                            onMouseUp: this.onMouseUp,
                            onMouseLeave: this.onMouseLeave,
                            onKeyEvent: this.onKeyEvent,
                        }}
                        leds={this.state.clue.leds}
                        displayMessage={this.state.clue.displayMessage}
                    />
                </div>
                <ActionBar
                    onTogglePlay={this.togglePlayClick}
                    onToggleRefresh={this.refreshSimulatorClick}
                    playStopImage={playStopImage}
                    playStopLabel={playStopLabel}
                />
            </div>
        );
    }
    protected togglePlayClick = () => {
        const button =
            window.document.getElementById(CONSTANTS.ID_NAME.PLAY_BUTTON) ||
            window.document.getElementById(CONSTANTS.ID_NAME.STOP_BUTTON);
        if (button) {
            button.focus();
        }
        sendMessage(WEBVIEW_MESSAGES.TOGGLE_PLAY_STOP, {
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
        const button = window.document.getElementById(
            CONSTANTS.ID_NAME.REFRESH_BUTTON
        );
        if (button) {
            button.focus();
        }
        sendMessage(WEBVIEW_MESSAGES.REFRESH_SIMULATOR, true);
    };
    protected handleButtonClick = (key: string, isActive: boolean) => {
        let newButtonState = this.state.clue.buttons;
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
        sendMessage(WEBVIEW_MESSAGES.BUTTON_PRESS, newButtonState);
        this.setState({
            clue: {
                ...this.state.clue,
                buttons: newButtonState,
            },
        });
    };
    protected onMouseUp = (event: Event, key: string) => {
        event.preventDefault();
        this.handleButtonClick(key, false);
    };
    protected onMouseDown = (event: Event, key: string) => {
        event.preventDefault();
        this.handleButtonClick(key, true);
    };
    protected onMouseLeave = (event: Event, key: string) => {
        event.preventDefault();
        console.log(`To implement onMouseLeave ${key}`);
    };
    protected onKeyEvent(event: KeyboardEvent, active: boolean, key: string) {
        event.stopPropagation();
        if ([event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER)) {
            this.handleButtonClick(key, active);
            if (this.imageRef.current) {
                if (key === BUTTONS_KEYS.BTN_A) {
                    this.imageRef.current.updateButtonAttributes(
                        BUTTONS_KEYS.BTN_A,
                        active
                    );
                } else if (key === BUTTONS_KEYS.BTN_B) {
                    this.imageRef.current.updateButtonAttributes(
                        BUTTONS_KEYS.BTN_B,
                        active
                    );
                } else if (key === BUTTONS_KEYS.BTN_AB) {
                    this.imageRef.current.updateButtonAttributes(
                        BUTTONS_KEYS.BTN_AB,
                        active
                    );
                }
            }
        } else if (
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.A)
        ) {
            this.handleButtonClick(BUTTONS_KEYS.BTN_A, active);
            if (this.imageRef.current) {
                this.imageRef.current.updateButtonAttributes(
                    BUTTONS_KEYS.BTN_A,
                    active
                );
            }
        } else if (
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.B)
        ) {
            this.handleButtonClick(BUTTONS_KEYS.BTN_B, active);
            if (this.imageRef.current) {
                this.imageRef.current.updateButtonAttributes(
                    BUTTONS_KEYS.BTN_B,
                    active
                );
            }
        } else if (
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.C)
        ) {
            this.handleButtonClick(BUTTONS_KEYS.BTN_AB, active);
            if (this.imageRef.current) {
                this.imageRef.current.updateButtonAttributes(
                    BUTTONS_KEYS.BTN_AB,
                    active
                );
            }
        } else if (event.key === CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) {
            this.togglePlayClick();
        } else if (event.key === CONSTANTS.KEYBOARD_KEYS.CAPITAL_R) {
            this.refreshSimulatorClick();
        }
    }
}
