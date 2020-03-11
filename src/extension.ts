// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as cp from "child_process";
import * as fs from "fs";
import { registerDefaultFontFaces } from "office-ui-fabric-react";
import * as open from "open";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import {
    CONFIG,
    CONSTANTS,
    CPX_CONFIG_FILE,
    DEFAULT_DEVICE,
    DialogResponses,
    GLOBAL_ENV_VARS,
    HELPER_FILES,
    SERVER_INFO,
    TelemetryEventName,
    LANGUAGE_VARS,
} from "./constants";
import { CPXWorkspace } from "./cpxWorkspace";
import { DebugAdapterFactory } from "./debugger/debugAdapterFactory";
import { DebuggerCommunicationServer } from "./debuggerCommunicationServer";
import * as utils from "./extension_utils/utils";
import { SerialMonitor } from "./serialMonitor";
import { DebuggerCommunicationService } from "./service/debuggerCommunicationService";
import { DeviceSelectionService } from "./service/deviceSelectionService";
import { FileSelectionService } from "./service/fileSelectionService";
import { MessagingService } from "./service/messagingService";
import { PopupService } from "./service/PopupService";
import { SetupService } from "./service/SetupService";
import { SimulatorDebugConfigurationProvider } from "./simulatorDebugConfigurationProvider";
import getPackageInfo from "./telemetry/getPackageInfo";
import TelemetryAI from "./telemetry/telemetryAI";
import { UsbDetector } from "./usbDetector";
import { VSCODE_MESSAGES_TO_WEBVIEW, WEBVIEW_MESSAGES } from "./view/constants";

let telemetryAI: TelemetryAI;
let pythonExecutablePath: string = GLOBAL_ENV_VARS.PYTHON;
let configFileCreated: boolean = false;
let inDebugMode: boolean = false;
// Notification booleans
let firstTimeClosed: boolean = true;
let shouldShowRunCodePopup: boolean = true;

let setupService: SetupService;
const deviceSelectionService = new DeviceSelectionService();
const messagingService = new MessagingService(deviceSelectionService);
const debuggerCommunicationService = new DebuggerCommunicationService();
const fileSelectionService = new FileSelectionService(messagingService);

export let outChannel: vscode.OutputChannel | undefined;

function loadScript(context: vscode.ExtensionContext, scriptPath: string) {
    return `<script initialDevice=${deviceSelectionService.getCurrentActiveDevice()} src="${vscode.Uri.file(
        context.asAbsolutePath(scriptPath)
    )
        .with({ scheme: "vscode-resource" })
        .toString()}"></script>`;
}

