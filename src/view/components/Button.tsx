import * as React from "react";
import "../styles/Button.css";
import {ViewStateContext} from '../context'
import { VIEW_STATE } from "../constants";

export interface IButtonProps {
    label: string;
    image: any;
    focusable: boolean;
    styleLabel: string;
    width: number;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

// Functional Component render
const Button: React.FC<IButtonProps> = props => {
    const iconSvg: SVGElement = props.image as SVGElement;
    const buttonStyle = { width: props.width };
    const tabIndex = props.focusable ? 0 : -1;
    const isButtonDisabled = (React.useContext(ViewStateContext) === VIEW_STATE.PAUSE)
    console.log(React.useContext(ViewStateContext))
    console.log(isButtonDisabled)

    return (
        <button
            id={`${props.label}-button`}
            className={`${props.styleLabel}-button button`}
            aria-label={props.label.replace("-", " ")}
            role="button"
            onClick={props.onClick}
            style={buttonStyle}
            tabIndex={tabIndex}
            disabled={isButtonDisabled}
        >
            {iconSvg}
        </button>
    );
};

export default Button;
