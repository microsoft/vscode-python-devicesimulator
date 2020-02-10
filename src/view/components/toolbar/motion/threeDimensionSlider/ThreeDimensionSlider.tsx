import * as React from "react";
import {
    ISensorProps,
    ISliderProps,
    X_SLIDER_INDEX,
    Y_SLIDER_INDEX,
    Z_SLIDER_INDEX,
} from "../../../../viewUtils";
import InputSlider from "../../InputSlider";

const MOTION_SLIDER_PROPS_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Right",
    maxValue: 78,
    minLabel: "Left",
    minValue: -78,
    type: "motion_x",
};
const MOTION_SLIDER_PROPS_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Front",
    maxValue: 78,
    minLabel: "Back",
    minValue: -78,
    type: "motion_y",
};
const MOTION_SLIDER_PROPS_Z: ISliderProps = {
    maxValue: 78,
    minValue: -78,
    minLabel: "Up",
    maxLabel: "Down",
    type: "motion_z",
    axisLabel: "Z",
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
export const ThreeDimensionSlider: React.FC<{}> = () => {
    return (
        <div className="ThreeDimensionSlider">
            <InputSlider
                minValue={
                    MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                        .minValue
                }
                maxValue={
                    MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                        .maxValue
                }
                type={MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].type}
                minLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                        .minLabel
                }
                maxLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                        .maxLabel
                }
                axisLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                        .axisLabel
                }
            />
            <br />
            <InputSlider
                minValue={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX]
                        .minValue
                }
                maxValue={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX]
                        .maxValue
                }
                type={MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX].type}
                minLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX]
                        .minLabel
                }
                maxLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX]
                        .maxLabel
                }
                axisLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Y_SLIDER_INDEX]
                        .axisLabel
                }
            />
            <br />
            <InputSlider
                minValue={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX]
                        .minValue
                }
                maxValue={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX]
                        .maxValue
                }
                type={MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX].type}
                minLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX]
                        .minLabel
                }
                maxLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX]
                        .maxLabel
                }
                axisLabel={
                    MOTION_SENSOR_PROPERTIES.sliderProps[Z_SLIDER_INDEX]
                        .axisLabel
                }
            />
        </div>
    );
};