const sendCurrentDeviceMessage = (currentPanel: vscode.WebviewPanel) => {
    if (currentPanel) {
        currentPanel.webview.postMessage({
            command: VSCODE_MESSAGES_TO_WEBVIEW.SET_DEVICE,
            active_device: deviceSelectionService.getCurrentActiveDevice(),
        });
    }
};
// Extension activation
export async function activate(context: vscode.ExtensionContext) {
    console.info(CONSTANTS.INFO.EXTENSION_ACTIVATED);

    telemetryAI = new TelemetryAI(context);
    setupService = new SetupService(telemetryAI);
    let currentPanel: vscode.WebviewPanel | undefined;
    let childProcess: cp.ChildProcess | undefined;
    let messageListener: vscode.Disposable;
    let activeEditorListener: vscode.Disposable;

    // Add our library path to settings.json for autocomplete functionality
    updatePythonExtraPaths();

    // ignore import errors so that adafruit_circuitplayground library
    // doesn't trigger lint errors
    updatePylintArgs(context);

    pythonExecutablePath = await setupService.setupEnv(context);

    try {
        utils.generateCPXConfig();
        configFileCreated = true;
    } catch (err) {
        console.info("Failed to create the CPX config file.");
        configFileCreated = false;
    }

    if (pythonExecutablePath === "") {
        return;
    }

    if (outChannel === undefined) {
        outChannel = vscode.window.createOutputChannel(CONSTANTS.NAME);
        utils.logToOutputChannel(outChannel, CONSTANTS.INFO.WELCOME_OUTPUT_TAB);
    }

    vscode.workspace.onDidSaveTextDocument(
        async (document: vscode.TextDocument) => {
            await fileSelectionService.updateCurrentFileFromTextFile(document);
        }
    );

    const currVersionReleaseName =
        "release_note_" + getPackageInfo(context).extensionVersion;
    const viewedReleaseNote = context.globalState.get(
        currVersionReleaseName,
        false
    );

    if (!viewedReleaseNote) {
        PopupService.openReleaseNote();
        context.globalState.update(currVersionReleaseName, true);
    }

    const openWebview = () => {
        if (currentPanel && currentPanel.webview) {
            messagingService.setWebview(currentPanel.webview);
            currentPanel.reveal(vscode.ViewColumn.Beside);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                "adafruitSimulator",
                CONSTANTS.LABEL.WEBVIEW_PANEL,
                { preserveFocus: true, viewColumn: vscode.ViewColumn.Beside },
                {
                    // Only allow the webview to access resources in our extension's media directory
                    localResourceRoots: [
                        vscode.Uri.file(
                            path.join(
                                context.extensionPath,
                                CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY
                            )
                        ),
                    ],
                    enableScripts: true,
                }
            );

            currentPanel.webview.html = getWebviewContent(context);
            messagingService.setWebview(currentPanel.webview);

            if (messageListener !== undefined) {
                messageListener.dispose();
                const index = context.subscriptions.indexOf(messageListener);
                if (index > -1) {
                    context.subscriptions.splice(index, 1);
                }
            }

            if (activeEditorListener !== undefined) {
                activeEditorListener.dispose();
                const index = context.subscriptions.indexOf(
                    activeEditorListener
                );
                if (index > -1) {
                    context.subscriptions.splice(index, 1);
                }
            }

            if (currentPanel) {
                // Handle messages from webview
                messageListener = currentPanel.webview.onDidReceiveMessage(
                    message => {
                        const messageJson = JSON.stringify({
                            active_device: deviceSelectionService.getCurrentActiveDevice(),
                            state: message.text,
                        });
                        switch (message.command) {
                            case WEBVIEW_MESSAGES.BUTTON_PRESS:
                                // Send input to the Python process
                                handleButtonPressTelemetry(message.text);
                                console.log(`About to write ${messageJson} \n`);
                                if (
                                    inDebugMode &&
                                    debuggerCommunicationService.getCurrentDebuggerServer()
                                ) {
                                    debuggerCommunicationService
                                        .getCurrentDebuggerServer()
                                        .emitInputChanged(messageJson);
                                } else if (childProcess) {
                                    childProcess.stdin.write(
                                        messageJson + "\n"
                                    );
                                }
                                break;
                            case WEBVIEW_MESSAGES.TOGGLE_PLAY_STOP:
                                console.log(`Play button ${messageJson} \n`);
                                if (message.text.state as boolean) {
                                    fileSelectionService.setPathAndSendMessage(
                                        message.text.selected_file
                                    );
                                    fileSelectionService.findCurrentTextDocument();
                                    telemetryAI.trackFeatureUsage(
                                        TelemetryEventName.COMMAND_RUN_SIMULATOR_BUTTON
                                    );
                                    runSimulatorCommand();
                                } else {
                                    killProcessIfRunning();
                                }

                                if (childProcess) {
                                    childProcess.stdin.write(
                                        messageJson + "\n"
                                    );
                                }

                                break;

                            case WEBVIEW_MESSAGES.SENSOR_CHANGED:
                                handleGestureTelemetry(message.text);
                                console.log(`Sensor changed ${messageJson} \n`);
                                if (
                                    inDebugMode &&
                                    debuggerCommunicationService.getCurrentDebuggerServer()
                                ) {
                                    debuggerCommunicationService
                                        .getCurrentDebuggerServer()
                                        .emitInputChanged(messageJson);
                                } else if (childProcess) {
                                    childProcess.stdin.write(
                                        messageJson + "\n"
                                    );
                                }
                                break;
                            case WEBVIEW_MESSAGES.REFRESH_SIMULATOR:
                                console.log("Refresh button");
                                runSimulatorCommand();
                                break;
                            case WEBVIEW_MESSAGES.SLIDER_TELEMETRY:
                                handleSensorTelemetry(message.text);
                                break;
                            case WEBVIEW_MESSAGES.SWITCH_DEVICE:
                                deviceSelectionService.setCurrentActiveDevice(
                                    message.text.active_device
                                );
                                killProcessIfRunning();
                                break;
                            default:
                                vscode.window.showInformationMessage(
                                    CONSTANTS.ERROR.UNEXPECTED_MESSAGE
                                );
                                break;
                        }
                    },
                    undefined,
                    context.subscriptions
                );

                activeEditorListener = utils.addVisibleTextEditorCallback(
                    currentPanel,
                    context
                );
                console.log("sent");
            }

            currentPanel.onDidDispose(
                () => {
                    currentPanel = undefined;
                    if (
                        debuggerCommunicationService.getCurrentDebuggerServer()
                    ) {
                        debuggerCommunicationService
                            .getCurrentDebuggerServer()
                            .setWebview(undefined);
                    }
                    killProcessIfRunning();
                    if (firstTimeClosed) {
                        vscode.window.showInformationMessage(
                            CONSTANTS.INFO.FIRST_TIME_WEBVIEW
                        );
                        firstTimeClosed = false;
                    }
                },
                undefined,
                context.subscriptions
            );
        }
        sendCurrentDeviceMessage(currentPanel);
    };

    const openCPXWebview = () => {
        deviceSelectionService.setCurrentActiveDevice(
            CONSTANTS.DEVICE_NAME.CPX
        );
        openWebview();
    };

    const openMicrobitWebview = () => {
        deviceSelectionService.setCurrentActiveDevice(
            CONSTANTS.DEVICE_NAME.MICROBIT
        );
        openWebview();
    };

    // Open Simulator on the webview
    const cpxOpenSimulator: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.openSimulator",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_COMMAND_OPEN_SIMULATOR
            );
            telemetryAI.runWithLatencyMeasure(
                openCPXWebview,
                TelemetryEventName.CPX_PERFORMANCE_OPEN_SIMULATOR
            );
        }
    );

    const microbitOpenSimulator: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.microbit.openSimulator",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_COMMAND_OPEN_SIMULATOR
            );
            telemetryAI.runWithLatencyMeasure(
                openMicrobitWebview,
                TelemetryEventName.MICROBIT_PERFORMANCE_OPEN_SIMULATOR
            );
        }
    );

    const openCPXTemplateFile = () => {
        deviceSelectionService.setCurrentActiveDevice(
            CONSTANTS.DEVICE_NAME.CPX
        );
        openTemplateFile(CONSTANTS.TEMPLATE.CPX);
    };

    const openMicrobitTemplateFile = () => {
        deviceSelectionService.setCurrentActiveDevice(
            CONSTANTS.DEVICE_NAME.MICROBIT
        );
        openTemplateFile(CONSTANTS.TEMPLATE.MICROBIT);
    };

    const openTemplateFile = (template: string) => {
        const fileName = template;
        const filePath =
            __dirname + path.sep + "templates" + path.sep + fileName;
        const file = fs.readFileSync(filePath, "utf8");
        const showNewFilePopup: boolean = vscode.workspace
            .getConfiguration()
            .get(CONFIG.SHOW_NEW_FILE_POPUP);

        if (showNewFilePopup && template === CONSTANTS.TEMPLATE.CPX) {
            vscode.window
                .showInformationMessage(
                    CONSTANTS.INFO.NEW_FILE,
                    DialogResponses.DONT_SHOW,
                    DialogResponses.EXAMPLE_CODE,
                    DialogResponses.TUTORIALS
                )
                .then((selection: vscode.MessageItem | undefined) => {
                    if (selection === DialogResponses.DONT_SHOW) {
                        vscode.workspace
                            .getConfiguration()
                            .update(CONFIG.SHOW_NEW_FILE_POPUP, false);
                        telemetryAI.trackFeatureUsage(
                            TelemetryEventName.CPX_CLICK_DIALOG_DONT_SHOW
                        );
                    } else if (selection === DialogResponses.EXAMPLE_CODE) {
                        open(CONSTANTS.LINKS.EXAMPLE_CODE);
                        telemetryAI.trackFeatureUsage(
                            TelemetryEventName.CPX_CLICK_DIALOG_EXAMPLE_CODE
                        );
                    } else if (selection === DialogResponses.TUTORIALS) {
                        const okAction = () => {
                            open(CONSTANTS.LINKS.TUTORIALS);
                            telemetryAI.trackFeatureUsage(
                                TelemetryEventName.CPX_CLICK_DIALOG_TUTORIALS
                            );
                        };
                        utils.showPrivacyModal(
                            okAction,
                            CONSTANTS.INFO.THIRD_PARTY_WEBSITE_ADAFRUIT
                        );
                    }
                });
        }

        // tslint:disable-next-line: ban-comma-operator
        vscode.workspace
            .openTextDocument({
                content: file,
                language: LANGUAGE_VARS.PYTHON.ID,
            })
            .then((template: vscode.TextDocument) => {
                vscode.window.showTextDocument(template, 1, false).then(() => {
                    openWebview();
                });
            }),
            // tslint:disable-next-line: no-unused-expression
            (error: any) => {
                handleNewFileErrorTelemetry();
                console.error(`Failed to open a new text document:  ${error}`);
            };
    };

    const cpxNewFile: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.newFile",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_COMMAND_NEW_FILE
            );
            telemetryAI.runWithLatencyMeasure(
                openCPXTemplateFile,
                TelemetryEventName.CPX_PERFORMANCE_NEW_FILE
            );
        }
    );

    const microbitNewFile: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.microbit.newFile",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_COMMAND_NEW_FILE
            );
            telemetryAI.runWithLatencyMeasure(
                openMicrobitTemplateFile,
                TelemetryEventName.MICROBIT_PERFORMANCE_NEW_FILE
            );
        }
    );

    const installDependencies: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.installDependencies",
        async () => {
            pythonExecutablePath = await setupService.setupEnv(context, true);
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.COMMAND_INSTALL_EXTENSION_DEPENDENCIES
            );
        }
    );

    const killProcessIfRunning = () => {
        if (childProcess !== undefined) {
            if (currentPanel) {
                currentPanel.webview.postMessage({
                    command: "reset-state",
                    active_device: deviceSelectionService.getCurrentActiveDevice(),
                });
            }
            // TODO: We need to check the process was correctly killed
            childProcess.kill();
            childProcess = undefined;
        }
    };

    const runSimulatorCommand = async () => {
        // Prevent running new code if a debug session is active
        if (inDebugMode) {
            vscode.window.showErrorMessage(
                CONSTANTS.ERROR.DEBUGGING_SESSION_IN_PROGESS
            );
            return;
        }
        if (shouldShowRunCodePopup) {
            const shouldExitCommand = await vscode.window
                .showWarningMessage(
                    CONSTANTS.WARNING.ACCEPT_AND_RUN,
                    DialogResponses.ACCEPT_AND_RUN,
                    DialogResponses.CANCEL
                )
                .then((selection: vscode.MessageItem | undefined) => {
                    let hasAccepted = true;
                    if (selection === DialogResponses.ACCEPT_AND_RUN) {
                        shouldShowRunCodePopup = false;
                        hasAccepted = false;
                    }
                    return hasAccepted;
                });
            // Don't run users code if they don't accept
            if (shouldExitCommand) {
                return;
            }
        }

        openWebview();

        if (!currentPanel) {
            return;
        }

        console.info(CONSTANTS.INFO.RUNNING_CODE);

        utils.logToOutputChannel(
            outChannel,
            CONSTANTS.INFO.DEPLOY_SIMULATOR,
            true
        );

        killProcessIfRunning();

        await fileSelectionService.updateCurrentFileFromEditor(
            vscode.window.activeTextEditor
        );

        if (fileSelectionService.getCurrentFileAbsPath() === "") {
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.ERROR.NO_FILE_TO_RUN,
                true
            );
            vscode.window.showErrorMessage(
                CONSTANTS.ERROR.NO_FILE_TO_RUN,
                DialogResponses.MESSAGE_UNDERSTOOD
            );
        } else {
            // Save on run
            await fileSelectionService.getCurrentTextDocument().save();

            if (
                !fileSelectionService
                    .getCurrentTextDocument()
                    .fileName.endsWith(LANGUAGE_VARS.PYTHON.FILE_ENDS)
            ) {
                utils.logToOutputChannel(
                    outChannel,
                    CONSTANTS.ERROR.NO_FILE_TO_RUN,
                    true
                );
                return;
            }
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.INFO.FILE_SELECTED(
                    fileSelectionService.getCurrentFileAbsPath()
                )
            );

            // Activate the run webview button
            currentPanel.webview.postMessage({
                command: "activate-play",
                active_device: deviceSelectionService.getCurrentActiveDevice(),
            });

            childProcess = cp.spawn(pythonExecutablePath, [
                utils.getPathToScript(
                    context,
                    CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
                    HELPER_FILES.PROCESS_USER_CODE_PY
                ),
                fileSelectionService.getCurrentFileAbsPath(),
                JSON.stringify({ enable_telemetry: utils.getTelemetryState() }),
            ]);

            let dataFromTheProcess = "";
            let oldMessage = "";

            // Data received from Python process
            childProcess.stdout.on("data", data => {
                dataFromTheProcess = data.toString();
                if (currentPanel) {
                    // Process the data from the process and send one state at a time
                    dataFromTheProcess.split("\0").forEach(message => {
                        if (
                            currentPanel &&
                            message.length > 0 &&
                            message !== oldMessage
                        ) {
                            oldMessage = message;
                            let messageToWebview;
                            // Check the message is a JSON
                            try {
                                messageToWebview = JSON.parse(message);
                                // Check the JSON is a state
                                switch (messageToWebview.type) {
                                    case "state":
                                        console.log(
                                            `Process state output = ${messageToWebview.data}`
                                        );
                                        const messageData = JSON.parse(
                                            messageToWebview.data
                                        );
                                        if (
                                            messageData.device_name ===
                                            deviceSelectionService.getCurrentActiveDevice()
                                        ) {
                                            messagingService.sendMessageToWebview(
                                                VSCODE_MESSAGES_TO_WEBVIEW.SET_STATE,
                                                messageData
                                            );
                                        }
                                        break;

                                    case "print":
                                        console.log(
                                            `Process print statement output = ${messageToWebview.data}`
                                        );
                                        utils.logToOutputChannel(
                                            outChannel,
                                            `[PRINT] ${messageToWebview.data}`
                                        );
                                        break;

                                    default:
                                        console.log(
                                            `Non-state JSON output from the process : ${messageToWebview}`
                                        );
                                        break;
                                }
                            } catch (err) {
                                console.log(
                                    `Non-JSON output from the process :  ${message}`
                                );
                            }
                        }
                    });
                }
            });

            // Std error output
            childProcess.stderr.on("data", data => {
                console.error(
                    `Error from the Python process through stderr: ${data}`
                );
                telemetryAI.trackFeatureUsage(
                    TelemetryEventName.ERROR_PYTHON_PROCESS
                );
                utils.logToOutputChannel(
                    outChannel,
                    CONSTANTS.ERROR.STDERR(data),
                    true
                );
                if (currentPanel) {
                    currentPanel.webview.postMessage({
                        active_device: deviceSelectionService.getCurrentActiveDevice(),
                        command: "reset-state",
                    });
                }
            });

            // When the process is done
            childProcess.on("end", (code: number) => {
                console.info(`Command execution exited with code: ${code}`);
            });
        }
    };

    // Send message to the webview
    const runSimulator: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.runSimulator",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.COMMAND_RUN_PALETTE
            );
            runSimulatorCommand();
        }
    );

    const deployCode = async (device: string) => {
        utils.logToOutputChannel(
            outChannel,
            CONSTANTS.INFO.DEPLOY_DEVICE,
            true
        );

        await fileSelectionService.updateCurrentFileFromEditor(
            vscode.window.activeTextEditor
        );

        if (fileSelectionService.getCurrentFileAbsPath() === "") {
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.ERROR.NO_FILE_TO_RUN,
                true
            );
            vscode.window.showErrorMessage(
                CONSTANTS.ERROR.NO_FILE_TO_RUN,
                DialogResponses.MESSAGE_UNDERSTOOD
            );
        } else {
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.INFO.FILE_SELECTED(
                    fileSelectionService.getCurrentFileAbsPath()
                )
            );

            const deviceProcess = cp.spawn(pythonExecutablePath, [
                utils.getPathToScript(
                    context,
                    CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
                    HELPER_FILES.DEVICE_PY
                ),
                device,
                fileSelectionService.getCurrentFileAbsPath(),
            ]);

            let dataFromTheProcess = "";

            // Data received from Python process
            deviceProcess.stdout.on("data", data => {
                dataFromTheProcess = data.toString();
                console.log(`Device output = ${dataFromTheProcess}`);
                let messageToWebview;
                try {
                    messageToWebview = JSON.parse(dataFromTheProcess);
                    if (messageToWebview.type === "complete") {
                        utils.logToOutputChannel(
                            outChannel,
                            CONSTANTS.INFO.DEPLOY_SUCCESS,
                            true
                        );
                    }
                    handleDeployToDeviceTelemetry(messageToWebview, device);
                } catch (err) {
                    console.log(
                        `Non-JSON output from the process :  ${dataFromTheProcess}`
                    );
                }
            });

            // Std error output
            deviceProcess.stderr.on("data", data => {
                handleDeployToDeviceErrorTelemetry(data, device);
                console.error(
                    `Error from the Python device process through stderr: ${data}`
                );
                utils.logToOutputChannel(
                    outChannel,
                    `[ERROR] ${data} \n`,
                    true
                );
            });

            // When the process is done
            deviceProcess.on("end", (code: number) => {
                console.info(`Command execution exited with code: ${code}`);
            });
        }
    };

    const handleDeployToDeviceErrorTelemetry = (
        data: string,
        device: string
    ) => {
        let telemetryErrorName: string;
        if (device === CONSTANTS.DEVICE_NAME.CPX) {
            telemetryErrorName =
                TelemetryEventName.CPX_ERROR_PYTHON_DEVICE_PROCESS;
        } else if (device === CONSTANTS.DEVICE_NAME.MICROBIT) {
            telemetryErrorName =
                TelemetryEventName.MICROBIT_ERROR_PYTHON_DEVICE_PROCESS;
        }
        telemetryAI.trackFeatureUsage(telemetryErrorName, { error: `${data}` });
    };

    const handleDeployToDeviceTelemetry = (message: any, device: string) => {
        let successCommandDeployDevice: string;
        let errorCommandDeployWithoutDevice: string;
        if (device === CONSTANTS.DEVICE_NAME.CPX) {
            successCommandDeployDevice =
                TelemetryEventName.CPX_SUCCESS_COMMAND_DEPLOY_DEVICE;
            errorCommandDeployWithoutDevice =
                TelemetryEventName.CPX_ERROR_DEPLOY_WITHOUT_DEVICE;
        } else if (device === CONSTANTS.DEVICE_NAME.MICROBIT) {
            successCommandDeployDevice =
                TelemetryEventName.MICROBIT_SUCCESS_COMMAND_DEPLOY_DEVICE;
            errorCommandDeployWithoutDevice =
                TelemetryEventName.MICROBIT_ERROR_DEPLOY_WITHOUT_DEVICE;
        }
        switch (message.type) {
            case "complete":
                telemetryAI.trackFeatureUsage(successCommandDeployDevice);
                break;
            case "no-device":
                telemetryAI.trackFeatureUsage(errorCommandDeployWithoutDevice);
                if (device === CONSTANTS.DEVICE_NAME.CPX) {
                    vscode.window
                        .showErrorMessage(
                            CONSTANTS.ERROR.NO_DEVICE,
                            DialogResponses.HELP
                        )
                        .then((selection: vscode.MessageItem | undefined) => {
                            if (selection === DialogResponses.HELP) {
                                const okAction = () => {
                                    open(CONSTANTS.LINKS.HELP);
                                    telemetryAI.trackFeatureUsage(
                                        TelemetryEventName.CPX_CLICK_DIALOG_HELP_DEPLOY_TO_DEVICE
                                    );
                                };
                                utils.showPrivacyModal(
                                    okAction,
                                    CONSTANTS.INFO.THIRD_PARTY_WEBSITE_ADAFRUIT
                                );
                            }
                        });
                } else if (device === CONSTANTS.DEVICE_NAME.MICROBIT) {
                    vscode.window.showErrorMessage(CONSTANTS.ERROR.NO_DEVICE);
                }
                break;
            case "low-python-version":
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.LOW_PYTHON_VERSION_FOR_MICROBIT_DEPLOYMENT
                );
                break;
            default:
                console.log(
                    `Non-state JSON output from the process : ${message}`
                );
                break;
        }
    };

    const cpxDeployCodeToDevice = () => {
        deployCode(CONSTANTS.DEVICE_NAME.CPX);
    };

    const microbitDeployCodeToDevice = () => {
        deployCode(CONSTANTS.DEVICE_NAME.MICROBIT);
    };

    const cpxDeployToDevice: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.deployToDevice",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_COMMAND_DEPLOY_DEVICE
            );
            telemetryAI.runWithLatencyMeasure(
                cpxDeployCodeToDevice,
                TelemetryEventName.CPX_PERFORMANCE_DEPLOY_DEVICE
            );
        }
    );

    const microbitDeployToDevice: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.microbit.deployToDevice",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_COMMAND_DEPLOY_DEVICE
            );
            telemetryAI.runWithLatencyMeasure(
                microbitDeployCodeToDevice,
                TelemetryEventName.MICROBIT_PERFORMANCE_DEPLOY_DEVICE
            );
        }
    );

    let serialMonitor: SerialMonitor | undefined;
    if (configFileCreated) {
        serialMonitor = SerialMonitor.getInstance();
        context.subscriptions.push(serialMonitor);
    }

    const selectSerialPort: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.selectSerialPort",
        () => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(() => {
                    serialMonitor.selectSerialPort(null, null);
                }, TelemetryEventName.COMMAND_SERIAL_MONITOR_CHOOSE_PORT);
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const openSerialMonitor: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.openSerialMonitor",
        () => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(
                    serialMonitor.openSerialMonitor.bind(serialMonitor),
                    TelemetryEventName.COMMAND_SERIAL_MONITOR_OPEN
                );
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const changeBaudRate: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.changeBaudRate",
        () => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(
                    serialMonitor.changeBaudRate.bind(serialMonitor),
                    TelemetryEventName.COMMAND_SERIAL_MONITOR_BAUD_RATE
                );
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const closeSerialMonitor: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.closeSerialMonitor",
        (port, showWarning = true) => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(() => {
                    serialMonitor.closeSerialMonitor(port, showWarning);
                }, TelemetryEventName.COMMAND_SERIAL_MONITOR_CLOSE);
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const showReleaseNote = vscode.commands.registerCommand(
        "deviceSimulatorExpress.",
        (port, showWarning = true) => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(() => {
                    serialMonitor.closeSerialMonitor(port, showWarning);
                }, TelemetryEventName.COMMAND_SERIAL_MONITOR_CLOSE);
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    UsbDetector.getInstance().initialize(context.extensionPath);
    UsbDetector.getInstance().startListening();

    if (
        CPXWorkspace.rootPath &&
        (utils.fileExistsSync(
            path.join(CPXWorkspace.rootPath, CPX_CONFIG_FILE)
        ) ||
            vscode.window.activeTextEditor)
    ) {
        (() => {
            if (!SerialMonitor.getInstance().initialized) {
                SerialMonitor.getInstance().initialize();
            }
        })();
    }

    // Debugger configuration
    const simulatorDebugConfiguration = new SimulatorDebugConfigurationProvider(
        utils.getPathToScript(context, "out/", "debug_user_code.py")
    );

    const debugAdapterFactory = new DebugAdapterFactory(
        vscode.debug.activeDebugSession,
        messagingService,
        debuggerCommunicationService
    );
    vscode.debug.registerDebugAdapterTrackerFactory(
        LANGUAGE_VARS.PYTHON.ID,
        debugAdapterFactory
    );
    // On Debug Session Start: Init comunication
    const debugSessionsStarted = vscode.debug.onDidStartDebugSession(() => {
        if (simulatorDebugConfiguration.deviceSimulatorExpressDebug) {
            // Reinitialize process
            killProcessIfRunning();
            inDebugMode = true;

            try {
                // Shut down existing server on debug restart
                if (debuggerCommunicationService.getCurrentDebuggerServer()) {
                    debuggerCommunicationService.resetCurrentDebuggerServer();
                }

                debuggerCommunicationService.setCurrentDebuggerServer(
                    new DebuggerCommunicationServer(
                        currentPanel,
                        utils.getServerPortConfig(),
                        deviceSelectionService.getCurrentActiveDevice()
                    )
                );

                handleDebuggerTelemetry();

                openWebview();
                if (currentPanel) {
                    debuggerCommunicationService
                        .getCurrentDebuggerServer()
                        .setWebview(currentPanel);
                    currentPanel.webview.postMessage({
                        active_device: deviceSelectionService.getCurrentActiveDevice(),
                        command: "activate-play",
                    });
                }
            } catch (err) {
                if (err.message === SERVER_INFO.ERROR_CODE_INIT_SERVER) {
                    console.error(
                        `Error trying to init the server on port ${utils.getServerPortConfig()}`
                    );

                    handleDebuggerFailTelemetry();

                    vscode.window.showErrorMessage(
                        CONSTANTS.ERROR.DEBUGGER_SERVER_INIT_FAILED(
                            utils.getServerPortConfig()
                        )
                    );
                }
            }
        }
    });

    // On Debug Session Stop: Stop communiation
    const debugSessionStopped = vscode.debug.onDidTerminateDebugSession(() => {
        if (simulatorDebugConfiguration.deviceSimulatorExpressDebug) {
            inDebugMode = false;
            simulatorDebugConfiguration.deviceSimulatorExpressDebug = false;
            if (debuggerCommunicationService.getCurrentDebuggerServer()) {
                debuggerCommunicationService.resetCurrentDebuggerServer();
            }
            if (currentPanel) {
                currentPanel.webview.postMessage({
                    command: "reset-state",
                    active_device: deviceSelectionService.getCurrentActiveDevice(),
                });
            }
        }
    });

    const configsChanged = vscode.workspace.onDidChangeConfiguration(
        async () => {
            if (utils.checkConfig(CONFIG.CONFIG_ENV_ON_SWITCH)) {
                pythonExecutablePath = await setupService.setupEnv(context);
            }
        }
    );

    context.subscriptions.push(
        installDependencies,
        runSimulator,
        changeBaudRate,
        closeSerialMonitor,
        cpxDeployToDevice,
        cpxNewFile,
        openSerialMonitor,
        cpxOpenSimulator,
        selectSerialPort,
        microbitOpenSimulator,
        microbitNewFile,
        microbitDeployToDevice,
        vscode.debug.registerDebugConfigurationProvider(
            CONSTANTS.DEBUG_CONFIGURATION_TYPE,
            simulatorDebugConfiguration
        ),
        debugSessionsStarted,
        debugSessionStopped,
        configsChanged
    );
}

