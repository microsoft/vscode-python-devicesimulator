import * as React from "react";
import { SENSOR_LIST } from "../../../constants";
import { ISensorProps, ISliderProps } from "../../../viewUtils";
import { ThreeDimensionSlider } from "./threeDimensionSlider/ThreeDimensionSlider";

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
}
export const Accelerometer: React.FC<IProps> = (props: IProps) => {
    return (
        <div className="AccelerometerBar">
            <br />
            {/* Implement Gestures Here */}
            <ThreeDimensionSlider
                axisProperties={MOTION_SENSOR_PROPERTIES}
                onUpdateValue={props.onUpdateValue}
                axisValues={props.axisValues}
            />
        </div>
    );
};
