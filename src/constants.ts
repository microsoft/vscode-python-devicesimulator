// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
    NO_FILE_TO_RUN: localize(
      "error.noFileToRun",
      "\n[ERROR] We can't find the .py file to run. Open up a new .py file, or browse through some examples to start with: https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples"
    ),
    STDERR: (data: string) => {
      return localize("error.stderr", `\n[ERROR] ${data} \n`);
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
    FIRST_TIME_WEBVIEW: localize(
      "info.firstTimeWebview",
      "To reopen the simulator click on the \"Open Simulator\" button on the upper right corner of the text editor, or select the command \"Open Simulator\" from command palette."
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

// Need the different events we want to track and the name of it
export enum TelemetryEventName {
  FAILED_TO_OPEN_SIMULATOR = "SIMULATOR.FAILED_TO_OPEN",

  // Extension commands
  COMMAND_DEPLOY_DEVICE = "COMMAND.DEPLOY.DEVICE",
  COMMAND_NEW_PROJECT = "COMMAND.NEW.PROJECT",
  COMMAND_OPEN_SIMULATOR = "COMMAND.OPEN.SIMULATOR",
  COMMAND_RUN_SIMULATOR = "COMMAND.RUN.SIMULATOR",

  // Simulator interaction
  SIMULATOR_BUTTON_A = "SIMULATOR.BUTTON.A",
  SIMULATOR_BUTTON_B = "SIMULATOR.BUTTON.B",
  SIMULATOR_BUTTON_AB = "SIMULATOR.BUTTON.AB",
  SIMULATOR_SWITCH = "SIMULATOR.SWITCH",

  // Pop-up dialog
  CLICK_DIALOG_DONT_SHOW = "CLICK.DIALOG.DONT.SHOW",
  CLICK_DIALOG_EXAMPLE_CODE = "CLICK.DIALOG.EXAMPLE.CODE",
  CLICK_DIALOG_HELP_DEPLOY_TO_DEVICE = "CLICK.DIALOG.HELP.DEPLOY.TO.DEVICE",
  CLICK_DIALOG_TUTORIALS = "CLICK.DIALOG.TUTORIALS",

  ERROR_PYTHON_DEVICE_PROCESS = "ERROR.PYTHON.DEVICE.PROCESS",
  ERROR_PYTHON_PROCESS = "ERROR.PYTHON.PROCESS",
  ERROR_COMMAND_NEW_PROJECT = "ERROR.COMMAND.NEW.PROJECT",
  ERROR_DEPLOY_WITHOUT_DEVICE = "ERROR.DEPLOY.WITHOUT.DEVICE",

  SUCCESS_COMMAND_DEPLOY_DEVICE = "SUCCESS.COMMAND.DEPLOY.DEVICE",

  // Performance
  PERFORMANCE_DEPLOY_DEVICE = "PERFORMANCE.DEPLOY.DEVICE",
  PERFORMANCE_NEW_PROJECT = "PERFORMANCE.NEW.PROJECT",
  PERFORMANCE_OPEN_SIMULATOR = "PERFORMANCE.OPEN.SIMULATOR"
}

export enum WebviewMessages {
  BUTTON_PRESS = "button-press",
  PLAY_SIMULATOR = "play-simulator",
}


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