const handleDebuggerTelemetry = () => {
    switch (deviceSelectionService.getCurrentActiveDevice()) {
        case CONSTANTS.DEVICE_NAME.CPX:
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_DEBUGGER_INIT_SUCCESS
            );
            break;
        case CONSTANTS.DEVICE_NAME.MICROBIT:
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_DEBUGGER_INIT_SUCCESS
            );
            break;
        default:
            break;
    }
};

const handleDebuggerFailTelemetry = () => {
    switch (deviceSelectionService.getCurrentActiveDevice()) {
        case CONSTANTS.DEVICE_NAME.CPX:
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_DEBUGGER_INIT_FAIL
            );
            break;
        case CONSTANTS.DEVICE_NAME.MICROBIT:
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_DEBUGGER_INIT_FAIL
            );
            break;
        default:
            break;
    }
};

const handleButtonPressTelemetry = (buttonState: any) => {
    switch (deviceSelectionService.getCurrentActiveDevice()) {
        case CONSTANTS.DEVICE_NAME.CPX:
            handleCPXButtonPressTelemetry(buttonState);
            break;
        case CONSTANTS.DEVICE_NAME.MICROBIT:
            handleMicrobitButtonPressTelemetry(buttonState);
            break;
        default:
            break;
    }
};

const handleGestureTelemetry = (sensorState: any) => {
    switch (deviceSelectionService.getCurrentActiveDevice()) {
        case CONSTANTS.DEVICE_NAME.CPX:
            handleCPXGestureTelemetry(sensorState);
            break;
        case CONSTANTS.DEVICE_NAME.MICROBIT:
            break;
        default:
            break;
    }
};

