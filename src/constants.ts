import * as nls from "vscode-nls";
import { MessageItem } from "vscode";

const localize: nls.LocalizeFunc = nls.config({
  messageFormat: nls.MessageFormat.file
})();

export const CONSTANTS = {
  ERROR: {
    NO_DEVICE: localize(
      "error.noDevice",
      "No plugged in boards detected. Please double check if your board is connected and/or properly formatted"
    ),
    STDERR: (data: string) => {
      return localize("error.stderr", `[ERROR] ${data} \n`);
    },
    UNEXPECTED_MESSAGE: localize(
      "error.unexpectedMessage",
      "Webview sent an unexpected message"
    )
  },
  INFO: {
    COMPLETED_MESSAGE: "Completed",
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
    NEW_PROJECT: localize(
      "info.newProject",
      "New to Python or Circuit Playground Express project? We are here to help!"
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
  LINKS: {
    EXAMPLE_CODE:
      "https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples",
    HELP:
      "https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart",
    TUTORIALS:
      "https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library"
  },
  NAME: localize("name", "Adafruit Simulator")
};

// tslint:disable-next-line: no-namespace
export namespace DialogResponses {
  export const HELP: MessageItem = {
    title: localize("dialogResponses.help", "I need help")
  };
  export const DONT_SHOW: MessageItem = {
    title: localize("dialogResponses.dontShowAgain", "Don't Show Again")
  };
  export const TUTORIALS: MessageItem = {
    title: localize("dialogResponses.tutorials", "Tutorials on Adafruit")
  };
  export const EXAMPLE_CODE: MessageItem = {
    title: localize("dialogResponses.exampleCode", "Example Code on GitHub")
  };
}

export default CONSTANTS;
