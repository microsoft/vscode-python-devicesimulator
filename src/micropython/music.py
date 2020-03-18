from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent

# The implementation is based off of https://microbit-micropython.readthedocs.io/en/v1.0.1/music.html.


def set_tempo(ticks=4, bpm=120):
    """
    This function is not implemented in the simulator.
    
    Sets the approximate tempo for playback.

    A number of ticks (expressed as an integer) constitute a beat. Each beat is to be played at a certain frequency per minute (expressed as the more familiar BPM - beats per minute - also as an integer).

    Suggested default values allow the following useful behaviour:

    * ``music.set_tempo()`` - reset the tempo to default of ticks = 4, bpm = 120
    * ``music.set_tempo(ticks=8)`` - change the "definition" of a beat
    * ``music.set_tempo(bpm=180)`` - just change the tempo

    To work out the length of a tick in milliseconds is very simple arithmetic: ``60000/bpm/ticks_per_beat`` . For the default values that's ``60000/120/4 = 125 milliseconds`` or ``1 beat = 500 milliseconds``.
    """
    utils.print_for_unimplemented_functions(set_tempo.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_MUSIC)


def get_tempo():
    """
    This function is not implemented in the simulator.
    
    Gets the current tempo as a tuple of integers: ``(ticks, bpm)``.
    """
    utils.print_for_unimplemented_functions(get_tempo.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_MUSIC)


def play(music, pin="microbit.pin0", wait=True, loop=False):
    """
    This function is not implemented in the simulator.
    
    Plays ``music`` containing the musical DSL defined above.

    If ``music`` is a string it is expected to be a single note such as,
    ``'c1:4'``.

    If ``music`` is specified as a list of notes (as defined in the section on
    the musical DSL, above) then they are played one after the other to perform
    a melody.

    In both cases, the ``duration`` and ``octave`` values are reset to
    their defaults before the music (whatever it may be) is played.

    An optional argument to specify the output pin can be used to override the
    default of ``microbit.pin0``.

    If ``wait`` is set to ``True``, this function is blocking.

    If ``loop`` is set to ``True``, the tune repeats until ``stop`` is called
    (see below) or the blocking call is interrupted.
    """
    utils.print_for_unimplemented_functions(play.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_MUSIC)


def pitch(frequency, duration=-1, pin="microbit.pin0", wait=True):
    """
    This function is not implemented in the simulator.
    
    Plays a pitch at the integer frequency given for the specified number of
    milliseconds. For example, if the frequency is set to 440 and the length to
    1000 then we hear a standard concert A for one second.

    Note that you can only play one pitch on one pin at any one time.

    If ``wait`` is set to ``True``, this function is blocking.

    If ``duration`` is negative the pitch is played continuously until either the
    blocking call is interrupted or, in the case of a background call, a new
    frequency is set or ``stop`` is called (see below).
    """
    utils.print_for_unimplemented_functions(pitch.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_MUSIC)


def stop(pin="microbit.pin0"):
    """
    This function is not implemented in the simulator.
    
    Stops all music playback on a given pin, eg. ``music.stop(pin1)``.
    If no pin is given, eg. ``music.stop()`` pin0 is assumed.
    """
    utils.print_for_unimplemented_functions(stop.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_MUSIC)


def reset():
    """
    This function is not implemented in the simulator.
    
    Resets the state of the following attributes in the following way:

        * ``ticks = 4``
        * ``bpm = 120``
        * ``duration = 4``
        * ``octave = 4``
    """
    utils.print_for_unimplemented_functions(reset.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_MUSIC)
