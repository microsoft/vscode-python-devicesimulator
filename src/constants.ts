// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as path from "path";
import { MessageItem } from "vscode";
import * as nls from "vscode-nls";

// Debugger Server
export const SERVER_INFO = {
  DEFAULT_SERVER_PORT: 5577,
  ERROR_CODE_INIT_SERVER: "ERROR_INIT_SERVER",
  SERVER_PORT_CONFIGURATION: "deviceSimulatorExpress.debuggerServerPort"
};

const localize: nls.LocalizeFunc = nls.config({
  messageFormat: nls.MessageFormat.file
})();

export const CONFIG = {
  SHOW_DEPENDENCY_INSTALL: "deviceSimulatorExpress.showDependencyInstall",
  SHOW_NEW_FILE_POPUP: "deviceSimulatorExpress.showNewFilePopup"
};

export const CONSTANTS = {
  DEBUG_CONFIGURATION_TYPE: "deviceSimulatorExpress",
  DEPENDENCY_CHECKER: {
    PIP3: "pip3",
    PYTHON: "python",
    PYTHON3: "python3.7",
  },
  ERROR: {
    COMPORT_UNKNOWN_ERROR:
      "Writing to COM port (GetOverlappedResult): Unknown error code 121",
    CPX_FILE_ERROR: localize(
      "error.cpxFileFormat",
      "The cpx.json file format is not correct."
    ),
    DEBUGGER_SERVER_INIT_FAILED: (port: number) => {
      return localize(
        "error.debuggerServerInitFailed",
        `Warning : The Debugger Server cannot be opened. Please try to free the port ${port} if it's already in use or select another one in your Settings 'Device Simulator Express: Debugger Server Port' and start another debug session.\n You can still debug your code but you won't be able to use the Simulator.`
      );
    },
    DEBUGGING_SESSION_IN_PROGESS: localize(
      "error.debuggingSessionInProgress",
      "[ERROR] A debugging session is currently in progress, please stop it before running your code. \n"
    ),
    DEPENDENCY_DOWNLOAD_ERROR:
      "Package downloads failed. Some functionalities may not work. Try restarting the simulator or review the installation docs.",
    FAILED_TO_OPEN_SERIAL_PORT: (port: string): string => {
      return localize(
        "error.failedToOpenSerialPort",
        `[ERROR] Failed to open serial port ${port}.`
      );
    },
    FAILED_TO_OPEN_SERIAL_PORT_DUE_TO: (port: string, error: any) => {
      return localize(
        "error.failedToOpenSerialPortDueTo",
        `[ERROR] Failed to open serial port ${port} due to error: ${error}. \n`
      );
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
      '[ERROR] We can\'t find a Python file to run. Please make sure you select or open a new ".py" code file, or use the "New File" command to get started and see useful links.\n'
    ),
    NO_FOLDER_OPENED: localize(
      "error.noFolderCreated",
      "In order to use the Serial Monitor, you need to open a folder and reload VS Code."
    ),
    NO_PROGRAM_FOUND_DEBUG: localize(
      "error.noProgramFoundDebug",
      "Cannot find a program to debug."
    ),
    NO_PYTHON_PATH: localize(
      "error.noPythonPath",
      "We found that you don't have Python 3 installed on your computer, please install the latest version, add it to your PATH and try again."
    ),
    RECONNECT_DEVICE: localize(
      "error.reconnectDevice",
      "Please disconnect your Circuit Playground Express and try again."
    ),
    STDERR: (data: string) => {
      return localize("error.stderr", `\n[ERROR] ${data} \n`);
    },
    UNEXPECTED_MESSAGE: localize(
      "error.unexpectedMessage",
      "Webview sent an unexpected message"
    )
  },
  FILESYSTEM: {
    OUTPUT_DIRECTORY: "out",
    PYTHON_LIBS_DIR: "python_libs"
  },
  INFO: {
    ARE_YOU_SURE: localize(
      "info.areYouSure",
      "Are you sure you don't want to install the dependencies? The extension can't run without installing it"
    ),
    CLOSED_SERIAL_PORT: (port: string) => {
      return localize(
        "info.closedSerialPort",
        `[DONE] Closed the serial port - ${port} \n`
      );
    },
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
    INSTALLING_PYTHON_DEPENDENCIES: localize(
      "info.installingPythonDependencies",
      "The Python packages are currently being installed. You will be prompt a message telling you when the installation is done."
    ),
    INSTALL_PYTHON_DEPENDENCIES: localize(
      "info.installPythonDependencies",
      "Do you want us to try and install this extensions dependencies for you?"
    ),
    INVALID_FILE_NAME_DEBUG: localize(
      "info.invalidFileNameDebug",
      'The file you tried to debug isn\'t named "code.py" or "main.py". Rename your file if you want your code to work on your actual device.'
    ),
    NEW_FILE: localize(
      "info.newFile",
      "New to Python or the Circuit Playground Express? We are here to help!"
    ),
    OPENED_SERIAL_PORT: (port: string) => {
      return localize(
        "info.openedSerialPort",
        `[INFO] Opened the serial port - ${port} \n`
      );
    },
    OPENING_SERIAL_PORT: (port: string) => {
      return localize(
        "info.openingSerialPort",
        `[STARTING] Opening the serial port - ${port} \n`
      );
    },
    PLEASE_OPEN_FOLDER: localize(
      "info.pleaseOpenFolder",
      "Please open a folder first."
    ),
    REDIRECT: localize("info.redirect", "You are being redirected."),
    RUNNING_CODE: localize("info.runningCode", "Running user code"),
    SUCCESSFUL_INSTALL: localize(
      "info.successfulInstall",
      "Successfully installed Python dependencies."
    ),
    THIRD_PARTY_WEBSITE: localize(
      "info.thirdPartyWebsite",
      'By clicking "Agree and Proceed" you will be redirected to adafruit.com, a third party website not managed by Microsoft. Please note that your activity on adafruit.com is subject to Adafruit\'s privacy policy'
    ),
    WELCOME_OUTPUT_TAB: localize(
      "info.welcomeOutputTab",
      "Welcome to the Adafruit Simulator output tab!\n\n"
    )
  },
  LABEL: {
    WEBVIEW_PANEL: localize("label.webviewPanel", "Device Simulator Express")
  },
  LINKS: {
    DOWNLOAD_PYTHON: "https://www.python.org/downloads/",
    EXAMPLE_CODE:
      "https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples",
    HELP:
      "https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart",
    INSTALL: "https://github.com/microsoft/vscode-python-devicesimulator/blob/dev/docs/install.md",
    PRIVACY: "https://www.adafruit.com/privacy",
    TUTORIALS:
      "https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library"
  },
  MISC: {
    SELECT_PORT_PLACEHOLDER: localize(
      "misc.selectPortPlaceholder",
      "Select a serial port"
    ),
    SERIAL_MONITOR_NAME: localize(
      "misc.serialMonitorName",
      "Device Simulator Express Serial Monitor"
    ),
    SERIAL_MONITOR_TEST_IF_OPEN: localize(
      "misc.testIfPortOpen",
      "Test if serial port is open"
    )
  },
  NAME: localize("name", "Device Simulator Express"),
  WARNING: {
    ACCEPT_AND_RUN: localize(
      "warning.agreeAndRun",
      "By selecting ‘Agree and Run’, you understand the extension executes Python code on your local computer, which may be a potential security risk."
    ),
    INVALID_BAUD_RATE: localize(
      "warning.invalidBaudRate",
      "Invalid baud rate, keep baud rate unchanged."
    ),
    NO_RATE_SELECTED: localize(
      "warning.noRateSelected",
      "No rate is selected, keep baud rate unchanged."
    ),
    NO_SERIAL_PORT_SELECTED: localize(
      "warning.noSerialPortSelected",
      "No serial port was selected, please select a serial port first"
    ),
    SERIAL_MONITOR_ALREADY_OPENED: (port: string) => {
      return localize(
        "warning.serialMonitorAlreadyOpened",
        `Serial monitor is already opened for ${port} \n`
      );
    },
    SERIAL_MONITOR_NOT_STARTED: localize(
      "warning.serialMonitorNotStarted",
      "Serial monitor has not been started."
    ),
    SERIAL_PORT_NOT_STARTED: localize(
      "warning.serialPortNotStarted",
      "Serial port has not been started.\n"
    )
  }
};

