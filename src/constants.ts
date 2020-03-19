// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as path from "path";
import { MessageItem } from "vscode";
import * as nls from "vscode-nls";

// Debugger Server
export const SERVER_INFO = {
    DEFAULT_SERVER_PORT: 5577,
    ERROR_CODE_INIT_SERVER: "ERROR_INIT_SERVER",
    SERVER_PORT_CONFIGURATION: "deviceSimulatorExpress.debuggerServerPort",
};

const localize: nls.LocalizeFunc = nls.config({
    messageFormat: nls.MessageFormat.file,
})();

export const CONFIG = {
    CONFIG_ENV_ON_SWITCH:
        "deviceSimulatorExpress.configNewEnvironmentUponSwitch",
    PYTHON_PATH: "python.pythonPath",
    SHOW_DEPENDENCY_INSTALL: "deviceSimulatorExpress.showDependencyInstall",
    SHOW_NEW_FILE_POPUP: "deviceSimulatorExpress.showNewFilePopup",
};

export const CONSTANTS = {
    DEBUG_CONFIGURATION_TYPE: "deviceSimulatorExpress",
    DEVICE_NAME: {
        CPX: "CPX",
        MICROBIT: "micro:bit",
    },
    ERROR: {
        BAD_PYTHON_PATH:
            'Your interpreter is not pointing to a valid Python executable. Please select a different interpreter (CTRL+SHIFT+P and type "python.selectInterpreter") and restart the application',
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
            "Dependency download could not be completed. Functionality may be limited. Please review the installation docs.",

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
        INSTALLATION_ERROR: localize(
            "error.installationError",
            "Installation Error"
        ),

        INVALID_FILE_EXTENSION_DEBUG: localize(
            "error.invalidFileExtensionDebug",
            "The file you tried to run isn't a Python file."
        ),
        INVALID_PYTHON_PATH: localize(
            "error.invalidPythonPath",
            'We found that your selected Python interpreter version is too low to run the extension. Please upgrade to version 3.7+ or select a different interpreter (CTRL+SHIFT+P and type "python.selectInterpreter") and restart the application.'
        ),
        LOW_PYTHON_VERSION_FOR_MICROBIT_DEPLOYMENT: localize(
            "error.lowPythonVersionForMicrobitDeployment",
            "To deploy your code to the micro:bit, you must be using Python 3.3+"
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
        NO_PIP: localize(
            "error.noPip",
            "We found that you don't have Pip installed on your computer, please install it and try again."
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
        ),
    },
    FILESYSTEM: {
        OUTPUT_DIRECTORY: "out",
        PYTHON_VENV_DIR: "venv",
        MICROPYTHON_DIRECTORY: "micropython",
    },
    INFO: {
        ALREADY_SUCCESSFUL_INSTALL: localize(
            "info.successfulInstall",
            "Your current configuration is already successfully set up for the Device Simulator Expresss."
        ),
        ARE_YOU_SURE: localize(
            "info.areYouSure",
            "Are you sure you don't want to install the dependencies? The extension can't run without installing them."
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
            "\n[INFO] Code successfully copied! Your device should be loading and ready to go shortly.\n"
        ),
        EXTENSION_ACTIVATED: localize(
            "info.extensionActivated",
            "Congratulations, your extension Device Simulator Express is now active!"
        ),
        FILE_SELECTED: (filePath: string) => {
            return localize(
                "info.fileSelected",
                `[INFO] File selected : ${filePath} \n`
            );
        },
        FIRST_TIME_WEBVIEW: localize(
            "info.firstTimeWebview",
            'To reopen the simulator select the command "Open Simulator" from command palette.'
        ),
        INSTALLING_PYTHON_VENV: localize(
            "info.installingPythonVenv",
            "A virtual environment is currently being created. The required Python packages will be installed. You will be prompted a message telling you when the installation is done."
        ),
        INSTALL_PYTHON_DEPS: localize(
            "info.installPythonDependencies",
            "Do you want us to try and install this extension's dependencies on your selected Python interpreter for you?"
        ),
        INSTALL_PYTHON_VENV: localize(
            "info.installPythonVenv",
            "Do you want us to try and install this extension's dependencies via virtual environment for you?"
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
            "Successfully set up the Python environment."
        ),
        THIRD_PARTY_WEBSITE_ADAFRUIT: localize(
            "info.thirdPartyWebsiteAdafruit",
            'By clicking "Agree and Proceed" you will be redirected to adafruit.com, a third party website not managed by Microsoft. Please note that your activity on adafruit.com is subject to Adafruit\'s privacy policy'
        ),
        THIRD_PARTY_WEBSITE_PIP: localize(
            "info.thirdPartyWebsitePip",
            'By clicking "Agree and Proceed" you will be redirected to pip.pypa.io, a third party website not managed by Microsoft. Please note that your activity on pip.pypa.io is subject to PyPA\'s privacy policy'
        ),
        THIRD_PARTY_WEBSITE_PYTHON: localize(
            "info.thirdPartyWebsitePython",
            'By clicking "Agree and Proceed" you will be redirected to python.org, a third party website not managed by Microsoft. Please note that your activity on python.org is subject to Python\'s privacy policy'
        ),
        UPDATED_TO_EXTENSION_VENV: localize(
            "info.updatedToExtensionsVenv",
            "Automatically updated interpreter to point to extension's virtual environment."
        ),
        WELCOME_OUTPUT_TAB: localize(
            "info.welcomeOutputTab",
            "Welcome to the Device Simulator Express output tab!\n\n"
        ),
    },
    LABEL: {
        WEBVIEW_PANEL: localize(
            "label.webviewPanel",
            "Device Simulator Express"
        ),
    },
    LINKS: {
        DOWNLOAD_PIP: "https://pip.pypa.io/en/stable/installing/",
        DOWNLOAD_PYTHON: "https://www.python.org/downloads/",
        EXAMPLE_CODE:
            "https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples",
        HELP:
            "https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart",
        INSTALL:
            "https://github.com/microsoft/vscode-python-devicesimulator/blob/dev/docs/install.md",
        PRIVACY: "https://www.adafruit.com/privacy",
        TUTORIALS:
            "https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library",
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
        ),
    },
    NAME: localize("name", "Device Simulator Express"),
    TEMPLATE: {
        CPX: "cpx_template.py",
        MICROBIT: "microbit_template.py",
    },
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
        ),
    },
};

