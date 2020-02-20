import constants as CONSTANTS
from applicationinsights import TelemetryClient


class Telemetry:
    def __init__(self):
        # State of the telemetry
        self.__enable_telemetry = True
        self.telemetry_client = TelemetryClient("__AIKEY__")
        self.extension_name = "Device Simulator Express"

    def send_telemetry(self, event_name):
        if (
            self.__enable_telemetry
            and self.telemetry_available()
            and event_name in CONSTANTS.TELEMETRY_EVENT_NAMES
        ):
            self.telemetry_client.track_event(
                f"{self.extension_name}/{CONSTANTS.TELEMETRY_EVENT_NAMES[event_name]}"
            )
            self.telemetry_client.flush()

    def telemetry_available(self):
        return self.telemetry_client.context.instrumentation_key == "__AIKEY__"
        return True


telemetry_py = Telemetry()