class Button:
    # The implementation is based off of https://github.com/bbcmicrobit/micropython/blob/master/docs/button.rst.
    def __init__(self):
        self.__pressed = False
        self.__presses = 0
        self.__prev_pressed = False

    def is_pressed(self):
        return self.__pressed

    def was_pressed(self):
        res = self.__prev_pressed
        self.__prev_pressed = False
        return res

    def get_presses(self):
        res = self.__presses
        self.__presses = 0
        return res

    def __press_down(self):
        self.__pressed = True
        self.__prev_pressed = True
        self.__presses += 1

    def __release(self):
        self.__pressed = False
