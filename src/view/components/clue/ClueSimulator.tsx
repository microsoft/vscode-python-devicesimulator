import * as React from "react";
import {
    AB_BUTTONS_KEYS,
    CONSTANTS,
    DEFAULT_IMG_CLUE,
    DEVICE_LIST_KEY,
    VIEW_STATE,
    WEBVIEW_MESSAGES,
} from "../../constants";
import "../../styles/Simulator.css";
import PlayLogo from "../../svgs/play_svg";
import StopLogo from "../../svgs/stop_svg";
import { sendMessage } from "../../utils/MessageUtils";
import ActionBar from "../simulator/ActionBar";
import { BUTTONS_KEYS, ClueImage } from "./ClueImage";
import "../../styles/Simulator.css";
import { ViewStateContext } from "../../context";

export const DEFAULT_CLUE_STATE: IClueState = {
    buttons: { button_a: false, button_b: false },
    displayMessage: DEFAULT_IMG_CLUE,
    leds: {
        neopixel: [0, 0, 0],
        isRedLedOn: false,
        isWhiteLedOn: false,
    },
};

interface IState {
    active_editors: string[];
    running_file?: string;
    play_button: boolean;
    selected_file: string;
    clue: IClueState;
    currently_selected_file: string;
}

interface IClueState {
    buttons: { button_a: boolean; button_b: boolean };
    displayMessage: string;
    leds: {
        neopixel: number[];
        isRedLedOn: boolean;
        isWhiteLedOn: boolean;
    };
}
export class ClueSimulator extends React.Component<any, IState> {
    private imageRef: React.RefObject<ClueImage> = React.createRef();
    constructor() {
        super({});
        this.state = {
            clue: DEFAULT_CLUE_STATE,
            play_button: false,
            selected_file: "",
            active_editors: [],
            running_file: undefined,
            currently_selected_file: "",
        };
        this.onKeyEvent = this.onKeyEvent.bind(this);
    }
    handleMessage = (event: any): void => {
        const message = event.data;
        if (message.active_device !== DEVICE_LIST_KEY.CLUE) {
            return;
        }
        switch (message.command) {
            case "reset-state":
                this.setState({
                    clue: DEFAULT_CLUE_STATE,
                    play_button: false,
                });
                break;
            case "set-state":
                this.handleStateChangeMessage(message);
                break;
            case "activate-play":
                const newRunningFile = this.state.currently_selected_file;
                this.setState({
                    play_button: !this.state.play_button,
                    running_file: newRunningFile,
                    clue: {
                        ...this.state.clue,
                        displayMessage: DEFAULT_IMG_CLUE,
                    },
                });
                break;
            case "visible-editors":
                this.setState({
                    active_editors: message.state.activePythonEditors,
                });
                break;
            case "current-file":
                if (this.state.play_button) {
                    this.setState({
                        currently_selected_file: message.state.running_file,
                    });
                } else {
                    this.setState({
                        running_file: message.state.running_file,
                        currently_selected_file: message.state.running_file,
                    });
                }

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
                    {this.state.running_file && this.state.play_button
                        ? CONSTANTS.CURRENTLY_RUNNING(this.state.running_file)
                        : CONSTANTS.FILES_PLACEHOLDER}
                </div>

                <div className="clue-container">
                    <ClueImage
                        ref={this.imageRef}
                        eventTriggers={{
                            onMouseDown: this.onMouseDown,
                            onMouseUp: this.onMouseUp,
                            onMouseLeave: this.onMouseLeave,
                            onKeyEvent: this.onKeyEvent,
                        }}
                        displayMessage={this.state.clue.displayMessage}
                        leds={this.state.clue.leds}
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
            case AB_BUTTONS_KEYS.BTN_A:
                newButtonState.button_a = isActive;
                break;
            case AB_BUTTONS_KEYS.BTN_B:
                newButtonState.button_b = isActive;
                break;
            case AB_BUTTONS_KEYS.BTN_AB:
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
        if (
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.ENTER) &&
            this.context === VIEW_STATE.RUNNING
        ) {
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
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.A) &&
            this.context === VIEW_STATE.RUNNING
        ) {
            this.handleButtonClick(BUTTONS_KEYS.BTN_A, active);
            if (this.imageRef.current) {
                this.imageRef.current.updateButtonAttributes(
                    BUTTONS_KEYS.BTN_A,
                    active
                );
            }
        } else if (
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.B) &&
            this.context === VIEW_STATE.RUNNING
        ) {
            this.handleButtonClick(BUTTONS_KEYS.BTN_B, active);
            if (this.imageRef.current) {
                this.imageRef.current.updateButtonAttributes(
                    BUTTONS_KEYS.BTN_B,
                    active
                );
            }
        } else if (
            [event.code, event.key].includes(CONSTANTS.KEYBOARD_KEYS.C) &&
            this.context === VIEW_STATE.RUNNING
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
    protected handleStateChangeMessage(message: any) {
        if (message.state.display_base64 != null) {
            this.setState({
                clue: {
                    ...this.state.clue,
                    displayMessage: message.state.display_base64,
                },
            });
        } else if (message.state.pixels != null) {
            this.setState({
                clue: {
                    ...this.state.clue,
                    leds: {
                        ...this.state.clue.leds,
                        neopixel: message.state.pixels,
                    },
                },
            });
        } else if (message.state.white_leds != null) {
            this.setState({
                clue: {
                    ...this.state.clue,
                    leds: {
                        ...this.state.clue.leds,
                        isWhiteLedOn: message.state.white_leds,
                    },
                },
            });
        } else if (message.state.red_led != null) {
            this.setState({
                clue: {
                    ...this.state.clue,
                    leds: {
                        ...this.state.clue.leds,
                        isRedLedOn: message.state.red_led,
                    },
                },
            });
        }
    }
}
ClueSimulator.contextType = ViewStateContext;
