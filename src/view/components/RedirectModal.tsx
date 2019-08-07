import * as React from "react";
import "../styles/Button.css";

export interface IMOdalProps {
  onClick: (event?: React.MouseEvent<HTMLElement>) => void;
  text: string;
  title: string;
}

// Functional Component render
const RedirectModal: React.FC<IMOdalProps> = props => {
  return (
    <div className="redirect">
      <div>{props.title}</div>
      <div>{props.text}</div>
      <button
        className="redirect-button"
        aria-label={"label"}
        role="Information"
        onClick={props.onClick}
      >
        {`Got it`}
      </button>
    </div>
  );
};

export default RedirectModal;
