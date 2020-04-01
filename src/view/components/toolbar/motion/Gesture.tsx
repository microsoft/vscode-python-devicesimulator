import * as React from "react";
import SensorButton from "../SensorButton";
import { Dropdown } from "../../Dropdown";
import CONSTANTS, { GESTURES } from "../../../constants";

const GESTURE_BUTTON_MESSAGE = "Send Gesture";
interface IProps {
    gestures: string[];
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSendGesture?: (isActive: boolean) => void;
}
export class Gesture extends React.Component<IProps> {
    private sensorButtonRef: React.RefObject<SensorButton> = React.createRef();
    render() {
        return (
            <div
                className="gesture"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "75px",
                }}
            >
                <Dropdown
                    name="gesture selection"
                    options={this.props.gestures}
                    onSelect={this.props.onSelectGestures}
                />
                <SensorButton
                    ref={this.sensorButtonRef}
                    label={GESTURE_BUTTON_MESSAGE}
                    onMouseDown={() => {
                        if (this.props.onSendGesture) {
                            this.props.onSendGesture(true);
                        }
                    }}
                    onMouseUp={() => {
                        if (this.props.onSendGesture) {
                            this.props.onSendGesture(false);
                        }
                    }}
                    onKeyDown={this.handleOnKeyDown}
                    onKeyUp={this.handleOnKeyUp}
                    type="gesture"
                />
            </div>
        );
    }
    private handleOnKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === CONSTANTS.KEYBOARD_KEYS.ENTER) {
            this.sensorButtonRef!.current!.setButtonClass(true);
            if (this.props.onSendGesture) {
                this.props.onSendGesture(true);
            }
        }
    };

    private handleOnKeyUp = (
        e: React.KeyboardEvent,
        onSendGesture?: (isActive: boolean) => void
    ) => {
        if (e.key === CONSTANTS.KEYBOARD_KEYS.ENTER) {
            this.sensorButtonRef!.current!.setButtonClass(false);

            if (this.props.onSendGesture) {
                this.props.onSendGesture(false);
            }
        }
    };
}
