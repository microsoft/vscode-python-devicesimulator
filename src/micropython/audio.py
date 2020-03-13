from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent

def play(source, wait=True, pin="pin0", return_pin=None):
    """
    This function is not implemented in the simulator.
    
    Play the source to completion.

    ``source`` is an iterable, each element of which must be an ``AudioFrame``.

    If ``wait`` is ``True``, this function will block until the source is exhausted.

    ``pin`` specifies which pin the speaker is connected to.

    ``return_pin`` specifies a differential pin to connect to the speaker
    instead of ground.
    """
    utils.print_for_unimplemented_functions(play.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_AUDIO)


class AudioFrame:
    """
    This class is not implemented in the simulator.

    An ``AudioFrame`` object is a list of 32 samples each of which is a signed byte
    (whole number between -128 and 127).

    It takes just over 4 ms to play a single frame.
    """
    def __init__(self):
        utils.print_for_unimplemented_functions(AudioFrame.__init__.__qualname__)
        telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_AUDIO)
