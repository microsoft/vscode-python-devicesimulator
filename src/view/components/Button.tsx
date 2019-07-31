import * as React from "react";
import "../styles/Button.css";

export interface IButtonProps {
  image: any;
  label: string;
  width: number;
  onClick: (event?: React.MouseEvent<HTMLElement>, label?: string) => void;
}

// Functional Component render
const Button: React.FC<IButtonProps> = props => {
  const iconSvg: SVGElement = props.image as SVGElement;
  const buttonStyle = { width: props.width };

  return (
    <button
      className={`${props.label}-button button`}
      onClick={props.onClick}
      style={buttonStyle}
    >
      {iconSvg}
    </button>
  );
};

export default Button;
