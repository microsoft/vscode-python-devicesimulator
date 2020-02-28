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
    GLOBAL_ENV_VARS,
    HELPER_FILES,
    SERVER_INFO,
    USER_CODE_NAMES,
    VERSIONS,
} from "../constants";
import { CPXWorkspace } from "../cpxWorkspace";
import { DeviceContext } from "../deviceContext";

const exec = util.promisify(cp.exec);

const errorChannel = vscode.window.createOutputChannel(
    CONSTANTS.ERROR.INSTALLATION_ERROR
);

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

export const showPrivacyModal = (
    okAction: () => void,
    thirdPartyDisclaimer: string
) => {
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

export const isPipInstalled = async (pythonExecutablePath: string) => {

    try {
        const { stdout } = await executePythonCommand(pythonExecutablePath, " -m pip");
        console.log(`uuwuu: ${stdout}`)
        return true;
    } catch (err) {
        console.log(`uuwuu: ${err}`)
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
                    showPrivacyModal(
                        okAction,
                        CONSTANTS.INFO.THIRD_PARTY_WEBSITE_PIP
                    );
                }
            });
        return false;
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
        .filter(editor => editor.document.languageId === GLOBAL_ENV_VARS.PYTHON)
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
    return vscode.workspace.getConfiguration().get(configName);
};