export enum CONFIG_KEYS {
    ENABLE_USB_DETECTION = "deviceSimulatorExpress.enableUSBDetection",
}

export enum TelemetryEventName {
    FAILED_TO_OPEN_SIMULATOR = "SIMULATOR.FAILED_TO_OPEN",

    // Debugger
    CPX_DEBUGGER_INIT_SUCCESS = "CPX.DEBUGGER.INIT.SUCCESS",
    CPX_DEBUGGER_INIT_FAIL = "CPX.DEBUGGER.INIT.FAIL",
    MICROBIT_DEBUGGER_INIT_SUCCESS = "MICROBIT.DEBUGGER.INIT.SUCCESS",
    MICROBIT_DEBUGGER_INIT_FAIL = "MICROBIT.DEBUGGER.INIT.FAIL",

    // Extension commands
    COMMAND_RUN_SIMULATOR_BUTTON = "COMMAND.RUN.SIMULATOR_BUTTON",
    COMMAND_RUN_PALETTE = "COMMAND.RUN.PALETTE",
    COMMAND_INSTALL_EXTENSION_DEPENDENCIES = "COMMAND.INSTALL.EXTENSION.DEPENDENCIES",
    COMMAND_SERIAL_MONITOR_CHOOSE_PORT = "COMMAND.SERIAL_MONITOR.CHOOSE_PORT",
    COMMAND_SERIAL_MONITOR_OPEN = "COMMAND.SERIAL_MONITOR.OPEN",
    COMMAND_SERIAL_MONITOR_BAUD_RATE = "COMMAND.SERIAL_MONITOR.BAUD_RATE",
    COMMAND_SERIAL_MONITOR_CLOSE = "COMMAND.SERIAL_MONITOR.CLOSE",

    CPX_COMMAND_DEPLOY_DEVICE = "CPX.COMMAND.DEPLOY.DEVICE",
    CPX_COMMAND_NEW_FILE = "CPX.COMMAND.NEW.FILE.CPX",
    CPX_COMMAND_OPEN_SIMULATOR = "CPX.COMMAND.OPEN.SIMULATOR",

    MICROBIT_COMMAND_DEPLOY_DEVICE = "MICROBIT.COMMAND.DEPLOY.DEVICE",
    MICROBIT_COMMAND_NEW_FILE = "MICROBIT.COMMAND.NEW.FILE",
    MICROBIT_COMMAND_OPEN_SIMULATOR = "MICROBIT.COMMAND.OPEN.SIMULATOR",