const handleSensorTelemetry = (sensor: string) => {
    switch (deviceSelectionService.getCurrentActiveDevice()) {
        case CONSTANTS.DEVICE_NAME.CPX:
            handleCPXSensorTelemetry(sensor);
            break;
        case CONSTANTS.DEVICE_NAME.MICROBIT:
            handleMicrobitSensorTelemetry(sensor);
            break;
        default:
            break;
    }
};

const handleCPXButtonPressTelemetry = (buttonState: any) => {
    if (buttonState.button_a && buttonState.button_b) {
        telemetryAI.trackFeatureUsage(
            TelemetryEventName.CPX_SIMULATOR_BUTTON_AB
        );
    } else if (buttonState.button_a) {
        telemetryAI.trackFeatureUsage(
            TelemetryEventName.CPX_SIMULATOR_BUTTON_A
        );
    } else if (buttonState.button_b) {
        telemetryAI.trackFeatureUsage(
            TelemetryEventName.CPX_SIMULATOR_BUTTON_B
        );
    } else if (buttonState.switch) {
        telemetryAI.trackFeatureUsage(TelemetryEventName.CPX_SIMULATOR_SWITCH);
    }
};

const handleCPXGestureTelemetry = (sensorState: any) => {
    if (sensorState.shake) {
        handleCPXSensorTelemetry("shake");
    } else if (sensorState.touch) {
        handleCPXSensorTelemetry("touch");
    }
};

