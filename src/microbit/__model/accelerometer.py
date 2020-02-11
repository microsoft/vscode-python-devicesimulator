from . import constants as CONSTANTS


class Accelerometer:
    # The implementation is based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/accelerometer.html.
    def __init__(self):
        self.__x = 0
        self.__y = 0
        self.__z = 0
        self.__current_gesture = ""
        self.__prev_gestures = set()
        self.__gestures = []

    def get_x(self):
        """
        Get the acceleration measurement in the ``x`` axis, as a positive or
        negative integer, depending on the direction. The measurement is given in
        milli-g.
        """
        return self.__x

    def get_y(self):
        """
        Get the acceleration measurement in the ``y`` axis, as a positive or
        negative integer, depending on the direction. The measurement is given in
        milli-g.
        """
        return self.__y

    def get_z(self):
        """
        Get the acceleration measurement in the ``z`` axis, as a positive or
        negative integer, depending on the direction. The measurement is given in
        milli-g.
        """
        return self.__z

    def get_values(self):
        """
        Get the acceleration measurements in all axes at once, as a three-element
        tuple of integers ordered as X, Y, Z.
        """
        return (self.__x, self.__y, self.__z)

    def current_gesture(self):
        """
        Return the name of the current gesture.
        """
        self.__add_current_gesture_to_gesture_lists()
        return self.__current_gesture

    def is_gesture(self, name):
        """
        Return True or False to indicate if the named gesture is currently active.
        """
        self.__add_current_gesture_to_gesture_lists()
        if name not in CONSTANTS.GESTURES:
            raise ValueError(CONSTANTS.INVALID_GESTURE_ERR)
        return name == self.__current_gesture

    def was_gesture(self, name):
        """
        Return True or False to indicate if the named gesture was active since the
        last call.
        """
        self.__add_current_gesture_to_gesture_lists()
        if name not in CONSTANTS.GESTURES:
            raise ValueError(CONSTANTS.INVALID_GESTURE_ERR)
        was_gesture = name in self.__prev_gestures
        self.__prev_gestures.clear()
        return was_gesture

    def get_gestures(self):
        """
        Return a tuple of the gesture history. The most recent is listed last.
        Also clears the gesture history before returning.
        """
        self.__add_current_gesture_to_gesture_lists()
        gestures = tuple(self.__gestures)
        self.__gestures.clear()
        return gestures

    # Helpers and Hidden Functions

    def __set_x(self, x):
        self.__x = self.__get_valid_acceleration(x)

    def __set_y(self, y):
        self.__y = self.__get_valid_acceleration(y)

    def __set_z(self, z):
        self.__z = self.__get_valid_acceleration(z)

    def __get_valid_acceleration(self, acceleration):
        if acceleration < CONSTANTS.MIN_ACCELERATION:
            return CONSTANTS.MIN_ACCELERATION
        elif acceleration > CONSTANTS.MAX_ACCELERATION:
            return CONSTANTS.MAX_ACCELERATION
        else:
            return acceleration

    def __get_accel(self, axis):
        if axis == "x":
            return self.get_x()
        elif axis == "y":
            return self.get_y()
        elif axis == "z":
            return self.get_z()

    def __set_accel(self, axis, accel):
        if axis == "x":
            self.__x = self.__get_valid_acceleration(accel)
        elif axis == "y":
            self.__y = self.__get_valid_acceleration(accel)
        elif axis == "z":
            self.__z = self.__get_valid_acceleration(accel)

    def __set_gesture(self, gesture):
        if gesture in CONSTANTS.GESTURES:
            self.__current_gesture = gesture
        else:
            self.__current_gesture = ""

    def __add_current_gesture_to_gesture_lists(self):
        if self.__current_gesture in CONSTANTS.GESTURES:
            self.__gestures.append(self.__current_gesture)
            self.__prev_gestures.add(self.__current_gesture)