    // Simulator interaction
    CPX_SIMULATOR_BUTTON_A = "CPX.SIMULATOR.BUTTON.A",
    CPX_SIMULATOR_BUTTON_B = "CPX.SIMULATOR.BUTTON.B",
    CPX_SIMULATOR_BUTTON_AB = "CPX.SIMULATOR.BUTTON.AB",
    CPX_SIMULATOR_SWITCH = "CPX.SIMULATOR.SWITCH",

    MICROBIT_SIMULATOR_BUTTON_A = "MICROBIT.SIMULATOR.BUTTON.A",
    MICROBIT_SIMULATOR_BUTTON_B = "MICROBIT.SIMULATOR.BUTTON.B",
    MICROBIT_SIMULATOR_BUTTON_AB = "MICROBIT.SIMULATOR.BUTTON.AB",

    // Sensors
    CPX_SIMULATOR_TEMPERATURE_SENSOR = "CPX.SIMULATOR.TEMPERATURE",
    CPX_SIMULATOR_LIGHT_SENSOR = "CPX.SIMULATOR.LIGHT",
    CPX_SIMULATOR_MOTION_SENSOR = "CPX.SIMULATOR.MOTION",
    CPX_SIMULATOR_SHAKE = "CPX.SIMULATOR.SHAKE",
    CPX_SIMULATOR_CAPACITIVE_TOUCH = "CPX.SIMULATOR.CAPACITIVE.TOUCH",

    MICROBIT_SIMULATOR_TEMPERATURE_SENSOR = "MICROBIT.SIMULATOR.TEMPERATURE",
    MICROBIT_SIMULATOR_LIGHT_SENSOR = "MICROBIT.SIMULATOR.LIGHT",
    MICROBIT_SIMULATOR_MOTION_SENSOR = "MICROBIT.SIMULATOR.MOTION",

    // Pop-up dialog
    CPX_CLICK_DIALOG_DONT_SHOW = "CPX.CLICK.DIALOG.DONT.SHOW",
    CPX_CLICK_DIALOG_EXAMPLE_CODE = "CPX.CLICK.DIALOG.EXAMPLE.CODE",
    CPX_CLICK_DIALOG_HELP_DEPLOY_TO_DEVICE = "CPX.CLICK.DIALOG.HELP.DEPLOY.TO.DEVICE",
    CPX_CLICK_DIALOG_TUTORIALS = "CPX.CLICK.DIALOG.TUTORIALS",

    ERROR_PYTHON_PROCESS = "ERROR.PYTHON.PROCESS",
    CPX_ERROR_COMMAND_NEW_FILE = "CPX.ERROR.COMMAND.NEW.FILE",
    CPX_ERROR_DEPLOY_WITHOUT_DEVICE = "CPX.ERROR.DEPLOY.WITHOUT.DEVICE",
    CPX_ERROR_PYTHON_DEVICE_PROCESS = "CPX.ERROR.PYTHON.DEVICE.PROCESS",
    CPX_SUCCESS_COMMAND_DEPLOY_DEVICE = "CPX.SUCCESS.COMMAND.DEPLOY.DEVICE",

    MICROBIT_ERROR_COMMAND_NEW_FILE = "MICROBIT.ERROR.COMMAND.NEW.FILE",
    MICROBIT_ERROR_DEPLOY_WITHOUT_DEVICE = "MICROBIT.ERROR.DEPLOY.WITHOUT.DEVICE",
    MICROBIT_ERROR_PYTHON_DEVICE_PROCESS = "MICROBIT.ERROR.PYTHON.DEVICE.PROCESS",
    MICROBIT_SUCCESS_COMMAND_DEPLOY_DEVICE = "MICROBIT.SUCCESS.COMMAND.DEPLOY.DEVICE",

    // Performance
    CPX_PERFORMANCE_DEPLOY_DEVICE = "CPX.PERFORMANCE.DEPLOY.DEVICE",
    CPX_PERFORMANCE_NEW_FILE = "CPX.PERFORMANCE.NEW.FILE",
    CPX_PERFORMANCE_OPEN_SIMULATOR = "CPX.PERFORMANCE.OPEN.SIMULATOR",

    MICROBIT_PERFORMANCE_DEPLOY_DEVICE = "MICROBIT.PERFORMANCE.DEPLOY.DEVICE",
    MICROBIT_PERFORMANCE_NEW_FILE = "MICROBIT.PERFORMANCE.NEW.FILE",
    MICROBIT_PERFORMANCE_OPEN_SIMULATOR = "MICROBIT.PERFORMANCE.OPEN.SIMULATOR",

