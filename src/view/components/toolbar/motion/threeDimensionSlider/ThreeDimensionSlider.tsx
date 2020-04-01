import * as React from "react";
import { SENSOR_LIST } from "../../../../constants";
import {
    ISensorProps,
    X_SLIDER_INDEX,
    Y_SLIDER_INDEX,
    Z_SLIDER_INDEX,
    ISliderProps,
} from "../../../../viewUtils";
import InputSlider from "../../InputSlider";

interface IProps {
    axisProperties: ISensorProps;
    axisValues: {
        X: number;
        Y: number;
        Z: number;
    };
    onUpdateValue: (sensor: SENSOR_LIST, value: number) => void;
}
export const ThreeDimensionSlider: React.FC<IProps> = props => {
    return (
        <div className="ThreeDimensionSlider">
            {props.axisProperties.sliderProps.map(
                (sliderProperties: ISliderProps, index: number) => {
                    return (
                        <React.Fragment key={index}>
                            <InputSlider
                                minValue={sliderProperties.minValue}
                                maxValue={sliderProperties.maxValue}
                                type={sliderProperties.type}
                                minLabel={sliderProperties.minLabel}
                                maxLabel={sliderProperties.maxLabel}
                                axisLabel={sliderProperties.axisLabel}
                                onUpdateValue={props.onUpdateValue}
                                value={
                                    props.axisValues[
                                        sliderProperties.axisLabel as keyof IProps["axisValues"]
                                    ]
                                }
                            />
                            <br />
                        </React.Fragment>
                    );
                }
            )}
        </div>
    );
};
