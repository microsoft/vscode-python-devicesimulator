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
  TOOLBAR_ICON_LABEL,
  CPX_EXPRESS_DOC
} from "./sensor_modal_utils";
import { CLOSE_SVG } from "../../svgs/close_svg";
import { INFO_SVG } from "../../svgs/info_svg";
import { TOOLBAR_INFO } from "../../constants";

const TOOLBAR_BUTTON_WIDTH: number = 32;
const TOOLBAR_EDGE_WIDTH: number = 8;

class ToolBar extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentOpened: "",
      showModal: false
    };
  }

  render() {
    return (
      <div className="toolbar">
        <div className="info">
          <span className="info-icon">{INFO_SVG}</span>
          <span className="info-text">{TOOLBAR_INFO}</span>
          <span className="info-link"> {CPX_EXPRESS_DOC}</span>
        </div>
        <div className="toolbar-icon">
          <Button
            label=""
            width={TOOLBAR_EDGE_WIDTH}
            onClick={() => {}}
            image={TOOLBAR_SVG.lEFT_EDGE_SVG}
            styleLabel="edge"
          />
          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SWITCH)}
            image={TOOLBAR_SVG.SLIDER_SWITCH_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(
              this,
              TOOLBAR_ICON_LABEL.PUSH_BUTTON
            )}
            image={TOOLBAR_SVG.PUSH_BUTTON_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.RED_LED)}
            image={TOOLBAR_SVG.RED_LED_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SOUND)}
            image={TOOLBAR_SVG.SOUND_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(
              this,
              TOOLBAR_ICON_LABEL.TEMPERATURE
            )}
            image={TOOLBAR_SVG.TEMPERATURE_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.LIGHT)}
            image={TOOLBAR_SVG.LIGHT_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SPEAKER)}
            image={TOOLBAR_SVG.SPEAKER_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.MOTION)}
            image={TOOLBAR_SVG.MOTION_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.IR)}
            image={TOOLBAR_SVG.IR_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_BUTTON_WIDTH}
            onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.GPIO)}
            image={TOOLBAR_SVG.GPIO_SVG}
            styleLabel="toolbar"
          />

          <Button
            label=""
            width={TOOLBAR_EDGE_WIDTH}
            onClick={() => {}}
            image={TOOLBAR_SVG.RIGHT_EDGE_SVG}
            styleLabel="edge"
          />
        </div>

        {this.getIconModal()}
      </div>
    );
  }

  private handleOnClick(label: string) {
    if (!this.state.showModal && this.state.currentOpened === "") {
      this.openModal(label);
    } else {
      this.closeCurrentModal();
      this.openModal(label);
    }
  }

  private handleOnBlur = () => {
    this.closeCurrentModal();
  };
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
      this.state.showModal &&
      LABEL_TO_MODAL_CONTENT.get(this.state.currentOpened)
    ) {
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
          {/* make border visivle bottom */}
          <div className="try_area">
            <div className="title"> {content["tryItTitle"]}</div>
            <br />
            <div className="description">{content["tryItDescriptrion"]}</div>
            <div>{component}</div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default ToolBar;