    // Venv options
    SETUP_VENV_CREATION_ERR = "SETUP.VENV.CREATION.ERR",
    SETUP_NO_PIP = "SETUP.NO.PIP",
    SETUP_DEP_INSTALL_FAIL = "SETUP.DEP.INSTALL.FAIL",
    SETUP_AUTO_RESOLVE_PYTHON_PATH = "SETUP.AUTO.RESOLVE.PYTHON.PATH",
    SETUP_NO_PYTHON_PATH = "SETUP.NO.PYTHON.PATH",
    SETUP_DOWNLOAD_PYTHON = "SETUP.DOWNLOAD.PYTHON",
    SETUP_INVALID_PYTHON_INTERPRETER_PATH = "SETUP.INVALID.PYTHON.INTERPRETER.PATH",
    SETUP_INVALID_PYTHON_VER = "SETUP.INVALID.PYTHON.VER",
    SETUP_INSTALL_VENV = "SETUP.INSTALL.VENV",
    SETUP_ORIGINAL_INTERPRETER_DEP_INSTALL = "SETUP.ORIGINAL.INTERPRETER.DEP.INSTALL",
    SETUP_HAS_VENV = "SETUP.HAS.VENV",
    SETUP_NO_DEPS_INSTALLED = "SETUP.NO.DEPS.INSTALLED",
}
export const DEFAULT_DEVICE = CONSTANTS.DEVICE_NAME.CPX;

// tslint:disable-next-line: no-namespace
export namespace DialogResponses {
    export const ACCEPT_AND_RUN: MessageItem = {
        title: localize("dialogResponses.agreeAndRun", "Agree and Run"),
    };
    export const AGREE_AND_PROCEED: MessageItem = {
        title: localize("dialogResponses.agreeAndProceed", "Agree and Proceed"),
    };
    export const CANCEL: MessageItem = {
        title: localize("dialogResponses.cancel", "Cancel"),
    };
    export const HELP: MessageItem = {
        title: localize("dialogResponses.help", "I need help"),
    };
    export const DONT_SHOW: MessageItem = {
        title: localize("dialogResponses.dontShowAgain", "Don't Show Again"),
    };
    export const NO: MessageItem = {
        title: localize("dialogResponses.No", "No"),
    };
    export const INSTALL_NOW: MessageItem = {
        title: localize("dialogResponses.installNow", "Install Now"),
    };
    export const DONT_INSTALL: MessageItem = {
        title: localize("dialogResponses.dontInstall", "Don't Install"),
    };
    export const PRIVACY_STATEMENT: MessageItem = {
        title: localize("info.privacyStatement", "Privacy Statement"),
    };
    export const TUTORIALS: MessageItem = {
        title: localize("dialogResponses.tutorials", "Tutorials on Adafruit"),
    };
    export const EXAMPLE_CODE: MessageItem = {
        title: localize(
            "dialogResponses.exampleCode",
            "Example Code on GitHub"
        ),
    };
    export const MESSAGE_UNDERSTOOD: MessageItem = {
        title: localize("dialogResponses.messageUnderstood", "Got It"),
    };
    export const INSTALL_PIP: MessageItem = {
        title: localize(
            "dialogResponses.installPip",
            "Install from Pip's webpage"
        ),
    };
    export const INSTALL_PYTHON: MessageItem = {
        title: localize(
            "dialogResponses.installPython",
            "Install from python.org"
        ),
    };
    export const YES: MessageItem = {
        title: localize("dialogResponses.Yes", "Yes"),
    };
    export const READ_INSTALL_MD: MessageItem = {
        title: localize(
            "dialogResponses.readInstall",
            "Read installation docs"
        ),
    };
}

export const CPX_CONFIG_FILE = path.join(".vscode", "cpx.json");

export const STATUS_BAR_PRIORITY = {
    PORT: 20,
    OPEN_PORT: 30,
    BAUD_RATE: 40,
};

export const VERSIONS = {
    MIN_PY_VERSION: "3.7.0",
};

export const HELPER_FILES = {
    CHECK_IF_VENV_PY: "check_if_venv.py",
    CHECK_PYTHON_DEPENDENCIES: "check_python_dependencies.py",
    DEVICE_PY: "device.py",
    PROCESS_USER_CODE_PY: "process_user_code.py",
    PYTHON_EXE: "python.exe",
    PYTHON: "python",
};

export const GLOBAL_ENV_VARS = {
    PYTHON: "python",
};
export const LANGUAGE_VARS = {
    PYTHON: { ID: "python", FILE_ENDS: ".py" },
};

export default CONSTANTS;
