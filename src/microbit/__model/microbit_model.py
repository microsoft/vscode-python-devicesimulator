import time

from .button import Button
from .display import Display
from . import constants as CONSTANTS


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.button_a = Button()
        self.button_b = Button()
        self.__start_time = time.time()
        self.display = Display()

        self.microbit_button_dict = {
            "button_a": self.button_a,
            "button_b": self.button_b,
        }

    def sleep(self, n):
        time.sleep(n / 1000)

    def running_time(self):
        print(f"time. time: {time.time()}")
        return time.time() - self.__start_time

    def update_state(self, new_state):
        for button_name in CONSTANTS.EXPECTED_INPUT_BUTTONS:
            button = self.microbit_button_dict[button_name]

            previous_pressed = button.is_pressed()
            button_pressed = new_state.get(button_name, previous_pressed)

            if button_pressed != previous_pressed:
                if button_pressed:
                    button._Button__press_down()
                else:
                    button._Button__release()


__mb = MicrobitModel()
