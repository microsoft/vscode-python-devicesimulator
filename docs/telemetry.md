# Pacifica Telemetry

Pacifica logs usage data and diagnostics telemetry through [Application Insights](https://azure.microsoft.com/en-us/services/monitor/).

## Telemetry Gathered

This extension collects basic diagnostics telemetry and usage data:

- **Diagnostics telemetry**: performance of extension commands and success / error rate
- **Usage telemetry**: user usage of extension commands and API calls

## Usage Telemetry

Through the Application Insights API, telemetry events are collected on Pacifica extension usage. The follow table describes the Telemetry events we collect:

|     **Property**       | **Note**                                                                                             |
| :-------------------:  | ---------------------------------------------------------------------------------------------------- |
|    **Event Name**      | Unique event name/descriptor for the event. For ex: Pacifica/COMMAND_NEW_PROJECT                     |
| **VS Code Session ID** | A unique identifier for the current session (changes each time the editor is started)                |
| **VS Code Machine ID** | A unique identifier for the computer                                                                 |
|  **VS Code Version**   | VS Code version being used by the user                                                               |
| **Extension Version**  | Pacifica extension version being used                                                                |
|        **OS**          | User's operating system                                                                              |
|    **Performance**     | A number indicating how long the command or API call took to execute                                 |
|      **Result**        | If the event succeeded or not                                                                        |
