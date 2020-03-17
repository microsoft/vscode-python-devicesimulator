from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


class I2c:
    # The implementation is based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/i2c.html.
    def init(self, freq=100000, sda="pin20", scl="pin19"):
        """
        This function is not implemented in the simulator.

        Re-initialize peripheral with the specified clock frequency ``freq`` on the
        specified ``sda`` and ``scl`` pins.

        Warning:

        Changing the I²C pins from defaults will make the accelerometer and
        compass stop working, as they are connected internally to those pins.
        """
        utils.print_for_unimplemented_functions(I2c.init.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_I2C)

    def scan(self):
        """
        This function is not implemented in the simulator.

        Scan the bus for devices.  Returns a list of 7-bit addresses corresponding
        to those devices that responded to the scan.
        """
        utils.print_for_unimplemented_functions(I2c.scan.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_I2C)

    def read(self, addr, n, repeat=False):
        """
        This function is not implemented in the simulator.

        Read ``n`` bytes from the device with 7-bit address ``addr``. If ``repeat``
        is ``True``, no stop bit will be sent.
        """
        utils.print_for_unimplemented_functions(I2c.read.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_I2C)

    def write(self, addr, buf, repeat=False):
        """
        This function is not implemented in the simulator.
 
        Write bytes from ``buf`` to the device with 7-bit address ``addr``. If
        ``repeat`` is ``True``, no stop bit will be sent.
        """
        utils.print_for_unimplemented_functions(I2c.write.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_I2C)
