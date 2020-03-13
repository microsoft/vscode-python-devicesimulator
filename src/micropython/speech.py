from common import utils
from common.telemetry import telemetry_py
from common.telemetry_events import TelemetryEvent


def translate(words):
    """
    This function is not implemented in the simulator.
    
    Given English words in the string ``words``, return a string containing
    a best guess at the appropriate phonemes to pronounce. The output is
    generated from this
    `text to phoneme translation table <https://github.com/s-macke/SAM/wiki/Text-to-phoneme-translation-table>`_.

    This function should be used to generate a first approximation of phonemes
    that can be further hand-edited to improve accuracy, inflection and
    emphasis.
    """
    utils.print_for_unimplemented_functions(translate.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPEECH)


def pronounce(phonemes, pitch=64, speed=72, mouth=128, throat=128):
    """
    This function is not implemented in the simulator.

    Pronounce the phonemes in the string ``phonemes``. See below for details of
    how to use phonemes to finely control the output of the speech synthesiser.
    Override the optional pitch, speed, mouth and throat settings to change the
    timbre (quality) of the voice.
    """
    utils.print_for_unimplemented_functions(pronounce.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPEECH)


def say(words, pitch=64, speed=72, mouth=128, throat=128):
    """
    This function is not implemented in the simulator.
    
    Say the English words in the string ``words``. The result is semi-accurate
    for English. Override the optional pitch, speed, mouth and throat
    settings to change the timbre (quality) of the voice. This is a short-hand
    equivalent of: ``speech.pronounce(speech.translate(words))``
    """
    utils.print_for_unimplemented_functions(say.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPEECH)


def sing(phonemes, pitch=64, speed=72, mouth=128, throat=128):
    """
    This function is not implemented in the simulator.
    
    Sing the phonemes contained in the string ``phonemes``. Changing the pitch
    and duration of the note is described below. Override the optional pitch,
    speed, mouth and throat settings to change the timbre (quality) of the
    voice.
    """
    utils.print_for_unimplemented_functions(sing.__name__)
    telemetry_py.send_telemetry(TelemetryEvent.MICROBIT_API_SPEECH)