export const createEscapedPath = (...pieces: string[]) => {
    const initialPath: string = path.join(...pieces);

    // escape all special characters
    // https://stackoverflow.com/questions/1779858/how-do-i-escape-a-string-for-a-shell-command-in-node
    return `"` + initialPath.replace(/(["'$`\\])/g, "\\$1") + `"`;
};

export const getTelemetryState = () => {
    return vscode.workspace
        .getConfiguration()
        .get("telemetry.enableTelemetry", true);
};

// Setup code starts

export const checkIfVenv = async (
    context: vscode.ExtensionContext,
    pythonExecutablePath: string
) => {
    const venvCheckerPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        HELPER_FILES.CHECK_IF_VENV_PY
    );
    const { stdout } = await executePythonCommand(
        pythonExecutablePath,
        `"${venvCheckerPath}"`
    );
    return stdout.trim() === "1";
};

export const executePythonCommand = async (
    pythonExecutablePath: string,
    command: string
) => {
    console.log(`DSE COMMAND: ${createEscapedPath(pythonExecutablePath)} ${command}`)
    return exec(`${createEscapedPath(pythonExecutablePath)} ${command}`);
};

export const validatePythonVersion = async (pythonExecutablePath: string) => {
    const { stdout } = await executePythonCommand(
        pythonExecutablePath,
        "--version"
    );
    if (stdout < VERSIONS.MIN_PY_VERSION) {
        vscode.window
            .showInformationMessage(
                CONSTANTS.ERROR.INVALID_PYTHON_PATH,
                DialogResponses.INSTALL_PYTHON
            )
            .then((installChoice: vscode.MessageItem | undefined) => {
                if (installChoice === DialogResponses.INSTALL_PYTHON) {
                    const okAction = () => {
                        open(CONSTANTS.LINKS.DOWNLOAD_PYTHON);
                    };
                    showPrivacyModal(
                        okAction,
                        CONSTANTS.INFO.THIRD_PARTY_WEBSITE_PYTHON
                    );
                }
            });
        return false;
    } else {
        return true;
    }
};

export const hasVenv = async (context: vscode.ExtensionContext) => {
    const pathToEnv: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR
    );

    return fs.existsSync(pathToEnv);
};

export const promptInstallVenv = (
    context: vscode.ExtensionContext,
    pythonExecutable: string,
    pythonExecutableName: string
) => {
    return vscode.window
        .showInformationMessage(
            CONSTANTS.INFO.INSTALL_PYTHON_VENV,
            DialogResponses.YES,
            DialogResponses.NO
        )
        .then((selection: vscode.MessageItem | undefined) => {
            if (selection === DialogResponses.YES) {
                return installPythonVenv(context, pythonExecutable, pythonExecutableName);
            } else {
                // return pythonExecutable, notifying the caller
                // that the user was unwilling to create venv
                // and by default, this will trigger the extension to
                // try using pythonExecutable
                return pythonExecutable;
            }
        });
};

export const getPythonVenv = async (context: vscode.ExtensionContext, pythonExecutableName: string) => {
    const subFolder = os.platform() === "win32" ? "Scripts" : "bin";

    return getPathToScript(
        context,
        path.join(CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR, subFolder),
        pythonExecutableName
    );
};

export const installPythonVenv = async (
    context: vscode.ExtensionContext,
    pythonExecutable: string,
    pythonExecutableName: string
) => {
    const pathToEnv: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR
    );

    vscode.window.showInformationMessage(CONSTANTS.INFO.INSTALLING_PYTHON_VENV);

    const pythonPath: string = await getPythonVenv(context, pythonExecutableName);

    try {
        // make venv
        // run command to download dependencies to out/python_libs
        await executePythonCommand(pythonExecutable, `-m venv "${pathToEnv}"`);
    } catch (err) {
        vscode.window
            .showErrorMessage(
                `Virtual environment for download could not be completed. Using original interpreter at: ${pythonExecutable}.`,
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

    return installDependenciesWrapper(context, pythonPath, pythonExecutable);
};

export const areDependenciesInstalled = async (
    context: vscode.ExtensionContext,
    pythonPath: string
) => {
    const dependencyCheckerPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        HELPER_FILES.CHECK_PYTHON_DEPENDENCIES
    );
    try {
        // python script will throw exception
        // if not all dependencies are downloaded
        const { stdout } = await executePythonCommand(
            pythonPath,
            `"${dependencyCheckerPath}"`
        );

        // output for debugging purposes
        console.info(stdout);
        return true;
    } catch (err) {
        return false;
    }
};

export const installDependencies = async (
    context: vscode.ExtensionContext,
    pythonPath: string
) => {
    const requirementsPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        "requirements.txt"
    );

    if (!isPipInstalled(pythonPath)) {
        return false;
    }

    try {
        const { stdout } = await executePythonCommand(
            pythonPath,
            `-m pip install -r "${requirementsPath}"`
        );

        console.info(stdout);
        vscode.window.showInformationMessage(CONSTANTS.INFO.SUCCESSFUL_INSTALL);
        return true;
    } catch (err) {
        return false;
    }
};

export const installDependenciesWrapper = async (
    context: vscode.ExtensionContext,
    pythonPath: string,
    backupPythonPath: string = ""
) => {
    let errMessage = CONSTANTS.ERROR.DEPENDENCY_DOWNLOAD_ERROR;
    if (backupPythonPath !== "") {
        errMessage = `${errMessage} Using original interpreter at: ${backupPythonPath}.`;
    }
    if (!(await installDependencies(context, pythonPath))) {
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
        return backupPythonPath;
    }
    return pythonPath;
};
export const getCurrentpythonExecutablePath = async () => {
    let originalpythonExecutablePath = "";


    // try to get name from interpreter
    try {
        originalpythonExecutablePath = getConfig(CONFIG.PYTHON_PATH);
    } catch (err) {
        originalpythonExecutablePath =
            GLOBAL_ENV_VARS.PYTHON;
    }

    if (
        originalpythonExecutablePath === GLOBAL_ENV_VARS.PYTHON ||
        originalpythonExecutablePath === ""
    ) {
        try {
            const { stdout } = await executePythonCommand(GLOBAL_ENV_VARS.PYTHON, `-c "import sys; print(sys.executable)"`)
            originalpythonExecutablePath = stdout.trim()
        } catch (err) {
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
                        showPrivacyModal(
                            okAction,
                            CONSTANTS.INFO.THIRD_PARTY_WEBSITE_PYTHON
                        );
                    }
                });

            // no python installed, cannot get path
            return "";
        }
    }
    // fix path to be absolute
    if (!path.isAbsolute(originalpythonExecutablePath)) {
        originalpythonExecutablePath = path.join(
            vscode.workspace.rootPath,
            originalpythonExecutablePath
        );
    }

    if (!fs.existsSync(originalpythonExecutablePath)) {
        await vscode.window.showErrorMessage(CONSTANTS.ERROR.BAD_PYTHON_PATH);
        return "";
    }

    if (!(await validatePythonVersion(originalpythonExecutablePath))) {
        return "";
    }

    return originalpythonExecutablePath;
};
export const setupEnv = async (
    context: vscode.ExtensionContext,
    needsResponse: boolean = false
) => {
    const originalpythonExecutablePath = await getCurrentpythonExecutablePath();
    let pythonExecutablePath = originalpythonExecutablePath;
    let pythonExecutableName: string = (os.platform() !== "win32") ? HELPER_FILES.PYTHON_EXE : HELPER_FILES.PYTHON;


    if (!(await areDependenciesInstalled(context, pythonExecutablePath))) {
        // environment needs to install dependencies
        if (!(await checkIfVenv(context, pythonExecutablePath))) {
            const pythonExecutablePathVenv = await getPythonVenv(context, pythonExecutableName);
            if (await hasVenv(context)) {
                // venv in extention exists with wrong dependencies
                if (
                    !(await areDependenciesInstalled(
                        context,
                        pythonExecutablePathVenv
                    ))
                ) {
                    pythonExecutablePath = await installDependenciesWrapper(
                        context,
                        pythonExecutablePathVenv,
                        pythonExecutablePath
                    );
                } else {
                    pythonExecutablePath = pythonExecutablePathVenv;
                }
            } else {
                pythonExecutablePath = await promptInstallVenv(
                    context,
                    originalpythonExecutablePath,
                    pythonExecutableName
                );
            }

            if (pythonExecutablePath === pythonExecutablePathVenv) {
                vscode.window.showInformationMessage(
                    CONSTANTS.INFO.UPDATED_TO_EXTENSION_VENV
                );
                vscode.workspace
                    .getConfiguration()
                    .update(CONFIG.PYTHON_PATH, pythonExecutablePath);
            }
        }
        if (pythonExecutablePath === originalpythonExecutablePath) {
            // going with original interpreter, either because
            // already in venv or error in creating custom venv
            if (checkConfig(CONFIG.SHOW_DEPENDENCY_INSTALL)) {
                await vscode.window
                    .showInformationMessage(
                        CONSTANTS.INFO.INSTALL_PYTHON_DEPS,
                        DialogResponses.INSTALL_NOW,
                        DialogResponses.DONT_INSTALL
                    )
                    .then(
                        async (
                            installChoice: vscode.MessageItem | undefined
                        ) => {
                            if (installChoice === DialogResponses.INSTALL_NOW) {
                                await installDependenciesWrapper(
                                    context,
                                    pythonExecutablePath
                                );
                            } else {
                                await vscode.window
                                    .showInformationMessage(
                                        CONSTANTS.INFO.ARE_YOU_SURE,
                                        DialogResponses.INSTALL_NOW,
                                        DialogResponses.DONT_INSTALL
                                    )
                                    .then(
                                        async (
                                            installChoice2:
                                                | vscode.MessageItem
                                                | undefined
                                        ) => {
                                            if (
                                                installChoice2 ===
                                                DialogResponses.INSTALL_NOW
                                            ) {
                                                await installDependenciesWrapper(
                                                    context,
                                                    pythonExecutablePath
                                                );
                                            }
                                        }
                                    );
                            }
                        }
                    );
            }
        }
    } else if (needsResponse) {
        vscode.window.showInformationMessage(
            CONSTANTS.INFO.ALREADY_SUCCESSFUL_INSTALL
        );
    }

    return pythonExecutablePath;
};
