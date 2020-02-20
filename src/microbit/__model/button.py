from common.telemetry import telemetry_py


class Button:
    # The implementation is based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/button.html.
    def __init__(self):
        self.__pressed = False
        self.__presses = 0
        self.__prev_pressed = False

    def is_pressed(self):
        """
        Returns ``True`` if the specified button ``button`` is currently being
        held down, and ``False`` otherwise.
        """
        telemetry_py.send_telemetry("MICROBIT_API_BUTTON")
        return self.__pressed

    def was_pressed(self):
        """
        Returns ``True`` or ``False`` to indicate if the button was pressed
        (went from up to down) since the device started or the last time this
        method was called.  Calling this method will clear the press state so
        that the button must be pressed again before this method will return
        ``True`` again.
        """
        telemetry_py.send_telemetry("MICROBIT_API_BUTTON")
        res = self.__prev_pressed
        self.__prev_pressed = False
        return res

    def get_presses(self):
        """
        Returns the running total of button presses, and resets this total
        to zero before returning.
        """
        telemetry_py.send_telemetry("MICROBIT_API_BUTTON")
        res = self.__presses
        self.__presses = 0
        return res

    def __press_down(self):
        self.__pressed = True
        self.__prev_pressed = True
        self.__presses += 1

    def __release(self):
        self.__pressed = False

    def __update(self, is_button_pressed):
        if is_button_pressed is not None:
            was_button_pressed = self.is_pressed()

            if is_button_pressed != was_button_pressed:
                if is_button_pressed:
                    self.__press_down()
                else:
                    self.__release()
