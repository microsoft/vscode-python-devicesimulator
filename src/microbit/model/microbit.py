from .button import Button


class MicrobitModel:
    def __init__(self):
        # State in the Python process
        self.button_a = Button()
        self.button_b = Button()

    def show_message(self, message):
        print("message!! " + message)

mb = MicrobitModel()
