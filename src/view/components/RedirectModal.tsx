import * as React from "react";
import "../styles/RedirectLink.css";

export interface IMOdalProps {
  onClickOK: (event: React.MouseEvent<HTMLElement>) => void;
  onClickClose: (event: React.MouseEvent<HTMLElement>) => void;
  text: string;
  link: string;
}

// Functional Component render
const RedirectModal: React.FC<IMOdalProps> = props => {
  return (
    <div className="redirect-modal">
      <div className="redirect-description">{props.text}</div>
      <a
        className="redirect-button"
        aria-label={"Information pop-up"}
        onClick={props.onClickOK}
        href={props.link}
      >
        {`Got it`}
      </a>
      <span
        className="redirect-button"
        onClick={props.onClickClose}
      >{`close`}</span>
    </div>
  );
};

export default RedirectModal;
