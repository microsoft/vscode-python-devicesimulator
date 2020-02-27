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
    } catch (exception) {}

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

export const isPipInstalled = async (pythonExecutableName: string) => {
    try {
        await executePythonCommand(pythonExecutableName, " -m pip");
        return true;
    } catch (err) {
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
    pythonExecutableName: string
) => {
    const venvCheckerPath: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        HELPER_FILES.CHECK_IF_VENV_PY
    );
    const { stdout } = await executePythonCommand(
        pythonExecutableName,
        `"${venvCheckerPath}"`
    );
    return stdout.trim() === "1";
};

export const executePythonCommand = async (
    pythonExecutableName: string,
    command: string
) => {
    return exec(`${createEscapedPath(pythonExecutableName)} ${command}`);
};

export const validatePythonVersion = async (pythonExecutableName: string) => {
    const { stdout } = await executePythonCommand(
        pythonExecutableName,
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
    pythonExecutable: string
) => {
    return vscode.window
        .showInformationMessage(
            CONSTANTS.INFO.INSTALL_PYTHON_VENV,
            DialogResponses.YES,
            DialogResponses.NO
        )
        .then((selection: vscode.MessageItem | undefined) => {
            if (selection === DialogResponses.YES) {
                return installPythonVenv(context, pythonExecutable);
            } else {
                return vscode.window
                    .showInformationMessage(
                        CONSTANTS.INFO.ARE_YOU_SURE,
                        DialogResponses.INSTALL_NOW,
                        DialogResponses.DONT_INSTALL
                    )
                    .then((installChoice: vscode.MessageItem | undefined) => {
                        if (installChoice === DialogResponses.INSTALL_NOW) {
                            return installPythonVenv(context, pythonExecutable);
                        } else {
                            // return an empty string, notifying the caller
                            // that the user was unwilling to create venv
                            // and by default, this will trigger the extension to
                            // try using pythonExecutable
                            return "";
                        }
                    });
            }
        });
};

export const getPythonVenv = async (context: vscode.ExtensionContext) => {
    const subFolder = os.platform() === "win32" ? "Scripts" : "bin";

    return getPathToScript(
        context,
        path.join(CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR, subFolder),
        HELPER_FILES.PYTHON_EXE
    );
};

export const installPythonVenv = async (
    context: vscode.ExtensionContext,
    pythonExecutable: string
) => {
    const pathToEnv: string = getPathToScript(
        context,
        CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR
    );

    vscode.window.showInformationMessage(CONSTANTS.INFO.INSTALLING_PYTHON_VENV);

    const pythonPath: string = await getPythonVenv(context);

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

    if (!(await installDependencies(context, pythonPath))) {
        vscode.window
            .showErrorMessage(
                `${CONSTANTS.ERROR.DEPENDENCY_DOWNLOAD_ERROR} Using original interpreter at: ${pythonExecutable}.`,
                DialogResponses.READ_INSTALL_MD
            )
            .then((selection: vscode.MessageItem | undefined) => {
                if (selection === DialogResponses.READ_INSTALL_MD) {
                    open(CONSTANTS.LINKS.INSTALL);
                }
            });

        return pythonExecutable;
    }

    return pythonPath;
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

export const getCurrentPythonExecutableName = async () => {
    let originalPythonExecutableName = "";

    // try to get name from interpreter
    try {
        originalPythonExecutableName = getConfig(CONFIG.PYTHON_PATH);
    } catch (err) {
        originalPythonExecutableName = "python";
    }

    if (
        originalPythonExecutableName === "python" ||
        originalPythonExecutableName === ""
    ) {
        try {
            const { stdout } = await exec(
                'python -c "import sys; print(sys.executable)"'
            );
            originalPythonExecutableName = stdout.trim();
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
    if (!path.isAbsolute(originalPythonExecutableName)) {
        originalPythonExecutableName = path.join(
            vscode.workspace.rootPath,
            originalPythonExecutableName
        );
    }

    if (!fs.existsSync(originalPythonExecutableName)) {
        await vscode.window.showErrorMessage(CONSTANTS.ERROR.BAD_PYTHON_PATH);
        return "";
    }

    if (!(await validatePythonVersion(originalPythonExecutableName))) {
        return "";
    }

    return originalPythonExecutableName;
};
export const setupEnv = async (
    context: vscode.ExtensionContext,
    needsResponse: boolean = false
) => {
    const originalPythonExecutableName = await getCurrentPythonExecutableName();
    let pythonExecutableName = originalPythonExecutableName;

    if (!(await areDependenciesInstalled(context, pythonExecutableName))) {
        // environment needs to install dependencies
        if (!(await checkIfVenv(context, pythonExecutableName))) {
            pythonExecutableName = await getPythonVenv(context);
            if (await hasVenv(context)) {
                // venv in extention exists with wrong dependencies
                if (
                    !(await areDependenciesInstalled(
                        context,
                        pythonExecutableName
                    ))
                ) {
                    if (
                        !(await installDependencies(
                            context,
                            pythonExecutableName
                        ))
                    ) {
                        vscode.window
                            .showErrorMessage(
                                `${CONSTANTS.ERROR.DEPENDENCY_DOWNLOAD_ERROR} Using original interpreter at: ${pythonExecutableName}.`,
                                DialogResponses.READ_INSTALL_MD
                            )
                            .then(
                                (selection: vscode.MessageItem | undefined) => {
                                    if (
                                        selection ===
                                        DialogResponses.READ_INSTALL_MD
                                    ) {
                                        open(CONSTANTS.LINKS.INSTALL);
                                    }
                                }
                            );
                        return pythonExecutableName;
                    }
                }
            } else {
                pythonExecutableName = await promptInstallVenv(
                    context,
                    originalPythonExecutableName
                );
            }
        }

        if (pythonExecutableName === originalPythonExecutableName) {
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
                                if (
                                    !(await installDependencies(
                                        context,
                                        pythonExecutableName
                                    ))
                                ) {
                                    vscode.window
                                        .showErrorMessage(
                                            CONSTANTS.ERROR
                                                .DEPENDENCY_DOWNLOAD_ERROR,
                                            DialogResponses.READ_INSTALL_MD
                                        )
                                        .then(
                                            (
                                                selection:
                                                    | vscode.MessageItem
                                                    | undefined
                                            ) => {
                                                if (
                                                    selection ===
                                                    DialogResponses.READ_INSTALL_MD
                                                ) {
                                                    open(
                                                        CONSTANTS.LINKS.INSTALL
                                                    );
                                                }
                                            }
                                        );
                                    return pythonExecutableName;
                                }
                            }
                        }
                    );
            }
        } else {
            vscode.window.showInformationMessage(
                CONSTANTS.INFO.UPDATED_TO_EXTENSION_VENV
            );
            vscode.workspace
                .getConfiguration()
                .update(CONFIG.PYTHON_PATH, pythonExecutableName);
        }
    } else if (needsResponse) {
        vscode.window.showInformationMessage(
            CONSTANTS.INFO.ALREADY_SUCCESSFUL_INSTALL
        );
    }

    return pythonExecutableName;
};