const handleCPXSensorTelemetry = (sensor: string) => {
    switch (sensor) {
        case "temperature":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_TEMPERATURE_SENSOR
            );
            break;
        case "light":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_LIGHT_SENSOR
            );
            break;
        case "motion_x":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_MOTION_SENSOR
            );
            break;
        case "motion_y":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_MOTION_SENSOR
            );
            break;
        case "motion_z":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_MOTION_SENSOR
            );
            break;
        case "shake":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_SHAKE
            );
            break;
        case "touch":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_SIMULATOR_CAPACITIVE_TOUCH
            );
            break;
    }
};

const handleMicrobitButtonPressTelemetry = (buttonState: any) => {
    if (buttonState.button_a && buttonState.button_b) {
        telemetryAI.trackFeatureUsage(
            TelemetryEventName.MICROBIT_SIMULATOR_BUTTON_AB
        );
    } else if (buttonState.button_a) {
        telemetryAI.trackFeatureUsage(
            TelemetryEventName.MICROBIT_SIMULATOR_BUTTON_A
        );
    } else if (buttonState.button_b) {
        telemetryAI.trackFeatureUsage(
            TelemetryEventName.MICROBIT_SIMULATOR_BUTTON_B
        );
    }
};

const handleMicrobitSensorTelemetry = (sensor: string) => {
    switch (sensor) {
        case "temperature":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_SIMULATOR_TEMPERATURE_SENSOR
            );
            break;
        case "light":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_SIMULATOR_LIGHT_SENSOR
            );
            break;
        case "motion_x":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_SIMULATOR_MOTION_SENSOR
            );
            break;
        case "motion_y":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_SIMULATOR_MOTION_SENSOR
            );
            break;
        case "motion_z":
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_SIMULATOR_MOTION_SENSOR
            );
            break;
    }
};

