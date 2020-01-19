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
  TOOLBAR_ICON_ID
} from "./SensorModalUtils";
import { FormattedMessage, injectIntl } from "react-intl";

interface IToolbarState {
  currentOpenedId: string;
  showModal: boolean;
}

class ToolBar extends React.Component<any, IToolbarState, any> {
  private readonly TOOLBAR_BUTTON_WIDTH: number = 32;
  private readonly TOOLBAR_EDGE_WIDTH: number = 8;

  constructor(props: any) {
    super(props);
    this.state = {
      currentOpenedId: "",
      showModal: false
    };
  }

  render() {
    return (
      <div className="toolbar-parent" id="toolbar-parent">
        <div className="toolbar">
          <div className="toolbar-icon">
            <Button
              label={TOOLBAR_ICON_ID.SWITCH}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.SWITCH);
              }}
              image={TOOLBAR_SVG.SLIDER_SWITCH_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.PUSH_BUTTON}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.PUSH_BUTTON);
              }}
              image={TOOLBAR_SVG.PUSH_BUTTON_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.RED_LED}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={e => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.RED_LED);
              }}
              image={TOOLBAR_SVG.RED_LED_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.SOUND}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.SOUND);
              }}
              image={TOOLBAR_SVG.SOUND_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.TEMPERATURE}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.TEMPERATURE);
              }}
              image={TOOLBAR_SVG.TEMPERATURE_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.LIGHT}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.LIGHT);
              }}
              image={TOOLBAR_SVG.LIGHT_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.NEO_PIXEL}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.NEO_PIXEL);
              }}
              image={TOOLBAR_SVG.NEO_PIXEL_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.SPEAKER}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.SPEAKER);
              }}
              image={TOOLBAR_SVG.SPEAKER_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.MOTION}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.MOTION);
              }}
              image={TOOLBAR_SVG.MOTION_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.IR}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.IR);
              }}
              image={TOOLBAR_SVG.IR_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

            <Button
              label={TOOLBAR_ICON_ID.GPIO}
              width={this.TOOLBAR_BUTTON_WIDTH}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleOnClick(e, TOOLBAR_ICON_ID.GPIO);
              }}
              image={TOOLBAR_SVG.GPIO_SVG}
              styleLabel="toolbar"
              focusable={true}
            />

          </div>
          {this.getIconModal()}
        </div>
      </div>
    );
  }

  private handleOnClick = (
    event: React.MouseEvent<HTMLElement>,
    label: string
  ) => {
    if (
      !this.state.showModal &&
      this.state.currentOpenedId === "" &&
      this.state.currentOpenedId !== label
    ) {
      this.openModal(label);
    } else {
      this.closeCurrentModal();
      if (this.state.currentOpenedId !== label) {
        this.openModal(label);
      }
    }
  };

  private changePressedState(id: string, pressed: boolean) {
    const elt = window.document.getElementById(`${id}-button`);
    if (elt) {
      pressed
        ? elt.classList.add("button-pressed")
        : elt.classList.remove("button-pressed");
    }
  }
  private closeCurrentModal = () => {
    this.changePressedState(this.state.currentOpenedId, false);
    this.setState({
      currentOpenedId: "",
      showModal: false
    });
  };

  private openModal = (label: string) => {
    this.setState({
      currentOpenedId: label,
      showModal: true
    });
    this.changePressedState(label, true);
  };

  private getIconModal() {
    if (
      !this.state.showModal ||
      !LABEL_TO_MODAL_CONTENT.get(this.state.currentOpenedId)
    ) {
      return null;
    }

    const content = LABEL_TO_MODAL_CONTENT.get(
      this.state.currentOpenedId
    ) as IModalContent;

    const component = content
      ? content["component"]
      : DEFAULT_MODAL_CONTENT.component;
    return (
      <div className="sensor_modal">
        <div className="title_group">
          <span className="title">
            <FormattedMessage id={content["descriptionTitle"]} />
            {content["tagInput"]}
            {content["tagOutput"]}
          </span>
        </div>
        <br />
        <div className="description">
          <FormattedMessage id={content["descriptionText"]} />
        </div>
        <div className="try_area">
          <br />
          <span className="description">
            <FormattedMessage id={content["tryItDescription"]} />
          </span>
          <br />

          <div>{component}</div>
        </div>
      </div>
    );
  }
}

export default injectIntl(ToolBar);
