import { ISliderProps, ISensorProps } from "../../../viewUtils";
import { SENSOR_LIST } from "../../../constants";

const LIGHT_SLIDER_PROPS: ISliderProps = {
    maxValue: 255,
    minValue: 0,
    minLabel: "Dark",
    maxLabel: "Bright",
    type: "light",
    axisLabel: "L",
};


export const LIGHT_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Light sensor",
    sliderProps: [LIGHT_SLIDER_PROPS],
    unitLabel: "Lux",
};

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

export const MOTION_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Motion sensor",
    sliderProps: [
        MOTION_SLIDER_PROPS_X,
        MOTION_SLIDER_PROPS_Y,
        MOTION_SLIDER_PROPS_Z,
    ],
    unitLabel: "m/s2",
};

const TEMPERATURE_SLIDER_PROPS: ISliderProps = {
    axisLabel: " ",
    maxLabel: "Hot",
    maxValue: 125,
    minLabel: "Cold",
    minValue: -55,
    type: SENSOR_LIST.TEMPERATURE,
};

export const TEMPERATURE_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Temperature sensor",
    sliderProps: [TEMPERATURE_SLIDER_PROPS],
    unitLabel: "°C",
};