const handleNewFileErrorTelemetry = () => {
    switch (deviceSelectionService.getCurrentActiveDevice()) {
        case CONSTANTS.DEVICE_NAME.CPX:
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.CPX_ERROR_COMMAND_NEW_FILE
            );
            break;
        case CONSTANTS.DEVICE_NAME.MICROBIT:
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.MICROBIT_ERROR_COMMAND_NEW_FILE
            );
            break;
        default:
            break;
    }
};

const updatePythonExtraPaths = () => {
    updateConfigLists(
        "python.autoComplete.extraPaths",
        [__dirname],
        vscode.ConfigurationTarget.Global
    );
};

const updatePylintArgs = (context: vscode.ExtensionContext) => {
    const outPath: string = utils.createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY
    );

    // update pylint args to extend system path
    // to include python libs local to extention
    updateConfigLists(
        "python.linting.pylintArgs",
        ["--init-hook", `import sys; sys.path.append(\"${outPath}\")`],
        vscode.ConfigurationTarget.Workspace
    );
};

const updateConfigLists = (
    section: string,
    newItems: string[],
    scope: vscode.ConfigurationTarget
) => {
    // function for adding elements to configuration arrays
    const currentExtraItems: string[] =
        vscode.workspace.getConfiguration().get(section) || [];
    const extraItemsSet: Set<string> = new Set(
        currentExtraItems.concat(newItems)
    );

    vscode.workspace
        .getConfiguration()
        .update(section, Array.from(extraItemsSet), scope);
};

function getWebviewContent(context: vscode.ExtensionContext) {
    return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>${CONSTANTS.NAME}</title>
            </head>
          <body>
            <div id="root"></div>
            <script >
              const vscode = acquireVsCodeApi();
            </script>
            <script ></script>
            ${loadScript(context, "out/vendor.js")}
            ${loadScript(context, "out/simulator.js")}
          </body>
          </html>`;
}

// this method is called when your extension is deactivated
export async function deactivate() {
    const monitor: SerialMonitor = SerialMonitor.getInstance();
    await monitor.closeSerialMonitor(null, false);
    UsbDetector.getInstance().stopListening();
}
