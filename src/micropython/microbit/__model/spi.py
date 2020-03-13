from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


class SPI:
    # The implementation is based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/spi.html.
    def init(
        baudrate=1000000, bits=8, mode=0, sclk="pin13", mosi="pin15", miso="pin14"
    ):
        """
        This function is not implemented in the simulator.

        Initialize SPI communication with the specified parameters on the
        specified ``pins``. Note that for correct communication, the parameters
        have to be the same on both communicating devices.

        The ``baudrate`` defines the speed of communication.

        The ``bits`` defines the size of bytes being transmitted. Currently only
        ``bits=8`` is supported. However, this may change in the future.

        The ``mode`` determines the combination of clock polarity and phase
        according to the following convention, with polarity as the high order bit
        and phase as the low order bit:

        Polarity (aka CPOL) 0 means that the clock is at logic value 0 when idle
        and goes high (logic value 1) when active; polarity 1 means the clock is
        at logic value 1 when idle and goes low (logic value 0) when active. Phase
        (aka CPHA) 0 means that data is sampled on the leading edge of the clock,
        and 1 means on the trailing edge.

        The ``sclk``, ``mosi`` and ``miso`` arguments specify the pins to use for
        each type of signal.
        """
        utils.print_for_unimplemented_functions(SPI.init.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPI)

    def read(self, nbytes):
        """
        This function is not implemented in the simulator.

        Read at most ``nbytes``. Returns what was read.
        """
        utils.print_for_unimplemented_functions(SPI.read.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPI)

    def write(self, buffer):
        """
        This function is not implemented in the simulator.

        Write the ``buffer`` of bytes to the bus.
        """
        utils.print_for_unimplemented_functions(SPI.write.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPI)

    def write_readinto(self, out, in_):
        """
        This function is not implemented in the simulator.
 
        Write the ``out`` buffer to the bus and read any response into the ``in_``
        buffer. The length of the buffers should be the same. The buffers can be
        the same object.
        """
        utils.print_for_unimplemented_functions(SPI.write_readinto.__name__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPI)
