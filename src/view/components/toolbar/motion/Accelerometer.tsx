import * as React from "react";
import { ThreeDimensionSlider } from "./threeDimensionSlider/ThreeDimensionSlider";

export const Accelerometer: React.FC<{}> = () => {
    return (
        <div className="AccelerometerBar">
            <br />
            <ThreeDimensionSlider />
        </div>
    );
};
