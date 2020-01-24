// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export interface ISliderProps {
    minValue: number;
    maxValue: number;
    maxLabel: string;
    minLabel: string;
    type: string;
    axisLabel: string;
}

export interface ISensorButtonProps {
    label: string;
    type: string;
    onMouseUp: () => void;
    onMouseDown: () => void;
    onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export interface ISensorProps {
    LABEL: string;
    sliderProps: ISliderProps[];
    unitLabel: string;
}

export const X_SLIDER_INDEX = 0;
export const Y_SLIDER_INDEX = 1;
export const Z_SLIDER_INDEX = 2;
