from .display import Display
from .button import Button


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.display = Display()
        self.button_a = Button()
        self.button_b = Button()
        self.__state = {}
        self.__debug_mode = False
        self.__abs_path_to_code_file = ""

    # SAMPLE FUNCTION
    def show_message(self, message):
        print("message!! " + message)


mb = MicrobitModel()
