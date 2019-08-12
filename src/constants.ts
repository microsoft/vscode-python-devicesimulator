// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as nls from "vscode-nls";
import { MessageItem } from "vscode";

const localize: nls.LocalizeFunc = nls.config({
  messageFormat: nls.MessageFormat.file
})();

export const CONSTANTS = {
  DEBUG_CONFIGURATION_NAME: "Pacifica Simulator Debugger",
  DEPENDENCY_CHECKER: {
    PYTHON: "python",
    PYTHON3: "python3",
    PYTHON_LAUNCHER: "py -3"
  },
  ERROR: {
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
      '[ERROR] We can\'t find a Python file to run. Please make sure you select or open a new ".py" code file, or use the "New File" command to get started and see useful links.\n'
    ),
    NO_PROGRAM_FOUND_DEBUG: localize(
      "error.noProgramFoundDebug",
      "Cannot find a program to debug."
    ),
    NO_PYTHON_PATH: localize(
      "error.noPythonPath",
      "We found that you don't have Python 3 installed on your computer, please install the latest version, add it to your PATH and try again."
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
    NEW_FILE: localize(
      "info.newFile",
      "New to Python or the Circuit Playground Express? We are here to help!"
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
    DOWNLOAD_PYTHON: "https://www.python.org/downloads/",
    EXAMPLE_CODE:
      "https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples",
    HELP:
      "https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart",
    PRIVACY: "https://www.adafruit.com/privacy",
    TUTORIALS:
      "https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library"
  },
  NAME: localize("name", "Pacifica Simulator"),
  PYTHON_TRACKED_CALLS: {
    ADJUST_THRESHOLD: "adjust_touch_threshold",
    DETECT_TAPS: "detect_taps",
    PLAY_FILE: "play_file",
    PLAY_TONE: "play_tone",
    START_TONE: "start_tone",
    STOP_TONE: "stop_tone",
    PIXELS: "pixels",
    TAPPED: "tapped"
  },
  WARNING: {
    ACCEPT_AND_RUN: localize(
      "warning.agreeAndRun",
      "By selecting ‘Agree and Run’, you understand the extension executes Python code on your local computer, which may be a potential security risk."
    )
  }
};

// Need the different events we want to track and the name of it
export enum TelemetryEventName {
  FAILED_TO_OPEN_SIMULATOR = "SIMULATOR.FAILED_TO_OPEN",

  // Extension commands
  COMMAND_DEPLOY_DEVICE = "COMMAND.DEPLOY.DEVICE",
  COMMAND_NEW_FILE = "COMMAND.NEW.FILE",
  COMMAND_OPEN_SIMULATOR = "COMMAND.OPEN.SIMULATOR",
  COMMAND_RUN_SIMULATOR = "COMMAND.RUN.SIMULATOR",

  // Simulator interaction
  SIMULATOR_BUTTON_A = "SIMULATOR.BUTTON.A",
  SIMULATOR_BUTTON_B = "SIMULATOR.BUTTON.B",
  SIMULATOR_BUTTON_AB = "SIMULATOR.BUTTON.AB",
  SIMULATOR_SWITCH = "SIMULATOR.SWITCH",

  //Sensors
  SIMULATOR_TEMPERATURE_SENSOR = "SIMULATOR.TEMPERATURE",
  SIMULATOR_LIGHT_SENSOR = " SIMULATOR.LIGHT_SENSOR",
  SIMULATOR_MOTION_SENSOR = "SIMULATOR.MOTION_SENSOR",
  SIMULATOR_SHAKE = "SIMULATOR.SHAKE",
  SIMULATOR_CAPACITIVE_TOUCH = "SIMULATOR.CAPACITIVE_TOUCH",

  //Mock calls
  SIMULATOR_ADJUST_THRESHOLD = "SIMULATOR.ADJUST_THRESHOLD",
  SIMULATOR_DETECT_TAPS = "SIMULATOR.DETECT_TAPS",
  SIMULATOR_PLAY_TONE = "SIMULATOR.PLAY_TONE ",
  SIMULATOR_PLAY_FILE = "SIMULATOR.PLAY_FILE",
  SIMULATOR_START_TONE = "SIMULATOR.START_TONE",
  SIMULATOR_STOP_TONE = "SIMULATOR.STOP_TONE",
  SIMULATOR_TAPPED = "SIMULATOR.TAPPED",
  SIMULATOR_PIXELS = "SIMULATOR.PIXELS",

  // Pop-up dialog
  CLICK_DIALOG_DONT_SHOW = "CLICK.DIALOG.DONT.SHOW",
  CLICK_DIALOG_EXAMPLE_CODE = "CLICK.DIALOG.EXAMPLE.CODE",
  CLICK_DIALOG_HELP_DEPLOY_TO_DEVICE = "CLICK.DIALOG.HELP.DEPLOY.TO.DEVICE",
  CLICK_DIALOG_TUTORIALS = "CLICK.DIALOG.TUTORIALS",

  ERROR_PYTHON_DEVICE_PROCESS = "ERROR.PYTHON.DEVICE.PROCESS",
  ERROR_PYTHON_PROCESS = "ERROR.PYTHON.PROCESS",
  ERROR_COMMAND_NEW_FILE = "ERROR.COMMAND.NEW.FILE",
  ERROR_DEPLOY_WITHOUT_DEVICE = "ERROR.DEPLOY.WITHOUT.DEVICE",

  SUCCESS_COMMAND_DEPLOY_DEVICE = "SUCCESS.COMMAND.DEPLOY.DEVICE",

  // Performance
  PERFORMANCE_DEPLOY_DEVICE = "PERFORMANCE.DEPLOY.DEVICE",
  PERFORMANCE_NEW_FILE = "PERFORMANCE.NEW.FILE",
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
  export const ACCEPT_AND_RUN: MessageItem = {
    title: localize("dialogResponses.agreeAndRun", "Agree and Run")
  };
  export const CANCEL: MessageItem = {
    title: localize("dialogResponses.cancel", "Cancel")
  };
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
  export const INSTALL_PYTHON: MessageItem = {
    title: localize("dialogResponses.installPython", "Install from python.org")
  };
}

export const USER_CODE_NAMES = {
  CODE_PY: "code.py",
  MAIN_PY: "main.py"
};

export default CONSTANTS;
