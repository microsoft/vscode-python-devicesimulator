import { SENSOR_LIST } from "../../../constants";
import { ISensorProps, ISliderProps } from "../../../viewUtils";

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

// Range for magnet found here https://www.adafruit.com/product/4479
const CLUE_MAGNET_X: ISliderProps = {
    axisLabel: "X",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1600,
    minValue: 400,
    type: SENSOR_LIST.MAGNET_X,
};
const CLUE_MAGNET_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1600,
    minValue: 400,
    type: SENSOR_LIST.MAGNET_Y,
};
const CLUE_MAGNET_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1600,
    minValue: 400,
    type: SENSOR_LIST.MAGNET_Z,
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
};
const CLUE_GYRO_Y: ISliderProps = {
    axisLabel: "Y",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.GYRO_Y,
};
const CLUE_GYRO_Z: ISliderProps = {
    axisLabel: "Z",
    maxLabel: "Max",
    minLabel: "Min",
    maxValue: 1000,
    minValue: -1000,
    type: SENSOR_LIST.GYRO_Z,
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
        },
    ],
    unitLabel: "hPa",
};
