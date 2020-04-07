from common import utils


class PulseIn:
    def __init__(self, pin, maxlen=2, *, idle_state=False):
        utils.print_for_unimplemented_functions(PulseIn.__init__.__qualname__)


class PulseOut:
    def __init__(self, carrier):
        utils.print_for_unimplemented_functions(PulseOut.__init__.__qualname__)


class PWMOut:
    def __init__(self, pin, *, duty_cycle=0, frequency=500, variable_frequency=False):
        utils.print_for_unimplemented_functions(PWMOut.__init__.__qualname__)
