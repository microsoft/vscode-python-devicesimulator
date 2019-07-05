import * as nls from "vscode-nls";

const localize: nls.LocalizeFunc = nls.config({
  messageFormat: nls.MessageFormat.file
})();

export const CONSTANTS = {
  ERROR: {
    STDERR: (data: string) => {
      return localize("error.stderr", `[ERROR] ${data} \n`);
    },
    UNEXPECTED_MESSAGE: localize(
      "error.unexpectedMessage",
      "Webview sent an unexpected message"
    )
  },
  INFO: {
    DEPLOY_OUTPUT: localize(
      "info.deployOutput",
      "\n[INFO] Deploying code to the simulator...\n"
    ),
    EXTENSION_ACTIVATED: localize(
      "info.extensionActivated",
      "Congratulations, your extension Adafruit_Simulator is now active!"
    ),
    RUNNING_CODE: localize("info.runningCode", "Running user code"),
    WELCOME_OUTPUT_TAB: localize(
      "info.welcomeOutputTab",
      "Welcome to the Adafruit Simulator output tab !\n\n"
    )
  },
  LABEL: {
    WEBVIEW_PANEL: localize("label.webviewPanel", "Adafruit CPX")
  },
  NAME: localize("name", "Adafruit Simulator")
};

// Need the different events we want to track and the name of it
export enum TelemetryEventName {
  FAILED_TO_OPEN_SIMULATOR = "SIMULATOR.FAILED_TO_OPEN",

  COMMAND_NEW_PROJECT = "COMMAND.NEW.PROJECT",
  COMMAND_OPEN_SIMULATOR = "COMMAND.OPEN.SIMULATOR",
  COMMAND_RUN_SIMULATOR = "COMMAND.RUN.SIMULATOR"
}

export default CONSTANTS;
