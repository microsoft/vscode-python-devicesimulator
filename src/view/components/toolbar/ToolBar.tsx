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
} from "./sensor_modal_utils";
import { CLOSE_SVG } from "../../svgs/close_svg";
import { string } from "prop-types";

const TOOLBAR_BUTTON_WIDTH: number = 32;
const TOOLBAR_EDGE_WIDTH: number = 8;

class ToolBar extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentOpened: "",
      showModal: false
    };
    this.closeCurrentModal = this.closeCurrentModal.bind(this);
  }

  render() {
    return (
      <div className="toolbar">
        <Button
          width={TOOLBAR_EDGE_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.LEFT_EDGE)}
          image={TOOLBAR_SVG.EDGE_SVG}
          label={TOOLBAR_ICON_LABEL.LEFT_EDGE}
        />
        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SWITCH)}
          image={TOOLBAR_SVG.SLIDER_SWITCH_SVG}
          label={TOOLBAR_ICON_LABEL.SWITCH}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(
            this,
            TOOLBAR_ICON_LABEL.PUSH_BUTTON
          )}
          image={TOOLBAR_SVG.PUSH_BUTTON_SVG}
          label={TOOLBAR_ICON_LABEL.PUSH_BUTTON}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.RED_LED)}
          image={TOOLBAR_SVG.RED_LED_SVG}
          label={TOOLBAR_ICON_LABEL.RED_LED}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SOUND)}
          image={TOOLBAR_SVG.SOUND_SVG}
          label={TOOLBAR_ICON_LABEL.SOUND}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(
            this,
            TOOLBAR_ICON_LABEL.TEMPERATURE
          )}
          image={TOOLBAR_SVG.TEMPERATURE_SVG}
          label={TOOLBAR_ICON_LABEL.TEMPERATURE}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.LIGHT)}
          image={TOOLBAR_SVG.LIGHT_SVG}
          label={TOOLBAR_ICON_LABEL.LIGHT}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.SPEAKER)}
          image={TOOLBAR_SVG.SPEAKER_SVG}
          label={TOOLBAR_ICON_LABEL.SPEAKER}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.MOTION)}
          image={TOOLBAR_SVG.MOTION_SVG}
          label={TOOLBAR_ICON_LABEL.MOTION}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.IR)}
          image={TOOLBAR_SVG.IR_SVG}
          label={TOOLBAR_ICON_LABEL.IR}
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.GPIO)}
          image={TOOLBAR_SVG.GPIO_SVG}
          label={TOOLBAR_ICON_LABEL.GPIO}
        />

        <Button
          width={TOOLBAR_EDGE_WIDTH}
          onClick={this.handleOnClick.bind(this, TOOLBAR_ICON_LABEL.RIGHT_EDGE)}
          image={TOOLBAR_SVG.EDGE_SVG}
          label={TOOLBAR_ICON_LABEL.RIGHT_EDGE}
        />
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

  private closeCurrentModal() {
    console.log(" colsed");
    this.setState({ showModal: false });
    this.setState({ currentOpened: "" });
  }

  private openModal(label: string) {
    this.setState({ currentOpened: label });
    this.setState({ showModal: true });
  }

  private getIconModal() {
    console.log(
      `getting ${this.state.showModal} AND ${this.state.currentOpened}`
    );
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
            <div className="title">{content["descriptionTitle"]}</div>
            <div className="tag">{content["tag"]}</div>
            <div className="close_icon" onMouseDown={this.closeCurrentModal}>
              {CLOSE_SVG}
            </div>
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
