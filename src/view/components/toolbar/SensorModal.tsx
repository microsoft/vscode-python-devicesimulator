import * as React from "react";
import hhgg from "./TemperatureSensorBar";
import TemperatureSensorBar from "./TemperatureSensorBar";

class SensorModal extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    if (!this.props.showModal) {
      return null;
    }
    return (
      <div className="sensor_modal">
        <TemperatureSensorBar />
      </div>
    );
  }
}

export default SensorModal;
