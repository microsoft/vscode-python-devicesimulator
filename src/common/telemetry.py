from applicationinsights import TelemetryClient
from . import constants as CONSTANTS


class Telemetry:
    def __init__(self):
        # State of the telemetry
        self.__enable_telemetry = True
        self.telemetry_client = TelemetryClient("__AIKEY__")
        self.telemetry_state = dict.fromkeys(CONSTANTS.TELEMETRY_EVENT_NAMES, False)
        self.extension_name = "Device Simulator Express"

    def send_telemetry(self, event_name):
        if (
            self.__enable_telemetry
            and self.telemetry_available()
            and not self.telemetry_state[event_name]
        ):
            self.telemetry_client.track_event(
                f"{self.extension_name}/{CONSTANTS.TELEMETRY_EVENT_NAMES[event_name]}"
            )
            self.telemetry_client.flush()
            self.telemetry_state[event_name] = True

    def telemetry_available(self):
        return self.telemetry_client.context.instrumentation_key == "__AIKEY__"


telemetry_py = Telemetry()
