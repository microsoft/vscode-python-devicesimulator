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
    DEPLOY_DEVICE: localize(
      "info.deployDevice",
      "\n[INFO] Deploying code to the device...\n"
    ),
    DEPLOY_SIMULATOR: localize(
      "info.deploySimulator",
      "\n[INFO] Deploying code to the simulator...\n"
    ),
    DEPLOY_SUCCESS: localize(
      "info.deploySuccess",
      "\n[INFO] Code successfully deployed\n"
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

export default CONSTANTS;
