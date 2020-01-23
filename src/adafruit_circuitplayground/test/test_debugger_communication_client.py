import pytest
import debugger_communication_client

@pytest.mark.parametrize("data, expected_events, updated_expected_events", [("js", [], [])])
def test_update_api_state_fail(data, expected_events, updated_expected_events):
    debugger_communication_client.__update_api_state(data, expected_events)
    assert expected_events == updated_expected_events

# @pytest.mark.parametrize("data, expected_events, updated_expected_events",
#                         [(" ", [], []),
#                         ])
def test_update_api_state(data, expected_events, updated_expected_events):
    express = mock.MagicMock()
    debugger_communication_client.__update_api_state(data, expected_events)
    assert expected_events == updated_expected_events
