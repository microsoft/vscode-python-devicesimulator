// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { SENSOR_LIST } from "../../constants";
import "../../styles/LightSensorBar.css";
import { ISensorProps, ISliderProps, X_SLIDER_INDEX } from "../../viewUtils";
import InputSlider from "./InputSlider";

const LIGHT_SLIDER_PROPS: ISliderProps = {
    maxValue: 255,
    minValue: 0,
    minLabel: "Dark",
    maxLabel: "Bright",
    type: "light",
    axisLabel: " ",
};

const LIGHT_SENSOR_PROPERTIES: ISensorProps = {
    LABEL: "Light sensor",
    sliderProps: [LIGHT_SLIDER_PROPS],
    unitLabel: "Lux",
};
interface IProps {
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void;
    value: number;
}

class LightSensorBar extends React.Component<IProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="lightSensorBar">
                <InputSlider
                    minValue={
                        LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                            .minValue
                    }
                    maxValue={
                        LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                            .maxValue
                    }
                    type={
                        LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX].type
                    }
                    minLabel={
                        LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                            .minLabel
                    }
                    maxLabel={
                        LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                            .maxLabel
                    }
                    axisLabel={
                        LIGHT_SENSOR_PROPERTIES.sliderProps[X_SLIDER_INDEX]
                            .axisLabel
                    }
                    onUpdateValue={this.props.onUpdateValue}
                    value={this.props.value}
                />
            </div>
        );
    }
}

export default LightSensorBar;
