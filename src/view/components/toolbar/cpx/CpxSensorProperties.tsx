import { SENSOR_LIST } from "../../../constants";
import { ISensorProps, ISliderProps } from "../../../viewUtils";

const LIGHT_SLIDER_PROPS: ISliderProps = {
    maxValue: 320,
    minValue: 0,
    minLabel: "Dark",
    maxLabel: "Bright",
    type: "light",
    axisLabel: "L",
    step: 1,
};

export const LIGHT_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Light sensor",
    sliderProps: [LIGHT_SLIDER_PROPS],
    unitLabel: "Lux",
};

const TEMPERATURE_SLIDER_PROPS: ISliderProps = {
    axisLabel: "T",
    maxLabel: "Hot",
    maxValue: 125,
    minLabel: "Cold",
    minValue: -55,
    type: SENSOR_LIST.TEMPERATURE,
    step: 0.1,
};
export const TEMPERATURE_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Temperature sensor",
    sliderProps: [TEMPERATURE_SLIDER_PROPS],
    unitLabel: "°C",
};

const MOTION_SLIDER_PROPS_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Right",
    maxValue: 78,
    minLabel: "Left",
    minValue: -78,
    type: SENSOR_LIST.MOTION_X,
    step: 1,
};
const MOTION_SLIDER_PROPS_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Front",
    maxValue: 78,
    minLabel: "Back",
    minValue: -78,
    type: SENSOR_LIST.MOTION_Y,
    step: 1,
};
const MOTION_SLIDER_PROPS_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Down",
    maxValue: 78,
    minLabel: "Up",
    minValue: -78,
    type: SENSOR_LIST.MOTION_Z,
    step: 1,
};

export const MOTION_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Motion sensor",
    sliderProps: [
        MOTION_SLIDER_PROPS_X,
        MOTION_SLIDER_PROPS_Y,
        MOTION_SLIDER_PROPS_Z,
    ],
    unitLabel: "Lux",
};
