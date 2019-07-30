// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";

class SensorModal extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (!this.props.showModal) {
      console.log("has been false");
      return null;
    }
    console.log("has been true");
    return <div className="sensor_modal">hellooooooooo</div>;
  }
}

export default SensorModal;
