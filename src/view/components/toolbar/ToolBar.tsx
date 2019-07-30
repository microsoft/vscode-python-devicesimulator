import * as React from "react";
import ModalButton from "../toolbar/ModalButton";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import "../../styles/ToolBar.css";
import Modal from "../toolbar/SensorModal";

const TOOLBAR_BUTTON_WIDTH: number = 32;
const TOOLBAR_EDGE_WIDTH: number = 8;

class ToolBar extends React.Component {
  render() {
    return (
      <div className="toolbar">
        <ModalButton
          width={TOOLBAR_EDGE_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.EDGE_SVG}
          label="left_edge"
        />
        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.SLIDER_SWITCH_SVG}
          label="temperature_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.PUSH_BUTTON_SVG}
          label="motion_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.RED_LED_SVG}
          label="light_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.SOUND_SVG}
          label="temperature_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.TEMPERATURE_SVG}
          label="motion_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.LIGHT_SVG}
          label="light_sensor"
        >
          <Modal />
        </ModalButton>
        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.SPEAKER_SVG}
          label="temperature_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.MOTION_SVG}
          label="motion_sensor"
        >
          <Modal />
        </ModalButton>

        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.IR_SVG}
          label="light_sensor"
        >
          <Modal />
        </ModalButton>
        <ModalButton
          width={TOOLBAR_BUTTON_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.GPIO_SVG}
          label="temperature_sensor"
        >
          <Modal />
        </ModalButton>
        <ModalButton
          width={TOOLBAR_EDGE_WIDTH}
          onClick={() => {}}
          image={TOOLBAR_SVG.EDGE_SVG}
          label="right_edge"
        />
      </div>
    );
  }
}

export default ToolBar;
