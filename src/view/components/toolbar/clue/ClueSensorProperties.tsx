import { ISliderProps, ISensorProps } from "../../../viewUtils";
import { SENSOR_LIST } from "../../../constants";
const CLUE_SLIDER_R: ISliderProps = {
    axisLabel: "R",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_R,
};

const CLUE_SLIDER_G: ISliderProps = {
    axisLabel: "G",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_G,
};

const CLUE_SLIDER_B: ISliderProps = {
    axisLabel: "B",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_B,
};
const CLUE_SLIDER_C: ISliderProps = {
    axisLabel: "C",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_C,
};

export const CLUE_LIGHT_PROPERTIES: ISensorProps = {
    LABEL: "Light Sensor",
    sliderProps: [CLUE_SLIDER_R, CLUE_SLIDER_G, CLUE_SLIDER_B, CLUE_SLIDER_C],
    unitLabel: "Lux",
};
