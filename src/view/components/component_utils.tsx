// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export interface ISliderProps {
  minValue: number;
  maxValue: number;
  maxLabel: string;
  minLabel: string;
  type: string;
}

export interface ISensorProps {
  LABEL: string;
  sliderProps: ISliderProps[];
  unitLabel: string;
}

export interface IButtonProps {
  image: any;
  label: string;
  width: number;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}
