"use strict";

import * as React from "react";

interface IProps {
  name?: string;
  light: Array<number>;
  onClick: () => void;
}

const getRGB = (props: IProps): string => {
  return "rgb(" + props.light.toString() + ")";
};

const App: React.FC<IProps> = props => {
  // const style = {
  //   border:
  //     "1px solid rgb(" +
  //     props.light.red +
  //     "," +
  //     props.light.green +
  //     "," +
  //     props.light.blue +
  //     ")"
  // };
  const xPos: number = 150;
  const yPos: number = 100;
  const radius: number = 20;
  return (
    <svg id="led-light-1">
      <circle
        onClick={props.onClick}
        cx={xPos}
        cy={yPos}
        r={radius}
        fill={getRGB(props)}
      />
    </svg>
  );
};

export default App;
