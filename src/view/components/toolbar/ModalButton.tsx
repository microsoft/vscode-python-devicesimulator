// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "../../styles/LightSensorBar.css";
import { IButtonProps } from "../../components/component_utils";
import Modal from "../toolbar/SensorModal";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import Button from "../Button";

class ModalButton extends React.Component<IButtonProps, any, any> {
  constructor(props: IButtonProps) {
    super(props);
    this.state = {
      showModal: false
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  render() {
    return (
      <span className="modal_button">
        <Button
          width={this.props.width}
          onClick={this.handleOnClick}
          image={this.props.image}
          label={this.props.label}
        />
        <Modal showModal={this.state.showModal} />
      </span>
    );
  }

  handleOnClick(event: React.MouseEvent<HTMLElement>) {
    console.log("clicked on the button");
    this.setState({ showModal: !this.state.showModal });
  }
}

export default ModalButton;
