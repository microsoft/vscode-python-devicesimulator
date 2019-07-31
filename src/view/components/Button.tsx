import * as React from "react";
import "../styles/Button.css";
import { IButtonProps } from "./component_utils";

// Functional Component render
const Button: React.FC<IButtonProps> = props => {
  const iconSvg: SVGElement = props.image as SVGElement;
  const buttonStyle = { width: props.width };

  return (
    <button
      className={`${props.label}-button button`}
      onClick={props.onClick(event)}
      style={buttonStyle}
    >
      {iconSvg}
    </button>
  );
};

export default Button;
