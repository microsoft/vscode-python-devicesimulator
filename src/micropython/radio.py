from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent

RATE_250KBIT = ""

RATE_1MBIT = ""

RATE_2MBIT = ""


def on():
    """
    This function is not implemented in the simulator.
    
    Turns the radio on. This needs to be explicitly called since the radio
    draws power and takes up memory that you may otherwise need.
    """
    utils.print_for_unimplemented_functions(on.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def off():
    """
    This function is not implemented in the simulator.
    
    Turns off the radio, thus saving power and memory
    """
    utils.print_for_unimplemented_functions(off.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def config(**kwargs):
    """
    This function is not implemented in the simulator.
    
    Configures various keyword based settings relating to the radio. The
    available settings and their sensible default values are listed below.

    The ``length`` (default=32) defines the maximum length, in bytes, of a
    message sent via the radio. It can be up to 251 bytes long (254 - 3 bytes
    for S0, LENGTH and S1 preamble).

    The ``queue`` (default=3) specifies the number of messages that can be
    stored on the incoming message queue. If there are no spaces left on the
    queue for incoming messages, then the incoming message is dropped.

    The ``channel`` (default=7) can be an integer value from 0 to 83
    (inclusive) that defines an arbitrary "channel" to which the radio is
    tuned. Messages will be sent via this channel and only messages received
    via this channel will be put onto the incoming message queue. Each step is
    1MHz wide, based at 2400MHz.

    The ``power`` (default=6) is an integer value from 0 to 7 (inclusive) to
    indicate the strength of signal used when broadcasting a message. The
    higher the value the stronger the signal, but the more power is consumed
    by the device. The numbering translates to positions in the following list
    of dBm (decibel milliwatt) values: -30, -20, -16, -12, -8, -4, 0, 4.

    The ``address`` (default=0x75626974) is an arbitrary name, expressed as a
    32-bit address, that's used to filter incoming packets at the hardware
    level, keeping only those that match the address you set. The default used
    by other micro:bit related platforms is the default setting used here.

    The ``group`` (default=0) is an 8-bit value (0-255) used with the
    ``address`` when filtering messages. Conceptually, "address" is like a
    house/office address and "group" is like the person at that address to
    which you want to send your message.

    The ``data_rate`` (default=radio.RATE_1MBIT) indicates the speed at which
    data throughput takes place. Can be one of the following contants defined
    in the ``radio`` module : ``RATE_250KBIT``, ``RATE_1MBIT`` or
    ``RATE_2MBIT``.

    If ``config`` is not called then the defaults described above are assumed.
    """
    utils.print_for_unimplemented_functions(config.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def reset():
    """
    This function is not implemented in the simulator.
    
    Reset the settings to their default values (as listed in the documentation
    for the ``config`` function above).
    """
    utils.print_for_unimplemented_functions(reset.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def send_bytes(message):
    """
    This function is not implemented in the simulator.
    
    Sends a message containing bytes.
    """
    utils.print_for_unimplemented_functions(send_bytes.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def receive_bytes():
    """
    This function is not implemented in the simulator.
    
    Receive the next incoming message on the message queue. Returns ``None`` if
    there are no pending messages. Messages are returned as bytes.
    """
    utils.print_for_unimplemented_functions(receive_bytes.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def receive_bytes_into(buffer):
    """
    This function is not implemented in the simulator.
    
    Receive the next incoming message on the message queue. Copies the message
    into ``buffer``, trimming the end of the message if necessary.
    Returns ``None`` if there are no pending messages, otherwise it returns the length
    of the message (which might be more than the length of the buffer).
    """
    utils.print_for_unimplemented_functions(receive_bytes_into.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def send(message):
    """
    This function is not implemented in the simulator.

    Sends a message containing bytes.
    """
    utils.print_for_unimplemented_functions(send.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def receive():
    """
    This function is not implemented in the simulator.
    
    Works in exactly the same way as ``receive_bytes`` but returns
    whatever was sent.

    Currently, it's equivalent to ``str(receive_bytes(), 'utf8')`` but with a
    check that the the first three bytes are ``b'\x01\x00\x01'`` (to make it
    compatible with other platforms that may target the micro:bit). It strips
    the prepended bytes before converting to a string.

    A ``ValueError`` exception is raised if conversion to string fails.
    """
    utils.print_for_unimplemented_functions(receive.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)


def receive_full():
    """
    This function is not implemented in the simulator.
    
    Returns a tuple containing three values representing the next incoming
    message on the message queue. If there are no pending messages then
    ``None`` is returned.

    The three values in the tuple represent:

    * the next incoming message on the message queue as bytes.
    * the RSSI (signal strength): a value between 0 (strongest) and -255 (weakest) as measured in dBm.
    * a microsecond timestamp: the value returned by ``time.ticks_us()`` when the message was received.

    For example::

        details = radio.receive_full()
        if details:
            msg, rssi, timestamp = details

    This function is useful for providing information needed for triangulation
    and/or triliteration with other micro:bit devices.
    """
    utils.print_for_unimplemented_functions(receive_full.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_RADIO)
