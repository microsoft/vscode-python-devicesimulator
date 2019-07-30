import * as React from "react";
import Button from "../Button";
import Temp_Icon from "../../svgs/toolbar_svgs/temperature_svg";
import Light_Icon from "../../svgs/toolbar_svgs/light_svg";
import Motion_Icon from "../../svgs/toolbar_svgs/motion_svg";
import Modal from "../toolbar/SensorModal"

class ToolBar extends React.Component {
  render() {
    return (
      <div className="toolbar">
        
        <Button
          onClick={() => {}}
          image={Temp_Icon}
          label="temperature_sensor"
        >
          <Modal/>
        </Button>

        <Button
          onClick={() => {}}
          image={Motion_Icon}
          label="motion_sensor"
        />
        <Button
          onClick={() => {}}
          image={Light_Icon}
          label="light_sensor"
        />
      </div>
    );
  }
}

export default ToolBar;
