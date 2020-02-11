import time

from .accelerometer import Accelerometer
from .button import Button
from .display import Display
from . import constants as CONSTANTS


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.accelerometer = Accelerometer()
        self.button_a = Button()
        self.button_b = Button()
        self.display = Display()

        self.__start_time = time.time()
        self.__temperature = 0
        self.__microbit_button_dict = {
            "button_a": self.button_a,
            "button_b": self.button_b,
        }

    def sleep(self, n):
        time.sleep(n / 1000)

    def running_time(self):
        print(f"time. time: {time.time()}")
        return time.time() - self.__start_time

    def temperature(self):
        return self.__temperature

    def __set_temperature(self, temperature):
        if (
            temperature < CONSTANTS.MIN_TEMPERATURE
            or temperature > CONSTANTS.MAX_TEMPERATURE
        ):
            raise ValueError(CONSTANTS.INVALID_TEMPERATURE_ERR)
        else:
            self.__temperature = temperature

    def update_state(self, new_state):
        for button_name in CONSTANTS.EXPECTED_INPUT_BUTTONS:
            button = self.__microbit_button_dict[button_name]

            previous_pressed = button.is_pressed()
            button_pressed = new_state.get(button_name, previous_pressed)

            if button_pressed != previous_pressed:
                if button_pressed:
                    button._Button__press_down()
                else:
                    button._Button__release()

            # set motion_x, motion_y, motion_z
            for name, direction in CONSTANTS.EXPECTED_INPUT_ACCEL.items():
                previous_motion_val = self.accelerometer._Accelerometer__get_accel(
                    direction
                )
                new_motion_val = new_state.get(name, previous_motion_val)
                if new_motion_val != previous_motion_val:
                    self.accelerometer._Accelerometer__set_accel(
                        direction, new_motion_val
                    )

            # set temperature
            previous_temp = self.temperature()
            new_temp = new_state.get(CONSTANTS.EXPECTED_INPUT_TEMP, previous_temp)
            if new_temp != previous_temp:
                self._MicrobitModel__set_temperature(new_temp)

            # set light level
            previous_light_level = self.display.read_light_level()
            new_light_level = new_state.get(
                CONSTANTS.EXPECTED_INPUT_LIGHT, previous_light_level
            )
            if new_light_level != previous_light_level:
                self.display._Display__set_light_level(new_light_level)


__mb = MicrobitModel()
