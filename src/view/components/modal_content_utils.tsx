import LightSensorBar from "./toolbar/LightSensorBar";
import TemperatureSensorBar from "./toolbar//TemperatureSensorBar";
import MotionSensorBar from "./toolbar/MotionSensorBar";

export interface IModalContent {
  descriptionTitle: string;
  tag: string;
  descriptionText: string;
  tryItTitle: string;
  tryItDescriptrion: string;
  component: any;
}

export const TEMPERATURE_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Temperature Sensor",
  tag: "input",
  descriptionText:
    "An NTC thermistor can sense temperature. Easy to calculate the temperature based on the analog voltage on analog pin #A9",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "You can set the temperature range from your code, as well as C or F!",
  component: TemperatureSensorBar
};
export const LIGHT_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Light Sensor",
  tag: "input",
  descriptionText:
    "An analog light sensor can be used to detect ambient light, with similar spectral response to the human eye.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: " Change the brightness from 0 - 255 here!",
  component: LightSensorBar
};
export const MOTION_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Motion Sensor",
  tag: "input",
  descriptionText:
    "Detects acceleration in XYZ orientations. And can also detect tilt, gravity, motion, as well as 'tap' and 'double tap' strikes on the board. ",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Change the acceleration here and click on the sensor on the board to simulate the “tap”!  ",
  component: MotionSensorBar
};
export const SWITCH_MODAL_CONTENT: IModalContent = {
  descriptionTitle: "Slide Switch ",
  tag: "input",
  descriptionText:
    "This slide switch returns True or False depending on whether it's left or right and can be used as a toggle switch in your code!",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion: "Click it with your mouse to switch it on and off!",
  component: MotionSensorBar
};
export const PUSHB_MODAL_CONTENT: IModalContent = {
  descriptionTitle: " Push Buttons",
  tag: "input",
  descriptionText:
    "Two push buttons A and B are connected to digital pin #4 (Left) and #5 (Right) each.",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    "Click them with your mouse or pressing “A” “B” on your keyboard!",
  component: MotionSensorBar
};
export const REDL_LED_MODAL_CONTENT: IModalContent = {
  descriptionTitle: " Red LED",
  tag: "Output ",
  descriptionText:
    "This Red LED does double duty. It's connected to the digital #13 GPIO pin, very handy for when you want an indicator LED",
  tryItTitle: "Try it on the Simulator!",
  tryItDescriptrion:
    " Run your code and see the cool effects on the simulator!",
  component: MotionSensorBar
};
