import * as React from "react";
import "../styles/Button.css";

export interface IButtonProps {
  Title: string;
  onClick: (event?: React.MouseEvent<HTMLElement>, label?: string) => void;
}

// Functional Component render
const RedirectModal: React.FC<IButtonProps> = props => {
  return (
    <div className="redirect">
      <div>{`text`}</div>
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