export enum CONFIG_KEYS {
  ENABLE_USB_DETECTION = "deviceSimulatorExpress.enableUSBDetection"
}

export enum TelemetryEventName {
  FAILED_TO_OPEN_SIMULATOR = "SIMULATOR.FAILED_TO_OPEN",

  // Extension commands
  COMMAND_DEPLOY_DEVICE = "COMMAND.DEPLOY.DEVICE",
  COMMAND_NEW_FILE = "COMMAND.NEW.FILE",
  COMMAND_OPEN_SIMULATOR = "COMMAND.OPEN.SIMULATOR",
  COMMAND_RUN_SIMULATOR_BUTTON = "COMMAND.RUN.SIMULATOR_BUTTON",
  COMMAND_RUN_PALETTE = "COMMAND.RUN.PALETTE",
  COMMAND_RUN_EDITOR_ICON = "COMMAND.RUN.EDITOR_ICON",
  COMMAND_SERIAL_MONITOR_CHOOSE_PORT = "COMMAND.SERIAL_MONITOR.CHOOSE_PORT",
  COMMAND_SERIAL_MONITOR_OPEN = "COMMAND.SERIAL_MONITOR.OPEN",
  COMMAND_SERIAL_MONITOR_BAUD_RATE = "COMMAND.SERIAL_MONITOR.BAUD_RATE",
  COMMAND_SERIAL_MONITOR_CLOSE = "COMMAND.SERIAL_MONITOR.CLOSE",

