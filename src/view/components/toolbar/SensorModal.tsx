// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import LightSensorBar from "./LightSensorBar";
import TemperatureSensorBar from "./TemperatureSensorBar";
import MotionSensorBar from "./MotionSensorBar";
import Modal from "../toolbar/SensorModal";
import { TOOLBAR_ICON_LABEL } from "../component_utils";

class SensorModal extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (this.props.showModal && this.props.label == TOOLBAR_ICON_LABEL.LIGHT) {
      return (
        <div>
          <LightSensorBar />
        </div>
      );
      console.log("has been false");
      return null;
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.MOTION
    ) {
      return (
        <div>
          <MotionSensorBar />
        </div>
      );
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.TEMPERATURE
    ) {
      return (
        <div>
          <TemperatureSensorBar />
        </div>
      );
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.LIGHT
    ) {
      return <div>Empty View</div>;
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.LIGHT
    ) {
      return <div>Empty View</div>;
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.LIGHT
    ) {
      return <div>Empty View</div>;
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.LIGHT
    ) {
      return <div>Empty View</div>;
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.LIGHT
    ) {
      return <div>Empty View</div>;
    } else if (
      this.props.showModal &&
      this.props.label == TOOLBAR_ICON_LABEL.LIGHT
    ) {
      return <div>Empty View</div>;
    } else {
      return null;
    }
  }
}

export default SensorModal;
