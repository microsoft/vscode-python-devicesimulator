from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


class Compass:
    # The implementation is based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/compass.html.
    def calibrate(self):
        """
        This function is not implemented in the simulator.

        Starts the calibration process. When this function is called on the physical device, an instructive message will be scrolled to the user after which they will need to rotate the device in order to draw a circle on the LED display on the actual device.
        """
        utils.print_for_unimplemented_functions(Compass.calibrate.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def is_calibrated(self):
        """
        This function is not implemented in the simulator.

        Returns ``True`` if the compass has been successfully calibrated, and
        returns ``False`` otherwise.
        """
        utils.print_for_unimplemented_functions(Compass.is_calibrated.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def clear_calibration(self):
        """
        This function is not implemented in the simulator.

        Undoes the calibration, making the compass uncalibrated again.
        """
        utils.print_for_unimplemented_functions(Compass.clear_calibration.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def get_x(self):
        """
        This function is not implemented in the simulator.
 
        Gives the reading of the magnetic field strength on the ``x`` axis in nano
        tesla, as a positive or negative integer, depending on the direction of the
        field.
        """
        utils.print_for_unimplemented_functions(Compass.get_x.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def get_y(self):
        """
        This function is not implemented in the simulator.

        Gives the reading of the magnetic field strength on the ``y`` axis in nano
        tesla, as a positive or negative integer, depending on the direction of the
        field.
        """
        utils.print_for_unimplemented_functions(Compass.get_y.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def get_z(self):
        """
        This function is not implemented in the simulator.

        Gives the reading of the magnetic field strength on the ``z`` axis in nano
        tesla, as a positive or negative integer, depending on the direction of the
        field.
        """
        utils.print_for_unimplemented_functions(Compass.get_z.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def heading(self):
        """
        This function is not implemented in the simulator.
        
        Gives the compass heading, calculated from the above readings, as an
        integer in the range from 0 to 360, representing the angle in degrees,
        clockwise, with north as 0.
        """
        utils.print_for_unimplemented_functions(Compass.heading.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)

    def get_field_strength(self):
        """
        This function is not implemented in the simulator.
        
        Returns an integer indication of the magnitude of the magnetic field around
        the device in nano tesla.
        """
        utils.print_for_unimplemented_functions(Compass.get_field_strength.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_COMPASS)
