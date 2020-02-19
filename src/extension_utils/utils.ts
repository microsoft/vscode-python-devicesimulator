// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as cp from "child_process";
import * as fs from "fs";
import * as open from "open";
import * as os from "os";
import * as path from "path";
import * as util from "util";
import * as vscode from "vscode";
import {
    CONFIG,
    CONSTANTS,
    CPX_CONFIG_FILE,
    DialogResponses,
    SERVER_INFO,
    USER_CODE_NAMES,
} from "../constants";
import { CPXWorkspace } from "../cpxWorkspace";
import { DeviceContext } from "../deviceContext";
import { DependencyChecker } from "./dependencyChecker";

const exec = util.promisify(cp.exec);

// tslint:disable-next-line: export-name
export const getPathToScript = (
    context: vscode.ExtensionContext,
    folderName: string,
    fileName: string = ""
) => {
    const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, folderName, fileName)
    );
    const scriptPath = onDiskPath.with({ scheme: "vscode-resource" });
    return scriptPath.fsPath;
};


export const validCodeFileName = (filePath: string) => {
    return (
        filePath.endsWith(USER_CODE_NAMES.CODE_PY) ||
        filePath.endsWith(USER_CODE_NAMES.MAIN_PY)
    );
};

export const showPrivacyModal = (okAction: () => void) => {
    vscode.window
        .showInformationMessage(
            `${CONSTANTS.INFO.THIRD_PARTY_WEBSITE}: ${CONSTANTS.LINKS.PRIVACY}`,
            DialogResponses.AGREE_AND_PROCEED,
            DialogResponses.CANCEL
        )
        .then((privacySelection: vscode.MessageItem | undefined) => {
            if (privacySelection === DialogResponses.AGREE_AND_PROCEED) {
                okAction();
            } else if (privacySelection === DialogResponses.CANCEL) {
                // do nothing
            }
        });
};

export const logToOutputChannel = (
    outChannel: vscode.OutputChannel | undefined,
    message: string,
    show: boolean = false
): void => {
    if (outChannel) {
        if (show) {
            outChannel.show(true);
        }
        outChannel.append(message);
    }
};

export function tryParseJSON(jsonString: string): any | boolean {
    try {
        const jsonObj = JSON.parse(jsonString);
        if (jsonObj && typeof jsonObj === "object") {
            return jsonObj;
        }
    } catch (exception) { }

    return false;
}

export function fileExistsSync(filePath: string): boolean {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}

export function mkdirRecursivelySync(dirPath: string): void {
    if (directoryExistsSync(dirPath)) {
        return;
    }
    const dirname = path.dirname(dirPath);
    if (path.normalize(dirname) === path.normalize(dirPath)) {
        fs.mkdirSync(dirPath);
    } else if (directoryExistsSync(dirname)) {
        fs.mkdirSync(dirPath);
    } else {
        mkdirRecursivelySync(dirname);
        fs.mkdirSync(dirPath);
    }
}

export function directoryExistsSync(dirPath: string): boolean {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch (e) {
        return false;
    }
}

/**
 * This method pads the current string with another string (repeated, if needed)
 * so that the resulting string reaches the given length.
 * The padding is applied from the start (left) of the current string.
 */
export function padStart(
    sourceString: string,
    targetLength: number,
    padString?: string
): string {
    if (!sourceString) {
        return sourceString;
    }

    if (!(String.prototype as any).padStart) {
        // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
        padString = String(padString || " ");
        if (sourceString.length > targetLength) {
            return sourceString;
        } else {
            targetLength = targetLength - sourceString.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + sourceString;
        }
    } else {
        return (sourceString as any).padStart(targetLength, padString);
    }
}

export function convertToHex(num: number, width = 0): string {
    return padStart(num.toString(16), width, "0");
}

export function generateCPXConfig(): void {
    const deviceContext: DeviceContext = DeviceContext.getInstance();
    const cpxJson = {
        port: deviceContext.port,
    };
    const cpxConfigFilePath: string = path.join(
        CPXWorkspace.rootPath,
        CPX_CONFIG_FILE
    );
    mkdirRecursivelySync(path.dirname(cpxConfigFilePath));
    fs.writeFileSync(cpxConfigFilePath, JSON.stringify(cpxJson, null, 4));
}
export const checkPythonDependency = async () => {
    const dependencyChecker: DependencyChecker = new DependencyChecker();
    const result = await dependencyChecker.checkDependency(
        CONSTANTS.DEPENDENCY_CHECKER.PYTHON
    );
    return result.payload;
};

