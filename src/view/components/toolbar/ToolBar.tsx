// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import Button from "../Button";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import "../../styles/ToolBar.css";
import {
  LABEL_TO_MODAL_CONTENT,
  DEFAULT_MODAL_CONTENT,
  IModalContent,
  TOOLBAR_ICON_LABEL
} from "./sensorModalUtils";
import { INFO_SVG } from "../../svgs/info_svg";
import { CONSTANTS } from "../../constants";

interface IToolbarState {
  currentOpened: string;
  doNotShowAgain: boolean;
  showModal: boolean;
  showRedirectModal: boolean;
}

class ToolBar extends React.Component<any, IToolbarState, any> {
  private readonly TOOLBAR_BUTTON_WIDTH: number = 32;
  private readonly TOOLBAR_EDGE_WIDTH: number = 8;

  constructor(props: any) {
    super(props);
    this.state = {
      currentOpened: "",
      doNotShowAgain: false,
      showModal: false,
      showRedirectModal: false
    };
  }

  render() {
    return (
      <div
        className="toolbar-parent"
        id="toolbar-parent"
      >
        <div className="info">
          <div className="redirect-link">
            <span className="info-icon">{INFO_SVG}</span>
            <span className="info-text">{CONSTANTS.TOOLBAR_INFO}</span>
            {this.getLearnLink()}
          </div>
          {this.getRedirectModal()}
        </div>
        <div className="toolbar">
          <div className="toolbar-icon">
            <Button
              label=""
              width={this.TOOLBAR_EDGE_WIDTH}
              onClick={() => {}}
              image={TOOLBAR_SVG.LEFT_EDGE_SVG}
              styleLabel="edge"
            />
            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SWITCH)}
              image={TOOLBAR_SVG.SLIDER_SWITCH_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(
                this,
                TOOLBAR_ICON_LABEL.PUSH_BUTTON
              )}
              image={TOOLBAR_SVG.PUSH_BUTTON_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(
                this,
                TOOLBAR_ICON_LABEL.RED_LED
              )}
              image={TOOLBAR_SVG.RED_LED_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SOUND)}
              image={TOOLBAR_SVG.SOUND_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(
                this,
                TOOLBAR_ICON_LABEL.TEMPERATURE
              )}
              image={TOOLBAR_SVG.TEMPERATURE_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.LIGHT)}
              image={TOOLBAR_SVG.LIGHT_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(
                this,
                TOOLBAR_ICON_LABEL.SPEAKER
              )}
              image={TOOLBAR_SVG.SPEAKER_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.MOTION)}
              image={TOOLBAR_SVG.MOTION_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.IR)}
              image={TOOLBAR_SVG.IR_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.GPIO)}
              image={TOOLBAR_SVG.GPIO_SVG}
              styleLabel="toolbar"
            />

            <Button
              label=""
              width={this.TOOLBAR_EDGE_WIDTH}
              onClick={() => {}}
              image={TOOLBAR_SVG.RIGHT_EDGE_SVG}
              styleLabel="edge"
            />
          </div>

          {this.getIconModal()}
        </div>
      </div>
    );
  }

  private handleOnClick(label: string) {
    if (
      !this.state.showModal &&
      this.state.currentOpened === "" &&
      this.state.currentOpened !== label
    ) {
      this.openModal(label);
      const parent = window.document.getElementById("toolbar-parent");
      if (parent) {
        parent.focus();
      }
    } else {
      this.closeCurrentModal();
      if (this.state.currentOpened !== label) {
        this.openModal(label);
      }
    }
  }

  private closeCurrentModal = () => {
    this.setState({ showModal: false });
    this.setState({ currentOpened: "" });
  };

  private openModal = (label: string) => {
    this.setState({ currentOpened: label });
    this.setState({ showModal: true });
  };

  private getIconModal() {
    if (
      !this.state.showModal ||
      !LABEL_TO_MODAL_CONTENT.get(this.state.currentOpened)
    ) {
      return null;
    }

    const content = LABEL_TO_MODAL_CONTENT.get(
      this.state.currentOpened
    ) as IModalContent;

    const component = content
      ? content["component"]
      : DEFAULT_MODAL_CONTENT.component;
    return (
      <div className="sensor_modal">
        <div className="title_group">
          <span className="title">
            {content["descriptionTitle"]}
            {content["tagInput"]}
            {content["tagOutput"]}
          </span>
        </div>
        <br />
        <div className="description">{content["descriptionText"]}</div>
        <div className="try_area">
          <div className="title"> {content["tryItTitle"]}</div>
          <br />
          <div className="description">{content["tryItDescriptrion"]}</div>
          <div>{component}</div>
        </div>
      </div>
    );
  }

  private getRedirectModal() {
    if (this.state.doNotShowAgain || !this.state.showRedirectModal) {
      return null;
    }
    return (
      <span>
        <div className="redirect-modal">
          <div className="redirect-description">{`${
            CONSTANTS.REDIRECT.description
          } : \n ${CONSTANTS.REDIRECT.privacy}`}</div>
          <a
            className="redirect-button"
            id="redirect"
            aria-label={"Information pop-up"}
            onClick={this.handleOnClickButton}
            href={CONSTANTS.REDIRECT.link}
          >
            {`Got it`}
          </a>
          <span className="redirect-button" onClick={this.handleOnClickButton}>
            {`close`}
          </span>
          <span className="redirect-button" onClick={this.handleDoNotShow}>
            {`Do Not Show Again`}
          </span>
        </div>
      </span>
    );
  }

  private getLearnLink() {
    const linkString = (
      <span className="redirect-learn-link">
        <span onClick={this.handleOnClickLink}>Learn More</span>
      </span>
    );
    const linkAnchor = (
      <span className="redirect-learn-link">
        <a href={CONSTANTS.REDIRECT.link}>Learn More</a>
      </span>
    );
    return this.state.doNotShowAgain ? linkAnchor : linkString;
  }

  private handleOnClickButton = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ showRedirectModal: false });
  };

  private handleOnClickLink = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ showRedirectModal: true });
    if (this.state.doNotShowAgain) {
      console.log("got to do not show");
      const ref = window.document.getElementById("redirect");
      if (ref) {
        console.log("got to redirect");
        window.location.assign(CONSTANTS.REDIRECT.link);
      }
    }
  };

  private handleDoNotShow = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ doNotShowAgain: true });
  };
}

export default ToolBar;
