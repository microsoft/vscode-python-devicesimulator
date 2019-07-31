// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import Button from "../Button";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import "../../styles/ToolBar.css";
import Modal from "../toolbar/SensorModal";

const TOOLBAR_BUTTON_WIDTH: number = 32;
const TOOLBAR_EDGE_WIDTH: number = 8;

class ToolBar extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentOpened: "",
      showModal: false
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  render() {
    return (
      <div className="toolbar">
        <Button
          width={TOOLBAR_EDGE_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.EDGE_SVG}
          label="left_edge"
        />
        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.SLIDER_SWITCH_SVG}
          label="temperature_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.PUSH_BUTTON_SVG}
          label="motion_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.RED_LED_SVG}
          label="light_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.SOUND_SVG}
          label="temperature_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.TEMPERATURE_SVG}
          label="motion_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.LIGHT_SVG}
          label="light_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.SPEAKER_SVG}
          label="temperature_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.MOTION_SVG}
          label="motion_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.IR_SVG}
          label="light_sensor"
        />

        <Button
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.GPIO_SVG}
          label="temperature_sensor"
        />

        <Button
          width={TOOLBAR_EDGE_WIDTH}
          onClick={this.handleOnClick}
          image={TOOLBAR_SVG.EDGE_SVG}
          label="right_edge"
        />
        <Modal />
      </div>
    );
  }

  handleOnClick(event: React.MouseEvent<HTMLElement>) {
    this.setState({ showModal: !this.state.showModal });
  }
}

export default ToolBar;
