import * as React from "react";
import "../styles/Button.css";

interface IButtonProps {
  image: any;
  label: string;
  on: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

// Functional Component render
const Button: React.FC<IButtonProps> = props => {
  const iconSvg: SVGElement = props.image as SVGElement;

  return (
    <button className={`${props.label}-button button`} onClick={props.onClick}>
      {iconSvg}
    </button>
  );
};

export default Button;
