import * as React from "react";
import { SENSOR_LIST, GESTURES, CONSTANTS } from "../../../constants";
import { ISensorProps, ISliderProps } from "../../../viewUtils";
import { ThreeDimensionSlider } from "./threeDimensionSlider/ThreeDimensionSlider";
import { Dropdown } from "../../Dropdown";
import SensorButton from "../SensorButton";

const MOTION_SLIDER_PROPS_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Right",
    maxValue: 1023,
    minLabel: "Left",
    minValue: -1023,
    type: SENSOR_LIST.MOTION_X,
};

const MOTION_SLIDER_PROPS_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Front",
    maxValue: 1023,
    minLabel: "Back",
    minValue: -1023,
    type: SENSOR_LIST.MOTION_Y,
};

const MOTION_SLIDER_PROPS_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Down",
    maxValue: 1023,
    minLabel: "Up",
    minValue: -1023,
    type: SENSOR_LIST.MOTION_Z,
};

const MOTION_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Motion sensor",
    sliderProps: [
        MOTION_SLIDER_PROPS_X,
        MOTION_SLIDER_PROPS_Y,
        MOTION_SLIDER_PROPS_Z,
    ],
    unitLabel: "Lux",
};

interface IProps {
    axisValues: {
        X_AXIS: number;
        Y_AXIS: number;
        Z_AXIS: number;
    };
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void;
    onSelectGestures?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSendGesture?: (isActive: boolean) => void;
}

const GESTURE_BUTTON_MESSAGE = "Send Gesture";
const MANUAL_ACCELERATION_MESSAGE = "Set the acceleration manually here";

export class Accelerometer extends React.Component<IProps> {
    private sensorButtonRef: React.RefObject<SensorButton> = React.createRef();
    render() {
        return (
            <div className="AccelerometerBar">
                <br />
                <Dropdown
                    options={GESTURES}
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
                    onKeyDown={(e: React.KeyboardEvent) => {
                        this.handleOnKeyDown(e, this.props.onSendGesture);
                    }}
                    onKeyUp={(e: React.KeyboardEvent) => {
                        this.handleOnKeyUp(e, this.props.onSendGesture);
                    }}
                    type="gesture"
                />
                <br />
                <p>{MANUAL_ACCELERATION_MESSAGE}</p>

                <ThreeDimensionSlider
                    axisProperties={MOTION_SENSOR_PROPERTIES}
                    onUpdateValue={this.props.onUpdateValue}
                    axisValues={this.props.axisValues}
                />
            </div>
        );
    }
    private handleOnKeyDown = (
        e: React.KeyboardEvent,
        onSendGesture?: (isActive: boolean) => void
    ) => {
        if (e.key === CONSTANTS.KEYBOARD_KEYS.ENTER) {
            this.sensorButtonRef!.current!.setButtonClass(true);
            if (onSendGesture) onSendGesture(true);
        }
    };

    private handleOnKeyUp = (
        e: React.KeyboardEvent,
        onSendGesture?: (isActive: boolean) => void
    ) => {
        if (e.key === CONSTANTS.KEYBOARD_KEYS.ENTER) {
            this.sensorButtonRef!.current!.setButtonClass(false);

            if (onSendGesture) onSendGesture(false);
        }
    };
}
