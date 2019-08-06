// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as nls from "vscode-nls";
import * as path from "path";
import { MessageItem } from "vscode";

const localize: nls.LocalizeFunc = nls.config({
  messageFormat: nls.MessageFormat.file
})();

export const CONSTANTS = {
  DEBUG_CONFIGURATION_NAME: "Pacifica Simulator Debugger",
  ERROR: {
    FAILED_TO_OPEN_SERIAL_PORT: (port: string): string => {
      return localize(
        "error.failedToOpenSerialPort",
        `Failed to open serial port ${port}.`
      )
    },
    FAILED_TO_OPEN_SERIAL_PORT_DUE_TO: (port: string, error: any) => {
      return localize(
        "error.failedToOpenSerialPortDueTo",
        `[ERROR] Failed to open serial port ${port} due to error: ${error}. \n`
      )
    },
    INCORRECT_FILE_NAME_FOR_DEVICE: localize(
      "error.incorrectFileNameForDevice",
      '[ERROR] Can\'t deploy to your Circuit Playground Express device, please rename your file to "code.py" or "main.py". \n'
    ),
    INCORRECT_FILE_NAME_FOR_DEVICE_POPUP: localize(
      "error.incorrectFileNameForDevicePopup",
      'Seems like you have a different file name than what CPX requires, please rename it to "code.py" or "main.py".'
    ),
    INVALID_FILE_EXTENSION_DEBUG: localize(
      "error.invalidFileExtensionDebug",
      "The file you tried to run isn't a Python file."
    ),
    NO_DEVICE: localize(
      "error.noDevice",
      "No plugged in boards detected. Please double check if your board is connected and/or properly formatted"
    ),
    NO_FILE_TO_RUN: localize(
      "error.noFileToRun",
      '[ERROR] We can\'t find a Python file to run. Please make sure you select or open a new ".py" code file, or use the "New Project" command to get started and see useful links.\n'
    ),
    NO_PROGRAM_FOUND_DEBUG: localize(
      "error.noProgramFoundDebug",
      "Cannot find a program to debug."
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
    CPX_JSON_ALREADY_GENERATED: localize(
      "info.cpxJsonAlreadyGenerated",
      "cpx.json has already been generated."
    ),
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
      "\n[INFO] Code successfully copied! Your Circuit Playground Express should be loading and ready to go shortly.\n"
    ),
    EXTENSION_ACTIVATED: localize(
      "info.extensionActivated",
      "Congratulations, your extension Adafruit_Simulator is now active!"
    ),

    FILE_SELECTED: (filePath: string) => {
      return localize(
        "info.fileSelected",
        `[INFO] File selected : ${filePath} \n`
      );
    },
    FIRST_TIME_WEBVIEW: localize(
      "info.firstTimeWebview",
      'To reopen the simulator click on the "Open Simulator" button on the upper right corner of the text editor, or select the command "Open Simulator" from command palette.'
    ),
    INCORRECT_FILE_NAME_FOR_SIMULATOR_POPUP: localize(
      "info.incorrectFileNameForSimulatorPopup",
      'We want your code to work on your actual board as well. Make sure you name your file "code.py" or "main.py" to be able to run your code on an actual physical device'
    ),
    INVALID_FILE_NAME_DEBUG: localize(
      "info.invalidFileNameDebug",
      'The file you tried to debug isn\'t named "code.py" or "main.py". Rename your file if you want your code to work on your actual device.'
    ),
    NEW_PROJECT: localize(
      "info.newProject",
      "New to Python or Circuit Playground Express project? We are here to help!"
    ),
    PLEASE_OPEN_FOLDER: localize(
      "info.pleaseOpenFolder",
      "Please open a folder first."
    ),
    REDIRECT: localize("info.redirect", "You are being redirected."),
    RUNNING_CODE: localize("info.runningCode", "Running user code"),
    THIRD_PARTY_WEBSITE: localize(
      "info.thirdPartyWebsite",
      "You will be redirect to adafruit.com, a website outside Microsoft. Read the privacy statement on Adafruit:"
    ),
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
    PRIVACY: "https://www.adafruit.com/privacy",
    TUTORIALS:
      "https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library"
  },
  NAME: localize("name", "Pacifica Simulator"),
  WARNING: {
    NO_RATE_SELECTED: localize(
      "warning.noRateSelected",
      "No rate is selected, keep baud rate unchanged."
    ),
    INVALID_BAUD_RATE: localize(
      "warning.invalidBaudRate",
      "Invalid baud rate, keep baud rate unchanged."
    ),
    SERIAL_PORT_NOT_STARTED: localize(
      "warning.serialPortNotStarted",
      "Serial port has not been started."
    ),
    SERIAL_MONITOR_NOT_STARTED: localize(
      "warning.serialMonitorNotStarted",
      "Serial monitor has not been started."
    )
  }
};

export enum CONFIG_KEYS {
  ENABLE_USB_DETECTiON = "pacifica.enableUSBDetection"
}

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
  SENSOR_CHANGED = "sensor-changed",
  REFRESH_SIMULATOR = "refresh-simulator"
}

// tslint:disable-next-line: no-namespace
export namespace DialogResponses {
  export const HELP: MessageItem = {
    title: localize("dialogResponses.help", "I need help")
  };
  export const DONT_SHOW: MessageItem = {
    title: localize("dialogResponses.dontShowAgain", "Don't Show Again")
  };
  export const PRIVACY_STATEMENT: MessageItem = {
    title: localize("info.privacyStatement", "Privacy Statement")
  };
  export const TUTORIALS: MessageItem = {
    title: localize("dialogResponses.tutorials", "Tutorials on Adafruit")
  };
  export const EXAMPLE_CODE: MessageItem = {
    title: localize("dialogResponses.exampleCode", "Example Code on GitHub")
  };
  export const MESSAGE_UNDERSTOOD: MessageItem = {
    title: localize("dialogResponses.messageUnderstood", "Got It")
  };
}

export const CPX_CONFIG_FILE = path.join(".vscode", "cpx.json");
export const SERIAL_MONITOR_NAME = "CPX Serial Monitor";

export const USER_CODE_NAMES = {
  CODE_PY: "code.py",
  MAIN_PY: "main.py"
};

export const STATUS_BAR_PRIORITY = {
  PORT: 20,
  OPEN_PORT: 30,
  BAUD_RATE: 40,
  BOARD: 60,
  ENDING: 70,
  SKETCH: 80,
  PROGRAMMER: 90,
};


export default CONSTANTS;
