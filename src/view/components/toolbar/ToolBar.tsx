import * as React from "react";
import Button from "../Button";
import { ReactComponent } from "*.svg";
import Temp_Icon from "../../svgs/toolbar_temperature_svg";
import Light_Icon from "../../svgs/toolbar_light_svg";
import Edge_Icon from "../../svgs/toolbar_edge_svg";
import Motion_Icon from "../../svgs/toolbar_motion_svg";

class ToolBar extends React.Component {
  render() {
    return (
      <div className="toolbar">
        <Button
          onClick={() => {}}
          image={Temp_Icon}
          label="temperature_sensor"
        />
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
