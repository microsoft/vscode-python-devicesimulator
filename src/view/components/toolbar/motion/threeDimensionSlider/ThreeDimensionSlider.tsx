import * as React from "react";
import {
    ISensorProps,
    X_SLIDER_INDEX,
    Y_SLIDER_INDEX,
    Z_SLIDER_INDEX,
} from "../../../../viewUtils";
import InputSlider from "../../InputSlider";

interface IProps {
    axisProperties: ISensorProps;
}
export const ThreeDimensionSlider: React.FC<IProps> = props => {
    return (
        <div className="ThreeDimensionSlider">
            <InputSlider
                minValue={
                    props.axisProperties.sliderProps[X_SLIDER_INDEX].minValue
                }
                maxValue={
                    props.axisProperties.sliderProps[X_SLIDER_INDEX].maxValue
                }
                type={props.axisProperties.sliderProps[X_SLIDER_INDEX].type}
                minLabel={
                    props.axisProperties.sliderProps[X_SLIDER_INDEX].minLabel
                }
                maxLabel={
                    props.axisProperties.sliderProps[X_SLIDER_INDEX].maxLabel
                }
                axisLabel={
                    props.axisProperties.sliderProps[X_SLIDER_INDEX].axisLabel
                }
            />
            <br />
            <InputSlider
                minValue={
                    props.axisProperties.sliderProps[Y_SLIDER_INDEX].minValue
                }
                maxValue={
                    props.axisProperties.sliderProps[Y_SLIDER_INDEX].maxValue
                }
                type={props.axisProperties.sliderProps[Y_SLIDER_INDEX].type}
                minLabel={
                    props.axisProperties.sliderProps[Y_SLIDER_INDEX].minLabel
                }
                maxLabel={
                    props.axisProperties.sliderProps[Y_SLIDER_INDEX].maxLabel
                }
                axisLabel={
                    props.axisProperties.sliderProps[Y_SLIDER_INDEX].axisLabel
                }
            />
            <br />
            <InputSlider
                minValue={
                    props.axisProperties.sliderProps[Z_SLIDER_INDEX].minValue
                }
                maxValue={
                    props.axisProperties.sliderProps[Z_SLIDER_INDEX].maxValue
                }
                type={props.axisProperties.sliderProps[Z_SLIDER_INDEX].type}
                minLabel={
                    props.axisProperties.sliderProps[Z_SLIDER_INDEX].minLabel
                }
                maxLabel={
                    props.axisProperties.sliderProps[Z_SLIDER_INDEX].maxLabel
                }
                axisLabel={
                    props.axisProperties.sliderProps[Z_SLIDER_INDEX].axisLabel
                }
            />
        </div>
    );
};