export const checkPipDependency = async () => {
    const dependencyChecker: DependencyChecker = new DependencyChecker();
    const result = await dependencyChecker.checkDependency(
        CONSTANTS.DEPENDENCY_CHECKER.PIP3
    );
    return result.payload;
};

export const setGlobalPythonExectuableName = async () => {
    // // Find our what command is the PATH for python
    // if (os.platform() === "win32") {

    //     const { stdout } = await exec(
    //         "py -0p"
    //     );
    //     if (stdout.includes(" -3.7")) {
    //         console.log("has 3.7")
    //     } else {
    //         console.log("doesn't have 3.7")
    //     }

    //     // split by newline in stdout to and find which line is 3.7, then split by whitespace to find address

    // } else {
    //     const { stdout } = await exec(
    //         "ls /usr/bin/python3.7*"
    //     );
    //     if (stdout !== "") {
    //         console.log("unix has 3.7")
    //     } else {
    //         console.log("unix doesn't have 3.7")
    //     }

    //     // take first result of command
    // }



    let executableName: string = "";
    const dependencyCheck = await checkPythonDependency();
    if (dependencyCheck.installed) {
        executableName = dependencyCheck.dependency;
    } else {
        vscode.window
            .showErrorMessage(
                CONSTANTS.ERROR.NO_PYTHON_PATH,
                DialogResponses.INSTALL_PYTHON
            )
            .then((selection: vscode.MessageItem | undefined) => {
                if (selection === DialogResponses.INSTALL_PYTHON) {
                    const okAction = () => {
                        open(CONSTANTS.LINKS.DOWNLOAD_PYTHON);
                    };
                    showPrivacyModal(okAction);
                }
            });
    }

    return executableName;
};

export const addVisibleTextEditorCallback = (
    currentPanel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
): vscode.Disposable => {
    const initialPythonEditors = filterForPythonFiles(
        vscode.window.visibleTextEditors
    );
    currentPanel.webview.postMessage({
        command: "visible-editors",
        state: { activePythonEditors: initialPythonEditors },
    });
    return vscode.window.onDidChangeVisibleTextEditors(
        (textEditors: vscode.TextEditor[]) => {
            const activePythonEditors = filterForPythonFiles(textEditors);
            currentPanel.webview.postMessage({
                command: "visible-editors",
                state: { activePythonEditors },
            });
        },
        {},
        context.subscriptions
    );
};

export const filterForPythonFiles = (textEditors: vscode.TextEditor[]) => {
    return textEditors
        .filter(editor => editor.document.languageId === "python")
        .map(editor => editor.document.fileName);
};

export const getActiveEditorFromPath = (
    filePath: string
): vscode.TextDocument => {
    const activeEditor = vscode.window.visibleTextEditors.find(
        (editor: vscode.TextEditor) => editor.document.fileName === filePath
    );
    return activeEditor ? activeEditor.document : undefined;
};

export const getServerPortConfig = (): number => {
    // tslint:disable: no-backbone-get-set-outside-model prefer-type-cast
    if (
        vscode.workspace
            .getConfiguration()
            .has(SERVER_INFO.SERVER_PORT_CONFIGURATION)
    ) {
        return vscode.workspace
            .getConfiguration()
            .get(SERVER_INFO.SERVER_PORT_CONFIGURATION) as number;
    }
    return SERVER_INFO.DEFAULT_SERVER_PORT;
};

export const checkConfig = (configName: string): boolean => {
    return vscode.workspace.getConfiguration().get(configName) === true;
};

export const checkVenv = async (
    context: vscode.ExtensionContext
) => {
    const pathToEnv: string = getPathToScript(
        context,
        "env"
    );
    console.log("uriugseigiohgeiohgifghd" + pathToEnv)
    const globalPythonExecutableName = await setGlobalPythonExectuableName();
    if (checkPipDependency() && globalPythonExecutableName !== "") {
        // checks for whether the check is necessary
        if (checkConfig(CONFIG.SHOW_DEPENDENCY_INSTALL)) {
            // check if ./out/python_libs exists; if not, the dependencies
            // for adafruit_circuitpython are not (successfully) installed yet
            if (fs.existsSync(pathToEnv)) {
                const pythonVenv = await getPythonVenv(context);
                if (await checkForDependencies(context, pythonVenv)) {
                    await installDependencies(context, pythonVenv)
                }
                return pythonVenv;
            } else {
                return promptInstallVenv(
                    context,
                    globalPythonExecutableName,
                    pathToEnv
                );
            }
        }
    } else {
        return "";
    }
    return ""
};

