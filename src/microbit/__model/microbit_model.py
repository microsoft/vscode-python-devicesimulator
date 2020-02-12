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
        self.__update_buttons(new_state)
        self.__update_motion(new_state)
        self.__update_light(new_state)
        self.__update_temp(new_state)

    # helpers
    def __update_buttons(self, new_state):
        # get button pushes
        for button_name in CONSTANTS.EXPECTED_INPUT_BUTTONS:
            button = self.__microbit_button_dict[button_name]
            button._Button__update(new_state.get(button_name))

    def __update_motion(self, new_state):
        # set motion_x, motion_y, motion_z
        for name, direction in CONSTANTS.EXPECTED_INPUT_ACCEL.items():
            self.accelerometer._Accelerometer__update(direction, new_state.get(name))
            
    def __update_light(self, new_state):
        # set light level
        new_light_level = new_state.get(
            CONSTANTS.EXPECTED_INPUT_LIGHT
        )
        self.display._Display__update_light_level(new_light_level)

    def __update_temp(self, new_state):
        # set temperature
        new_temp = new_state.get(CONSTANTS.EXPECTED_INPUT_TEMP)
        if new_temp is not None:
            previous_temp = self.temperature()
            if new_temp != previous_temp:
                self._MicrobitModel__set_temperature(new_temp)


__mb = MicrobitModel()
