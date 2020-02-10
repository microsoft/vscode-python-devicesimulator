import pytest
from unittest import mock

from ..__model import constants as CONSTANTS
from ..__model.accelerometer import Accelerometer


class TestAccelerometer(object):
    def setup_method(self):
        self.accelerometer = Accelerometer()

    @pytest.mark.parametrize(
        "accel, expected",
        [
            (CONSTANTS.MIN_ACCELERATION - 10, CONSTANTS.MIN_ACCELERATION),
            (CONSTANTS.MIN_ACCELERATION, CONSTANTS.MIN_ACCELERATION),
            (100, 100),
            (CONSTANTS.MAX_ACCELERATION, CONSTANTS.MAX_ACCELERATION),
            (CONSTANTS.MAX_ACCELERATION + 1, CONSTANTS.MAX_ACCELERATION),
        ],
    )
    def test_x_y_z(self, accel, expected):
        self.accelerometer._Accelerometer__set_x(accel)
        assert expected == self.accelerometer.get_x()
        self.accelerometer._Accelerometer__set_y(accel)
        assert expected == self.accelerometer.get_y()
        self.accelerometer._Accelerometer__set_z(accel)
        assert expected == self.accelerometer.get_z()

    @pytest.mark.parametrize(
        "accels, expected",
        [
            ((23, 25, 26), (23, 25, 26)),
            ((204, 234, -534), (204, 234, -534)),
            (
                (CONSTANTS.MIN_ACCELERATION - 10, 234, CONSTANTS.MAX_ACCELERATION),
                (CONSTANTS.MIN_ACCELERATION, 234, CONSTANTS.MAX_ACCELERATION),
            ),
        ],
    )
    def test_get_values(self, accels, expected):
        self.accelerometer._Accelerometer__set_x(accels[0])
        self.accelerometer._Accelerometer__set_y(accels[1])
        self.accelerometer._Accelerometer__set_z(accels[2])
        assert expected == self.accelerometer.get_values()

    @pytest.mark.parametrize("gesture", ["up", "face down", "freefall", "8g"])
    def test_current_gesture(self, gesture):
        self.accelerometer._Accelerometer__set_gesture(gesture)
        assert gesture == self.accelerometer.current_gesture()

    @pytest.mark.parametrize("gesture", ["up", "face down", "freefall", "8g"])
    def test_is_gesture(self, gesture):
        self.accelerometer._Accelerometer__set_gesture(gesture)
        assert self.accelerometer.is_gesture(gesture)
        for g in CONSTANTS.GESTURES:
            if g != gesture:
                assert not self.accelerometer.is_gesture(g)

    def test_is_gesture_error(self):
        with pytest.raises(ValueError):
            self.accelerometer.is_gesture("sideways")

    def test_was_gesture(self):
        mock_gesture_up = "up"
        mock_gesture_down = "down"
        assert not self.accelerometer.was_gesture(mock_gesture_up)
        self.accelerometer._Accelerometer__set_gesture(mock_gesture_up)
        self.accelerometer.current_gesture()  # Call is needed for gesture detection so it can be added to the lists.
        self.accelerometer._Accelerometer__set_gesture("")
        assert self.accelerometer.was_gesture(mock_gesture_up)
        assert not self.accelerometer.was_gesture(mock_gesture_up)

    def test_was_gesture_error(self):
        with pytest.raises(ValueError):
            self.accelerometer.was_gesture("sideways")

    def test_get_gestures(self):
        mock_gesture_up = "up"
        mock_gesture_down = "down"
        mock_gesture_freefall = "freefall"
        self.accelerometer._Accelerometer__set_gesture(mock_gesture_up)
        self.accelerometer.current_gesture()  # Call is needed for gesture detection so it can be added to the lists.
        self.accelerometer._Accelerometer__set_gesture(mock_gesture_down)
        self.accelerometer.current_gesture()
        self.accelerometer._Accelerometer__set_gesture(mock_gesture_freefall)
        self.accelerometer.current_gesture()
        self.accelerometer._Accelerometer__set_gesture("")
        assert (
            mock_gesture_up,
            mock_gesture_down,
            mock_gesture_freefall,
        ) == self.accelerometer.get_gestures()
        assert () == self.accelerometer.get_gestures()
