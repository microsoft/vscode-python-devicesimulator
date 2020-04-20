import { SENSOR_LIST } from "../../../constants";
import { ISensorProps, ISliderProps } from "../../../viewUtils";

const CLUE_SLIDER_R: ISliderProps = {
    axisLabel: "R",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_R,
    step: 1,
};

const CLUE_SLIDER_G: ISliderProps = {
    axisLabel: "G",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_G,
    step: 1,
};

const CLUE_SLIDER_B: ISliderProps = {
    axisLabel: "B",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_B,
    step: 1,
};
const CLUE_SLIDER_C: ISliderProps = {
    axisLabel: "C",
    maxLabel: "Max",
    maxValue: 255,
    minLabel: "Min",
    minValue: 0,
    type: SENSOR_LIST.LIGHT_C,
    step: 1,
};

export const CLUE_LIGHT_PROPERTIES: ISensorProps = {
    LABEL: "Light Sensor",
    sliderProps: [CLUE_SLIDER_R, CLUE_SLIDER_G, CLUE_SLIDER_B, CLUE_SLIDER_C],
    unitLabel: "Lux",
};

// Range for magnet found here https://www.adafruit.com/product/4479
const CLUE_MAGNET_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.MAGNET_X,
    step: 1,
};
const CLUE_MAGNET_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.MAGNET_Y,
    step: 1,
};
const CLUE_MAGNET_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.MAGNET_Z,
    step: 1,
};

export const CLUE_MAGNET_PROPERTIES: ISensorProps = {
    LABEL: "Magnetoscope",
    sliderProps: [CLUE_MAGNET_X, CLUE_MAGNET_Y, CLUE_MAGNET_Z],
    unitLabel: "μT",
};
const CLUE_GYRO_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.GYRO_X,
    step: 1,
};
const CLUE_GYRO_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.GYRO_Y,
    step: 1,
};
const CLUE_GYRO_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.GYRO_Z,
    step: 1,
};

export const CLUE_GYRO_PROPERTIES: ISensorProps = {
    LABEL: "Gyroscope",
    sliderProps: [CLUE_GYRO_X, CLUE_GYRO_Y, CLUE_GYRO_Z],
    unitLabel: "deg/s",
};

export const CLUE_HUMIDITY_PROPERTIES: ISensorProps = {
    LABEL: "Humidity Sensor",
    sliderProps: [
        {
            axisLabel: "H",
            maxLabel: "Max",
            maxValue: 100,
            minLabel: "Min",
            minValue: 0,
            type: SENSOR_LIST.HUMIDITY,
            step: 1,
        },
    ],
    unitLabel: "%",
};
export const CLUE__PROXIMITY_PROPERTIES: ISensorProps = {
    LABEL: "Humidity Sensor",
    sliderProps: [
        {
            axisLabel: "P",
            maxLabel: "Max",
            maxValue: 255,
            minLabel: "Min",
            minValue: 0,
            type: SENSOR_LIST.PROXIMITY,
            step: 1,
        },
    ],
    unitLabel: "",
};
export const CLUE_PRESSURE_PROPERTIES: ISensorProps = {
    LABEL: "Humidity Sensor",
    sliderProps: [
        {
            axisLabel: "P",
            maxLabel: "Max",
            maxValue: 1100,
            minLabel: "Min",
            minValue: 800,
            type: SENSOR_LIST.PRESSURE,
            step: 1,
        },
    ],
    unitLabel: "hPa",
};
const MOTION_SLIDER_PROPS_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Right",
    maxValue: 1023,
    minLabel: "Left",
    minValue: -1023,
    type: SENSOR_LIST.MOTION_X,
    step: 1,
};

const MOTION_SLIDER_PROPS_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Front",
    maxValue: 1023,
    minLabel: "Back",
    minValue: -1023,
    type: SENSOR_LIST.MOTION_Y,
    step: 1,
};

const MOTION_SLIDER_PROPS_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Down",
    maxValue: 1023,
    minLabel: "Up",
    minValue: -1023,
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
    unitLabel: "m/s2",
};

const TEMPERATURE_SLIDER_PROPS: ISliderProps = {
    axisLabel: "T",
    maxLabel: "Hot",
    maxValue: 125,
    minLabel: "Cold",
    minValue: -55,
    type: SENSOR_LIST.TEMPERATURE,
    step: 1,
};

export const TEMPERATURE_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Temperature sensor",
    sliderProps: [TEMPERATURE_SLIDER_PROPS],
    unitLabel: "°C",
};
