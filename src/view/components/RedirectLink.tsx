import * as React from "react";
import RedirectModal from "./RedirectModal";
import "../styles/RedirectLink.css";
import { INFO_SVG } from "../svgs/info_svg";
import { TOOLBAR_INFO, REDIRECT } from "../constants";

class RedirectLink extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  render() {
    return (
      <span>
        <div className="redirect-link">
          <span className="info-icon">{INFO_SVG}</span>
          <span className="info-text">{TOOLBAR_INFO}</span>
          <span onClick={this.handleOnClickLink}>Learn More></span>
        </div>
        <Modal
          text={`${REDIRECT.description} : \n ${REDIRECT.privacy}`}
          showModal={this.state.showModal}
          onClick={this.handleOnClickButton}
          link={REDIRECT.link}
          onClickClose={this.handleOnClickButton}
          shouldOpenLink={this.props.shouldOpeLink}
        />
      </span>
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
  return props.showModal || props.shouldOpenLink ? (
    <RedirectModal
      text={props.text}
      onClickOK={props.onClick}
      link={props.link}
      onClickClose={props.onClickClose}
    />
  ) : null;
};
export default RedirectLink;
