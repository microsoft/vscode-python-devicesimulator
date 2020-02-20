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

export const showPrivacyModal = (okAction: () => void, thirdPartyDisclaimer: string) => {
    vscode.window
        .showInformationMessage(
            `${thirdPartyDisclaimer}: ${CONSTANTS.LINKS.PRIVACY}`,
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

export const checkForPython = async () => {
    const dependencyCheck = await checkPythonDependency();
    if (dependencyCheck.installed) {
        return true;
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
                    showPrivacyModal(okAction, CONSTANTS.INFO.THIRD_PARTY_WEBSITE_PYTHON);
                }
            });
        return false
    }

};

export const checkForPip = async () => {
    const dependencyCheck = await checkPipDependency();
    if (dependencyCheck.installed) {
        return true;
    } else {
        vscode.window
            .showErrorMessage(
                CONSTANTS.ERROR.NO_PIP,
                DialogResponses.INSTALL_PIP
            )
            .then((selection: vscode.MessageItem | undefined) => {
                if (selection === DialogResponses.INSTALL_PIP) {
                    const okAction = () => {
                        open(CONSTANTS.LINKS.DOWNLOAD_PIP);
                    };
                    showPrivacyModal(okAction, CONSTANTS.INFO.THIRD_PARTY_WEBSITE_PIP);
                }
            });
        return false
    }

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

export const getConfig = (configName: string): string => {
    console.log(vscode.workspace.getConfiguration())
    console.log(configName)

    console.log("sdfasdfasd " + vscode.workspace.getConfiguration().get(configName))
    return vscode.workspace.getConfiguration().get(configName);
};


export const checkIfVenv = async (
    context: vscode.ExtensionContext,
    pythonExecutableName: string
) => {
    const venvCheckerPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        "check_if_venv.py"
    );
    const { stdout } = await exec(`${createEscapedPath(pythonExecutableName)} "${venvCheckerPath}"`)
    console.log(`${createEscapedPath(pythonExecutableName)}  "${venvCheckerPath}"`)
    console.log(stdout)
    console.log((stdout.trim() === "1"))
    return (stdout.trim() === "1")
}

export const validPythonVersion = async (
    pythonExecutableName: string
) => {
    console.log(`${createEscapedPath(pythonExecutableName)} --version`)
    const { stdout } = await exec(`${createEscapedPath(pythonExecutableName)} --version`)
    console.log(stdout)
    console.log("sdfasdfasd here")
    if (stdout < "3.7.0") {
        vscode.window.showInformationMessage(
            CONSTANTS.ERROR.INVALID_PYTHON_PATH,
            DialogResponses.INSTALL_PYTHON,
            DialogResponses.OPEN_PYTHON_INTERPRETER_MENU
        )
            .then((installChoice: vscode.MessageItem | undefined) => {
                if (installChoice === DialogResponses.INSTALL_PYTHON) {
                    const okAction = () => {
                        open(CONSTANTS.LINKS.DOWNLOAD_PYTHON);
                    };
                    showPrivacyModal(okAction, CONSTANTS.INFO.THIRD_PARTY_WEBSITE_PYTHON);
                } else if (installChoice === DialogResponses.OPEN_PYTHON_INTERPRETER_MENU) {
                    vscode.commands.executeCommand('python.selectInterpreter');
                }
            });
        return false
    } else {
        return true
    }
}
export const checkBaseDependencies = async (
    context: vscode.ExtensionContext
) => { }

export const createVenv = async (
    context: vscode.ExtensionContext,
    pythonExecutableName: string
) => {
    const pathToEnv: string = getPathToScript(
        context,
        "env"
    );
    console.log("uriugseigiohgeiohgifghd" + pathToEnv)
    // const globalPythonExecutableName = await setGlobalPythonExectuableName();
    // if (checkPipDependency() && globalPythonExecutableName !== "") {
    // checks for whether the check is necessary
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
            pythonExecutableName,
            pathToEnv
        );
    }

    // } else {
    //     return "";
    // }
};


// new menus
// your selected python intepreter version is too low
// open python intepreter menu      python website download 

// install dependencies needed for extention (only for their venv)

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
            `${createEscapedPath(pythonExecutable)} -m venv ${pathToEnv}`
        );

    } catch (err) {
        vscode.window
            .showErrorMessage(
                "Virtual Environment for download could not be completed.",
                DialogResponses.READ_INSTALL_MD
            )
            .then((selection: vscode.MessageItem | undefined) => {
                if (selection === DialogResponses.READ_INSTALL_MD) {
                    open(CONSTANTS.LINKS.INSTALL);
                }
            });

        console.error(err);

        return pythonExecutable;
    }

    if (!await installDependencies(context, pythonPath)) {
        return pythonExecutable;
    }


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
            `${createEscapedPath(pythonPath)} ${dependencyCheckerPath}`
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
            `${createEscapedPath(pythonPath)} -m pip install -r ${requirementsPath}`
        );
        console.info(stdout);

        vscode.window.showInformationMessage(CONSTANTS.INFO.SUCCESSFUL_INSTALL);
        return true
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
        return false
    };
};

export const setupEnv = async (context: vscode.ExtensionContext) => {
    console.log("uriugseigiohgeiohgifghd")
    let pythonExecutableName = ""

    // initial checks for what we need
    if (!checkPipDependency() || !checkForPython()) {
        return "";
    }

    // get name from interpreter
    let originalPythonExecutableName: string = getConfig(CONFIG.PYTHON_PATH)

    // fix path to be absolute
    if (!path.isAbsolute(originalPythonExecutableName)) {
        originalPythonExecutableName = path.join(vscode.workspace.rootPath, originalPythonExecutableName)
        console.log("uriugseigiohgeiohgifghd " + originalPythonExecutableName)
    }

    // originalPythonExecutableName = createEscapedPath(originalPythonExecutableName);

    console.log("uriugseigiohgeiohgifghd 0.5")
    if (!await validPythonVersion(originalPythonExecutableName)) {
        return "";
    }


    console.log("uriugseigiohgeiohgifghd 1")
    pythonExecutableName = originalPythonExecutableName;
    if (!await checkIfVenv(context, pythonExecutableName)) {
        console.log("here!!")

        pythonExecutableName = await createVenv(context, pythonExecutableName)
    }


    console.log("uriugseigiohgeiohgifghd 2")

    if (pythonExecutableName === originalPythonExecutableName && !await checkForDependencies(context, originalPythonExecutableName)) {
        if (checkConfig(CONFIG.SHOW_DEPENDENCY_INSTALL)) {
            await vscode.window
                .showInformationMessage(
                    CONSTANTS.INFO.INSTALL_PYTHON_DEPS,
                    DialogResponses.INSTALL_NOW,
                    DialogResponses.DONT_INSTALL
                )
                .then(async (installChoice: vscode.MessageItem | undefined) => {
                    if (installChoice === DialogResponses.INSTALL_NOW) {
                        await installDependencies(context, pythonExecutableName)
                    }
                });
        }
    }

    console.log("uriugseigiohgeiohgifghd 3 " + pythonExecutableName)
    return pythonExecutableName
};


export const createEscapedPath = (...pieces: string[]) => {
    const initialPath: string = path.join(...pieces);

    // escape all special characters
    // https://stackoverflow.com/questions/1779858/how-do-i-escape-a-string-for-a-shell-command-in-node
    return `"` + initialPath.replace(/(["'$`\\])/g, '\\$1') + `"`;
};

