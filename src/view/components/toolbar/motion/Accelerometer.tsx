import * as React from "react";
import { SENSOR_LIST } from "../../../constants";
import { ISensorProps, ISliderProps } from "../../../viewUtils";

import { GenericSliderComponent } from "../GenericSliderComponent";

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
        X: number;
        Y: number;
        Z: number;
    };
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void;
}

export class Accelerometer extends React.Component<IProps> {
    render() {
        return (
            <div className="accelerometer">
                <GenericSliderComponent
                    axisProperties={MOTION_SENSOR_PROPERTIES}
                    onUpdateValue={this.props.onUpdateValue}
                    axisValues={this.props.axisValues}
                />
            </div>
        );
    }
}