  // Simulator interaction
  SIMULATOR_BUTTON_A = "SIMULATOR.BUTTON.A",
  SIMULATOR_BUTTON_B = "SIMULATOR.BUTTON.B",
  SIMULATOR_BUTTON_AB = "SIMULATOR.BUTTON.AB",
  SIMULATOR_SWITCH = "SIMULATOR.SWITCH",

  // Sensors
  SIMULATOR_TEMPERATURE_SENSOR = "SIMULATOR.TEMPERATURE",
  SIMULATOR_LIGHT_SENSOR = " SIMULATOR.LIGHT",
  SIMULATOR_MOTION_SENSOR = "SIMULATOR.MOTION",
  SIMULATOR_SHAKE = "SIMULATOR.SHAKE",
  SIMULATOR_CAPACITIVE_TOUCH = "SIMULATOR.CAPACITIVE.TOUCH",

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
  REFRESH_SIMULATOR = "refresh-simulator",
  SLIDER_TELEMETRY = "slider-telemetry"
}

// tslint:disable-next-line: no-namespace
export namespace DialogResponses {
  export const ACCEPT_AND_RUN: MessageItem = {
    title: localize("dialogResponses.agreeAndRun", "Agree and Run")
  };
  export const AGREE_AND_PROCEED: MessageItem = {
    title: localize("dialogResponses.agreeAndProceed", "Agree and Proceed")
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
  export const NO: MessageItem = {
    title: localize("dialogResponses.No", "No")
  };
  export const INSTALL_NOW: MessageItem = {
    title: localize("dialogResponses.installNow", "Install Now")
  };
  export const DONT_INSTALL: MessageItem = {
    title: localize("dialogResponses.dontInstall", "Don't Install")
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
  export const YES: MessageItem = {
    title: localize("dialogResponses.Yes", "Yes")
  };
  export const READ_INSTALL_MD: MessageItem = {
    title: localize("dialogResponses.readInstall", "Read installation docs")
  };
}

export const CPX_CONFIG_FILE = path.join(".vscode", "cpx.json");

export const USER_CODE_NAMES = {
  CODE_PY: "code.py",
  MAIN_PY: "main.py"
};

export const STATUS_BAR_PRIORITY = {
  PORT: 20,
  OPEN_PORT: 30,
  BAUD_RATE: 40
};

export default CONSTANTS;
