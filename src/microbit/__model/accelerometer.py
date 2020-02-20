from . import constants as CONSTANTS
from common.telemetry import telemetry_py


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
        telemetry_py.send_telemetry("MICROBIT_API_ACCELEROMETER")
        return self.__x

    def get_y(self):
        """
        Get the acceleration measurement in the ``y`` axis, as a positive or
        negative integer, depending on the direction. The measurement is given in
        milli-g.
        """
        telemetry_py.send_telemetry("MICROBIT_API_ACCELEROMETER")
        return self.__y

    def get_z(self):
        """
        Get the acceleration measurement in the ``z`` axis, as a positive or
        negative integer, depending on the direction. The measurement is given in
        milli-g.
        """
        telemetry_py.send_telemetry("MICROBIT_API_ACCELEROMETER")
        return self.__z

    def get_values(self):
        """
        Get the acceleration measurements in all axes at once, as a three-element
        tuple of integers ordered as X, Y, Z.
        """
        telemetry_py.send_telemetry("MICROBIT_API_ACCELEROMETER")
        return (self.__x, self.__y, self.__z)

    def current_gesture(self):
        """
        Return the name of the current gesture.
        """
        telemetry_py.send_telemetry("MICROBIT_API_GESTURE")
        self.__add_current_gesture_to_gesture_lists()
        return self.__current_gesture

    def is_gesture(self, name):
        """
        Return True or False to indicate if the named gesture is currently active.
        """
        telemetry_py.send_telemetry("MICROBIT_API_GESTURE")
        self.__add_current_gesture_to_gesture_lists()
        if name not in CONSTANTS.GESTURES:
            raise ValueError(CONSTANTS.INVALID_GESTURE_ERR)
        return name == self.__current_gesture

    def was_gesture(self, name):
        """
        Return True or False to indicate if the named gesture was active since the
        last [was_gesture] call.
        """
        telemetry_py.send_telemetry("MICROBIT_API_GESTURE")
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
        telemetry_py.send_telemetry("MICROBIT_API_GESTURE")
        self.__add_current_gesture_to_gesture_lists()
        gestures = tuple(self.__gestures)
        self.__gestures.clear()
        return gestures

    # Helpers and Hidden Functions

    def __get_accel(self, axis):
        if axis == "x":
            return self.get_x()
        elif axis == "y":
            return self.get_y()
        elif axis == "z":
            return self.get_z()

    def __set_accel(self, axis, accel):
        if accel < CONSTANTS.MIN_ACCELERATION or accel > CONSTANTS.MAX_ACCELERATION:
            raise ValueError(CONSTANTS.INVALID_ACCEL_ERR)
        if axis == "x":
            self.__x = accel
        elif axis == "y":
            self.__y = accel
        elif axis == "z":
            self.__z = accel

    def __set_gesture(self, gesture):
        if gesture in CONSTANTS.GESTURES:
            self.__current_gesture = gesture
        elif gesture == "":
            self.__current_gesture = ""
        else:
            raise ValueError(CONSTANTS.INVALID_GESTURE_ERR)

    def __add_current_gesture_to_gesture_lists(self):
        if self.__current_gesture in CONSTANTS.GESTURES:
            self.__gestures.append(self.__current_gesture)
            self.__prev_gestures.add(self.__current_gesture)

    def __update(self, axis, accel):
        if accel is not None:
            previous_accel = self.__get_accel(axis)
            if accel != previous_accel:
                self.__set_accel(axis, accel)
