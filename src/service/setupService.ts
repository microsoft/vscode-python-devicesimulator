import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import {
    CONFIG,
    CONSTANTS,
    DialogResponses,
    GLOBAL_ENV_VARS,
    HELPER_FILES,
    TelemetryEventName,
    VERSIONS,
} from "../constants";
import {
    checkConfig,
    createEscapedPath,
    exec,
    getConfig,
    getPathToScript,
    showPrivacyModal,
} from "../extension_utils/utils";
import TelemetryAI from "../telemetry/telemetryAI";

export class SetupService {
    private telemetryAI: TelemetryAI;

    constructor(telemetryAI: TelemetryAI) {
        this.telemetryAI = telemetryAI;
    }

    public setupEnv = async (
        context: vscode.ExtensionContext,
        needsResponse: boolean = false
    ) => {
        const originalpythonExecutablePath = await this.getCurrentPythonExecutablePath();
        let pythonExecutablePath = originalpythonExecutablePath;
        const pythonExecutableName: string =
            os.platform() === "win32"
                ? HELPER_FILES.PYTHON_EXE
                : HELPER_FILES.PYTHON;

        if (
            !(await this.areDependenciesInstalled(
                context,
                pythonExecutablePath
            ))
        ) {
            // environment needs to install dependencies
            if (!(await this.checkIfVenv(context, pythonExecutablePath))) {
                const pythonExecutablePathVenv = await this.getPythonVenv(
                    context,
                    pythonExecutableName
                );
                if (await this.hasVenv(context)) {
                    // venv in extention exists with wrong dependencies

                    if (
                        !(await this.areDependenciesInstalled(
                            context,
                            pythonExecutablePathVenv
                        ))
                    ) {
                        pythonExecutablePath = await this.installDependenciesWrapper(
                            context,
                            pythonExecutablePathVenv,
                            pythonExecutablePath
                        );
                    } else {
                        pythonExecutablePath = pythonExecutablePathVenv;
                    }
                } else {
                    pythonExecutablePath = await this.promptInstallVenv(
                        context,
                        originalpythonExecutablePath,
                        pythonExecutableName
                    );
                    this.telemetryAI.trackFeatureUsage(
                        TelemetryEventName.SETUP_INSTALL_VENV
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
            } else {
                this.telemetryAI.trackFeatureUsage(
                    TelemetryEventName.SETUP_HAS_VENV
                );
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
                                if (
                                    installChoice ===
                                    DialogResponses.INSTALL_NOW
                                ) {
                                    this.telemetryAI.trackFeatureUsage(
                                        TelemetryEventName.SETUP_ORIGINAL_INTERPRETER_DEP_INSTALL
                                    );
                                    await this.installDependenciesWrapper(
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
                                                    await this.installDependenciesWrapper(
                                                        context,
                                                        pythonExecutablePath
                                                    );
                                                } else {
                                                    this.telemetryAI.trackFeatureUsage(
                                                        TelemetryEventName.SETUP_NO_DEPS_INSTALLED
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

    public getCurrentPythonExecutablePath = async () => {
        let originalpythonExecutablePath = "";

        // try to get name from interpreter
        try {
            originalpythonExecutablePath = getConfig(CONFIG.PYTHON_PATH);
        } catch (err) {
            originalpythonExecutablePath = GLOBAL_ENV_VARS.PYTHON;
        }

        if (
            originalpythonExecutablePath === GLOBAL_ENV_VARS.PYTHON ||
            originalpythonExecutablePath === ""
        ) {
            this.telemetryAI.trackFeatureUsage(
                TelemetryEventName.SETUP_AUTO_RESOLVE_PYTHON_PATH
            );
            try {
                const { stdout } = await this.executePythonCommand(
                    GLOBAL_ENV_VARS.PYTHON,
                    `-c "import sys; print(sys.executable)"`
                );
                originalpythonExecutablePath = stdout.trim();
            } catch (err) {
                this.telemetryAI.trackFeatureUsage(
                    TelemetryEventName.SETUP_NO_PYTHON_PATH
                );
                vscode.window
                    .showErrorMessage(
                        CONSTANTS.ERROR.NO_PYTHON_PATH,
                        DialogResponses.INSTALL_PYTHON
                    )
                    .then((selection: vscode.MessageItem | undefined) => {
                        if (selection === DialogResponses.INSTALL_PYTHON) {
                            const okAction = () => {
                                this.telemetryAI.trackFeatureUsage(
                                    TelemetryEventName.SETUP_DOWNLOAD_PYTHON
                                );
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
            await vscode.window.showErrorMessage(
                CONSTANTS.ERROR.BAD_PYTHON_PATH
            );
            this.telemetryAI.trackFeatureUsage(
                TelemetryEventName.SETUP_INVALID_PYTHON_INTERPRETER_PATH
            );
            return "";
        }

        if (!(await this.validatePythonVersion(originalpythonExecutablePath))) {
            this.telemetryAI.trackFeatureUsage(
                TelemetryEventName.SETUP_INVALID_PYTHON_VER
            );
            return "";
        }

        return originalpythonExecutablePath;
    };

    public isPipInstalled = async (pythonExecutablePath: string) => {
        try {
            const { stdout } = await this.executePythonCommand(
                pythonExecutablePath,
                " -m pip"
            );
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

    public checkIfVenv = async (
        context: vscode.ExtensionContext,
        pythonExecutablePath: string
    ) => {
        const venvCheckerPath: string = getPathToScript(
            context,
            CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
            HELPER_FILES.CHECK_IF_VENV_PY
        );
        const { stdout } = await this.executePythonCommand(
            pythonExecutablePath,
            `"${venvCheckerPath}"`
        );
        return stdout.trim() === "1";
    };

    public executePythonCommand = async (
        pythonExecutablePath: string,
        command: string
    ) => {
        return exec(`${createEscapedPath(pythonExecutablePath)} ${command}`);
    };

    public validatePythonVersion = async (pythonExecutablePath: string) => {
        const { stdout } = await this.executePythonCommand(
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

    public hasVenv = async (context: vscode.ExtensionContext) => {
        const pathToEnv: string = getPathToScript(
            context,
            CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR
        );

        return fs.existsSync(pathToEnv);
    };

    public promptInstallVenv = (
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
                    return this.installPythonVenv(
                        context,
                        pythonExecutable,
                        pythonExecutableName
                    );
                } else {
                    // return pythonExecutable, notifying the caller
                    // that the user was unwilling to create venv
                    // and by default, this will trigger the extension to
                    // try using pythonExecutable
                    return pythonExecutable;
                }
            });
    };

    public getPythonVenv = async (
        context: vscode.ExtensionContext,
        pythonExecutableName: string
    ) => {
        const subFolder = os.platform() === "win32" ? "Scripts" : "bin";

        return getPathToScript(
            context,
            path.join(CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR, subFolder),
            pythonExecutableName
        );
    };

    public installPythonVenv = async (
        context: vscode.ExtensionContext,
        pythonExecutable: string,
        pythonExecutableName: string
    ) => {
        const pathToEnv: string = getPathToScript(
            context,
            CONSTANTS.FILESYSTEM.PYTHON_VENV_DIR
        );

        vscode.window.showInformationMessage(
            CONSTANTS.INFO.INSTALLING_PYTHON_VENV
        );

        const pythonPath: string = await this.getPythonVenv(
            context,
            pythonExecutableName
        );

        try {
            // make venv
            // run command to download dependencies to out/python_libs
            await this.executePythonCommand(
                pythonExecutable,
                `-m venv "${pathToEnv}"`
            );
        } catch (err) {
            this.telemetryAI.trackFeatureUsage(
                TelemetryEventName.SETUP_VENV_CREATION_ERR
            );
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

        return this.installDependenciesWrapper(
            context,
            pythonPath,
            pythonExecutable
        );
    };

    public areDependenciesInstalled = async (
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
            const { stdout } = await this.executePythonCommand(
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

    public installDependencies = async (
        context: vscode.ExtensionContext,
        pythonPath: string
    ) => {
        const requirementsPyInstallPath: string = getPathToScript(
            context,
            CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
            "install_dependencies.py"
        );

        if (!this.isPipInstalled(pythonPath)) {
            this.telemetryAI.trackFeatureUsage(TelemetryEventName.SETUP_NO_PIP);
            return false;
        }

        try {
            const { stdout } = await this.executePythonCommand(
                pythonPath,
                `"${requirementsPyInstallPath}"`
            );
            console.log(`DSE ${stdout}`);
            vscode.window.showInformationMessage(
                CONSTANTS.INFO.SUCCESSFUL_INSTALL
            );
            return true;
        } catch (err) {
            console.log(`DSE ${err}`);
            return false;
        }
    };

    public installDependenciesWrapper = async (
        context: vscode.ExtensionContext,
        pythonPath: string,
        backupPythonPath: string = ""
    ) => {
        let errMessage = CONSTANTS.ERROR.DEPENDENCY_DOWNLOAD_ERROR;
        if (backupPythonPath !== "") {
            errMessage = `${errMessage} Using original interpreter at: ${backupPythonPath}.`;
        }
        if (!(await this.installDependencies(context, pythonPath))) {
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

            this.telemetryAI.trackFeatureUsage(
                TelemetryEventName.SETUP_DEP_INSTALL_FAIL
            );
            return backupPythonPath;
        }
        return pythonPath;
    };
}
