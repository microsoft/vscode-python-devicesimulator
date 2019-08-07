import * as React from "react";
import RedirectModal from "./RedirectModal";
import "../styles/RedirectLink.css";
import { REDIRECT } from "../constants";

class RedirectLink extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      dontShow: false
    };
  }

  render() {
    return (
      <div>
        <div className="redirect-link" onClick={this.handleOnClickLink}>
          <div>Learn More></div>
        </div>
        <Modal
          text={`${REDIRECT.description} : \n ${REDIRECT.privacy}`}
          showModal={this.state.showModal}
          onClick={this.handleOnClickButton}
          link={REDIRECT.link}
          onClickClose={this.handleOnClickButton}
        />
      </div>
    );
  }

  private handleOnClickButton = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ showModal: false });
  };

  private handleOnClickLink = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ showModal: true });
  };
}

const Modal = (props: any) => {
  return props.showModal ? (
    <RedirectModal
      text={props.text}
      onClickOK={props.onClick}
      link={props.link}
      onClickClose={props.onClickClose}
    />
  ) : null;
};
export default RedirectLink;
