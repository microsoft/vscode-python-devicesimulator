from . import constants as CONSTANTS
from applicationinsights import TelemetryClient


class Telemetry:
    def __init__(self):
        # State of the telemetry
        self.__enable_telemetry = True
        self.telemetry_state = {
            "DETECT_TAPS": False,
            "TAPPED": False,
            "RED_LED": False,
            "ADJUST_THRESHOLD": False,
            "PLAY_FILE": False,
            "PLAY_TONE": False,
            "START_TONE": False,
            "STOP_TONE": False,
        }
        self.telemetry_client = TelemetryClient('__AIKEY__')
        self.extension_name = '__EXTENSIONNAME__'

    def send_telemetry(self, event_name):
        print('entred telem sending {} with {}'.format(
            event_name, self.__enable_telemetry), flush=True)
        if self.telemetry_available() and not self.telemetry_state[event_name] and self.__enable_telemetry:
            print('both true {}'.format(event_name), flush=True)
            self.telemetry_client.track_event(
                '{}/{}'.format(self.extension_name, CONSTANTS.TELEMETRY_EVENT_NAMES[event_name]))
            self.telemetry_client.flush()
            self.telemetry_state[event_name] = True

    def telemetry_available(self):
        return self.telemetry_client.context.instrumentation_key != '__AIKEY__'


telemetry_py = Telemetry()