export const promptInstallVenv = (
    context: vscode.ExtensionContext,
    pythonExecutable: string,
    pathToEnv: string
) => {
    return vscode.window
        .showInformationMessage(
            CONSTANTS.INFO.INSTALL_PYTHON_VENV,
            DialogResponses.YES,
            DialogResponses.NO
        )
        .then((selection: vscode.MessageItem | undefined) => {
            if (selection === DialogResponses.YES) {
                return installPythonVenv(
                    context,
                    pythonExecutable,
                    pathToEnv
                );
            } else {
                return vscode.window
                    .showInformationMessage(
                        CONSTANTS.INFO.ARE_YOU_SURE,
                        DialogResponses.INSTALL_NOW,
                        DialogResponses.DONT_INSTALL
                    )
                    .then((installChoice: vscode.MessageItem | undefined) => {
                        if (installChoice === DialogResponses.INSTALL_NOW) {
                            return installPythonVenv(
                                context,
                                pythonExecutable,
                                pathToEnv
                            );
                        } else {
                            return "";
                        }
                    });
            }
        });
};
export const getTelemetryState = () => {
    return vscode.workspace
        .getConfiguration()
        .get("telemetry.enableTelemetry", true);
};
export const getPythonVenv = async (
    context: vscode.ExtensionContext
) => {
    const subFolder = (os.platform() === "win32") ? "Scripts" : "bin";

    return getPathToScript(
        context,
        path.join("env", subFolder),
        "python.exe"
    );
}
export const installPythonVenv = async (
    context: vscode.ExtensionContext,
    pythonExecutable: string,
    pathToEnv: string
) => {
    vscode.window.showInformationMessage(
        CONSTANTS.INFO.INSTALLING_PYTHON_VENV
    );


    const subFolder = (os.platform() === "win32") ? "Scripts" : "bin";

    const pythonPath: string = getPathToScript(
        context,
        path.join("env", subFolder),
        "python.exe"
    );
    try {
        // make venv
        // get python /env/[bin or Scripts]/python
        // run command to download dependencies to out/python_libs
        await exec(
            `${pythonExecutable} -m venv ${pathToEnv}`
        );

    } catch (err) {
        vscode.window
            .showErrorMessage(
                "Virtual Environment for download could not be completed. Please download dependencies manually.",
                DialogResponses.READ_INSTALL_MD
            )
            .then((selection: vscode.MessageItem | undefined) => {
                if (selection === DialogResponses.READ_INSTALL_MD) {
                    open(CONSTANTS.LINKS.INSTALL);
                }
            });

        console.error(err);
        return "python"
    }

    await installDependencies(context, pythonPath)

    vscode.window.showInformationMessage(CONSTANTS.INFO.SUCCESSFUL_INSTALL);

    return pythonPath
};

export const checkForDependencies = async (context: vscode.ExtensionContext, pythonPath: string) => {
    const dependencyCheckerPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        "check_python_dependencies.py"
    );
    try {
        const { stdout } = await exec(
            `${pythonPath} ${dependencyCheckerPath}`
        );
        console.info(stdout)
        return true;
    } catch (err) {
        return false;
    }

};

export const installDependencies = async (context: vscode.ExtensionContext, pythonPath: string) => {
    const requirementsPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        "requirements.txt"
    );
    try {
        const { stdout } = await exec(
            `${pythonPath} -m pip install -r ${requirementsPath}`
        );
        console.info(stdout);
    } catch (err) {
        vscode.window
            .showErrorMessage(
                CONSTANTS.ERROR.DEPENDENCY_DOWNLOAD_ERROR,
                DialogResponses.READ_INSTALL_MD
            )
            .then((selection: vscode.MessageItem | undefined) => {
                if (selection === DialogResponses.READ_INSTALL_MD) {
                    open(CONSTANTS.LINKS.INSTALL);
                }
            });

        console.error(err);
    };
};

