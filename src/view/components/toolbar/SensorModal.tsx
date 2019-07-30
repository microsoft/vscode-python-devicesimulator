import * as React from "react";
import Button from "../Button";

class SensorModal extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);

  }

  render() {
    if(!this.props.showModal){
        return null;
    }
    return <div className="sensor_modal">{this.props.children}</div>;
  }
}

export default SensorModal;
