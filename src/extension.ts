// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as cp from "child_process";
import * as fs from "fs";
import * as open from "open";
import * as path from "path";
import * as vscode from "vscode";
import {
    CONFIG,
    CONSTANTS,
    CPX_CONFIG_FILE,
    DEFAULT_DEVICE,
    DialogResponses,
    SERVER_INFO,
    TelemetryEventName,
} from "./constants";
import { CPXWorkspace } from "./cpxWorkspace";
import { DebuggerCommunicationServer } from "./debuggerCommunicationServer";
import * as utils from "./extension_utils/utils";
import { SerialMonitor } from "./serialMonitor";
import { SimulatorDebugConfigurationProvider } from "./simulatorDebugConfigurationProvider";
import TelemetryAI from "./telemetry/telemetryAI";
import { UsbDetector } from "./usbDetector";
import { VSCODE_MESSAGES_TO_WEBVIEW, WEBVIEW_MESSAGES } from "./view/constants";

let currentFileAbsPath: string = "";
let currentTextDocument: vscode.TextDocument;
let telemetryAI: TelemetryAI;
let pythonExecutableName: string = "python";
let configFileCreated: boolean = false;
let inDebugMode: boolean = false;
let debuggerCommunicationHandler: DebuggerCommunicationServer;
// Notification booleans
let firstTimeClosed: boolean = true;
let shouldShowInvalidFileNamePopup: boolean = true;
let shouldShowRunCodePopup: boolean = true;

let currentActiveDevice: string = DEFAULT_DEVICE;

export let outChannel: vscode.OutputChannel | undefined;

function loadScript(context: vscode.ExtensionContext, scriptPath: string) {
    return `<script initialDevice=${currentActiveDevice} src="${vscode.Uri.file(
        context.asAbsolutePath(scriptPath)
    )
        .with({ scheme: "vscode-resource" })
        .toString()}"></script>`;
}

const setPathAndSendMessage = (
    currentPanel: vscode.WebviewPanel,
    newFilePath: string
) => {
    currentFileAbsPath = newFilePath;
    if (currentPanel) {
        currentPanel.webview.postMessage({
            command: "current-file",
            active_device: currentActiveDevice,

            state: {
                running_file: newFilePath,
            },
        });
    }
};

const sendCurrentDeviceMessage = (currentPanel: vscode.WebviewPanel) => {
    if (currentPanel) {
        currentPanel.webview.postMessage({
            command: VSCODE_MESSAGES_TO_WEBVIEW.SET_DEVICE,
            active_device: currentActiveDevice,
        });
    }
};

// Extension activation
export async function activate(context: vscode.ExtensionContext) {
    console.info(CONSTANTS.INFO.EXTENSION_ACTIVATED);

    telemetryAI = new TelemetryAI(context);
    let currentPanel: vscode.WebviewPanel | undefined;
    let childProcess: cp.ChildProcess | undefined;
    let messageListener: vscode.Disposable;
    let activeEditorListener: vscode.Disposable;

    // Add our library path to settings.json for autocomplete functionality
    updatePythonExtraPaths();

    // ignore import errors so that adafruit_circuitplayground library
    // doesn't trigger lint errors
    updatePylintArgs(context);

    pythonExecutableName = await utils.setPythonExectuableName();

    await utils.checkPythonDependencies(context, pythonExecutableName);

    // Generate cpx.json
    try {
        utils.generateCPXConfig();
        configFileCreated = true;
    } catch (err) {
        console.info("Failed to create the CPX config file.");
        configFileCreated = false;
    }

    if (pythonExecutableName === "") {
        return;
    }

    if (outChannel === undefined) {
        outChannel = vscode.window.createOutputChannel(CONSTANTS.NAME);
        utils.logToOutputChannel(outChannel, CONSTANTS.INFO.WELCOME_OUTPUT_TAB);
    }

    vscode.workspace.onDidSaveTextDocument(
        async (document: vscode.TextDocument) => {
            await updateCurrentFileIfPython(document, currentPanel);
        }
    );

    const openWebview = () => {
        if (currentPanel) {
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
                            active_device: currentActiveDevice,
                            state: message.text,
                        });
                        switch (message.command) {
                            case WEBVIEW_MESSAGES.BUTTON_PRESS:
                                // Send input to the Python process
                                handleButtonPressTelemetry(message.text);
                                console.log(`About to write ${messageJson} \n`);
                                if (
                                    inDebugMode &&
                                    debuggerCommunicationHandler
                                ) {
                                    debuggerCommunicationHandler.emitButtonPress(
                                        messageJson
                                    );
                                } else if (childProcess) {
                                    childProcess.stdin.write(
                                        messageJson + "\n"
                                    );
                                }
                                break;
                            case WEBVIEW_MESSAGES.TOGGLE_PLAY_STOP:
                                console.log(`Play button ${messageJson} \n`);
                                if (message.text.state as boolean) {
                                    setPathAndSendMessage(
                                        currentPanel,
                                        message.text.selected_file
                                    );
                                    if (currentFileAbsPath) {
                                        const foundDocument = utils.getActiveEditorFromPath(
                                            currentFileAbsPath
                                        );
                                        if (foundDocument !== undefined) {
                                            currentTextDocument = foundDocument;
                                        }
                                    }
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
                                handleCPXGestureTelemetry(message.text);
                                console.log(`Sensor changed ${messageJson} \n`);
                                if (
                                    inDebugMode &&
                                    debuggerCommunicationHandler
                                ) {
                                    debuggerCommunicationHandler.emitSensorChanged(
                                        messageJson
                                    );
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
                                switchDevice(message.text.active_device);
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
                    if (debuggerCommunicationHandler) {
                        debuggerCommunicationHandler.setWebview(undefined);
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
        switchDevice(CONSTANTS.DEVICE_NAME.CPX);
        openWebview();
    };

    const openMicrobitWebview = () => {
        switchDevice(CONSTANTS.DEVICE_NAME.MICROBIT);
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
        switchDevice(CONSTANTS.DEVICE_NAME.CPX);
        openTemplateFile(CONSTANTS.TEMPLATE.CPX);
    };

    const openMicrobitTemplateFile = () => {
        switchDevice(CONSTANTS.DEVICE_NAME.MICROBIT);
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
                        utils.showPrivacyModal(okAction);
                    }
                });
        }

        // tslint:disable-next-line: ban-comma-operator
        vscode.workspace
            .openTextDocument({ content: file, language: "python" })
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
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.COMMAND_INSTALL_EXTENSION_DEPENDENCIES
            );
            const pathToLibs: string = utils.getPathToScript(
                context,
                CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
                CONSTANTS.FILESYSTEM.PYTHON_LIBS_DIR
            );
            return utils.installPythonDependencies(
                context,
                pythonExecutableName,
                pathToLibs
            );
        }
    );

    const killProcessIfRunning = () => {
        if (childProcess !== undefined) {
            if (currentPanel) {
                console.info("Sending clearing state command");
                currentPanel.webview.postMessage({
                    command: "reset-state",
                    active_device: currentActiveDevice,
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

        await updateCurrentFileIfPython(
            vscode.window.activeTextEditor!.document,
            currentPanel
        );

        if (currentFileAbsPath === "") {
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
            await currentTextDocument.save();

            if (!currentTextDocument.fileName.endsWith(".py")) {
                utils.logToOutputChannel(
                    outChannel,
                    CONSTANTS.ERROR.NO_FILE_TO_RUN,
                    true
                );
                return;
            }
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.INFO.FILE_SELECTED(currentFileAbsPath)
            );

            if (
                !utils.validCodeFileName(currentFileAbsPath) &&
                shouldShowInvalidFileNamePopup
            ) {
                // to the popup
                vscode.window
                    .showInformationMessage(
                        CONSTANTS.INFO.INCORRECT_FILE_NAME_FOR_SIMULATOR_POPUP,
                        DialogResponses.DONT_SHOW,
                        DialogResponses.MESSAGE_UNDERSTOOD
                    )
                    .then((selection: vscode.MessageItem | undefined) => {
                        if (selection === DialogResponses.DONT_SHOW) {
                            shouldShowInvalidFileNamePopup = false;
                            telemetryAI.trackFeatureUsage(
                                TelemetryEventName.CPX_CLICK_DIALOG_DONT_SHOW
                            );
                        }
                    });
            }

            // Activate the run webview button
            currentPanel.webview.postMessage({
                command: "activate-play",
                active_device: currentActiveDevice,
            });

            childProcess = cp.spawn(pythonExecutableName, [
                utils.getPathToScript(
                    context,
                    CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
                    "process_user_code.py"
                ),
                currentFileAbsPath,
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
                                            currentActiveDevice
                                        ) {
                                            currentPanel.webview.postMessage({
                                                active_device: currentActiveDevice,
                                                command: "set-state",
                                                state: messageData,
                                            });
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
                    console.log("Sending clearing state command");
                    currentPanel.webview.postMessage({
                        active_device: currentActiveDevice,
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

    const cpxDeployCodeToDevice = async () => {
        console.info("Sending code to device");

        utils.logToOutputChannel(
            outChannel,
            CONSTANTS.INFO.DEPLOY_DEVICE,
            true
        );

        await updateCurrentFileIfPython(
            vscode.window.activeTextEditor!.document,
            currentPanel
        );

        if (currentFileAbsPath === "") {
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.ERROR.NO_FILE_TO_RUN,
                true
            );
            vscode.window.showErrorMessage(
                CONSTANTS.ERROR.NO_FILE_TO_RUN,
                DialogResponses.MESSAGE_UNDERSTOOD
            );
        } else if (!utils.validCodeFileName(currentFileAbsPath)) {
            // Save on run
            await currentTextDocument.save();
            // Output panel
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.ERROR.INCORRECT_FILE_NAME_FOR_DEVICE,
                true
            );
            // Popup
            vscode.window.showErrorMessage(
                CONSTANTS.ERROR.INCORRECT_FILE_NAME_FOR_DEVICE_POPUP
            );
        } else {
            utils.logToOutputChannel(
                outChannel,
                CONSTANTS.INFO.FILE_SELECTED(currentFileAbsPath)
            );

            const deviceProcess = cp.spawn(pythonExecutableName, [
                utils.getPathToScript(
                    context,
                    CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
                    "device.py"
                ),
                currentFileAbsPath,
            ]);

            let dataFromTheProcess = "";

            // Data received from Python process
            deviceProcess.stdout.on("data", data => {
                dataFromTheProcess = data.toString();
                console.log(`Device output = ${dataFromTheProcess}`);
                let messageToWebview;
                try {
                    messageToWebview = JSON.parse(dataFromTheProcess);
                    // Check the JSON is a state
                    switch (messageToWebview.type) {
                        case "complete":
                            telemetryAI.trackFeatureUsage(
                                TelemetryEventName.CPX_SUCCESS_COMMAND_DEPLOY_DEVICE
                            );
                            utils.logToOutputChannel(
                                outChannel,
                                CONSTANTS.INFO.DEPLOY_SUCCESS
                            );
                            break;

                        case "no-device":
                            telemetryAI.trackFeatureUsage(
                                TelemetryEventName.CPX_ERROR_DEPLOY_WITHOUT_DEVICE
                            );
                            vscode.window
                                .showErrorMessage(
                                    CONSTANTS.ERROR.NO_DEVICE,
                                    DialogResponses.HELP
                                )
                                .then(
                                    (
                                        selection:
                                            | vscode.MessageItem
                                            | undefined
                                    ) => {
                                        if (
                                            selection === DialogResponses.HELP
                                        ) {
                                            const okAction = () => {
                                                open(CONSTANTS.LINKS.HELP);
                                                telemetryAI.trackFeatureUsage(
                                                    TelemetryEventName.CPX_CLICK_DIALOG_HELP_DEPLOY_TO_DEVICE
                                                );
                                            };
                                            utils.showPrivacyModal(okAction);
                                        }
                                    }
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
                        `Non-JSON output from the process :  ${dataFromTheProcess}`
                    );
                }
            });

            // Std error output
            deviceProcess.stderr.on("data", data => {
                telemetryAI.trackFeatureUsage(
                    TelemetryEventName.CPX_ERROR_PYTHON_DEVICE_PROCESS,
                    { error: `${data}` }
                );
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

    let serialMonitor: SerialMonitor | undefined;
    if (configFileCreated) {
        serialMonitor = SerialMonitor.getInstance();
        context.subscriptions.push(serialMonitor);
    }

    const cpxSelectSerialPort: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.selectSerialPort",
        () => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(() => {
                    serialMonitor.selectSerialPort(null, null);
                }, TelemetryEventName.CPX_COMMAND_SERIAL_MONITOR_CHOOSE_PORT);
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const cpxOpenSerialMonitor: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.openSerialMonitor",
        () => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(
                    serialMonitor.openSerialMonitor.bind(serialMonitor),
                    TelemetryEventName.CPX_COMMAND_SERIAL_MONITOR_OPEN
                );
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const cpxChangeBaudRate: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.changeBaudRate",
        () => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(
                    serialMonitor.changeBaudRate.bind(serialMonitor),
                    TelemetryEventName.CPX_COMMAND_SERIAL_MONITOR_BAUD_RATE
                );
            } else {
                vscode.window.showErrorMessage(
                    CONSTANTS.ERROR.NO_FOLDER_OPENED
                );
                console.info("Serial monitor is not defined.");
            }
        }
    );

    const cpxCloseSerialMonitor: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.cpx.closeSerialMonitor",
        (port, showWarning = true) => {
            if (serialMonitor) {
                telemetryAI.runWithLatencyMeasure(() => {
                    serialMonitor.closeSerialMonitor(port, showWarning);
                }, TelemetryEventName.CPX_COMMAND_SERIAL_MONITOR_CLOSE);
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

    // On Debug Session Start: Init comunication
    const debugSessionsStarted = vscode.debug.onDidStartDebugSession(() => {
        if (simulatorDebugConfiguration.deviceSimulatorExpressDebug) {
            // Reinitialize process
            killProcessIfRunning();
            console.log("Debug Started");
            inDebugMode = true;

            try {
                // Shut down existing server on debug restart
                if (debuggerCommunicationHandler) {
                    debuggerCommunicationHandler.closeConnection();
                    debuggerCommunicationHandler = undefined;
                }

                debuggerCommunicationHandler = new DebuggerCommunicationServer(
                    currentPanel,
                    utils.getServerPortConfig()
                );

                telemetryAI.trackFeatureUsage(
                    TelemetryEventName.DEBUGGER_INIT_SUCCESS
                );

                openWebview();
                if (currentPanel) {
                    debuggerCommunicationHandler.setWebview(currentPanel);
                    currentPanel.webview.postMessage({
                        currentActiveDevice,
                        command: "activate-play",
                    });
                }
            } catch (err) {
                if (err.message === SERVER_INFO.ERROR_CODE_INIT_SERVER) {
                    console.error(
                        `Error trying to init the server on port ${utils.getServerPortConfig()}`
                    );

                    telemetryAI.trackFeatureUsage(
                        TelemetryEventName.DEBUGGER_INIT_FAIL
                    );

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
            console.log("Debug Stopped");
            inDebugMode = false;
            simulatorDebugConfiguration.deviceSimulatorExpressDebug = false;
            if (debuggerCommunicationHandler) {
                debuggerCommunicationHandler.closeConnection();
                debuggerCommunicationHandler = undefined;
            }
            if (currentPanel) {
                currentPanel.webview.postMessage({
                    command: "reset-state",
                    active_device: currentActiveDevice,
                });
            }
        }
    });

    context.subscriptions.push(
        installDependencies,
        runSimulator,
        cpxChangeBaudRate,
        cpxCloseSerialMonitor,
        cpxDeployToDevice,
        cpxNewFile,
        cpxOpenSerialMonitor,
        cpxOpenSimulator,
        cpxSelectSerialPort,
        microbitOpenSimulator,
        microbitNewFile,
        vscode.debug.registerDebugConfigurationProvider(
            CONSTANTS.DEBUG_CONFIGURATION_TYPE,
            simulatorDebugConfiguration
        ),
        debugSessionsStarted,
        debugSessionStopped
    );
}

const getActivePythonFile = () => {
    const editors: vscode.TextEditor[] = vscode.window.visibleTextEditors;
    const activeEditor = editors.find(
        editor => editor.document.languageId === "python"
    );
    if (activeEditor) {
        currentTextDocument = activeEditor.document;
    }
    return activeEditor ? activeEditor.document.fileName : "";
};

const updateCurrentFileIfPython = async (
    activeTextDocument: vscode.TextDocument | undefined,
    currentPanel: vscode.WebviewPanel
) => {
    if (activeTextDocument && activeTextDocument.languageId === "python") {
        setPathAndSendMessage(currentPanel, activeTextDocument.fileName);
        currentTextDocument = activeTextDocument;
    } else if (currentFileAbsPath === "") {
        setPathAndSendMessage(currentPanel, getActivePythonFile() || "");
    }
    if (
        currentTextDocument &&
        utils.getActiveEditorFromPath(currentTextDocument.fileName) ===
            undefined
    ) {
        await vscode.window.showTextDocument(
            currentTextDocument,
            vscode.ViewColumn.One
        );
    }
};

const handleButtonPressTelemetry = (buttonState: any) => {
    switch (currentActiveDevice) {
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
    switch (currentActiveDevice) {
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
    switch (currentActiveDevice) {
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
    switch (currentActiveDevice) {
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
    const outPath: string = createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY
    );
    const pyLibsPath: string = createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        CONSTANTS.FILESYSTEM.PYTHON_LIBS_DIR
    );

    // update pylint args to extend system path
    // to include python libs local to extention
    updateConfigLists(
        "python.linting.pylintArgs",
        [
            "--init-hook",
            `import sys; sys.path.extend([\"${outPath}\",\"${pyLibsPath}\"])`,
        ],
        vscode.ConfigurationTarget.Workspace
    );
};

const createEscapedPath = (...pieces: string[]) => {
    const initialPath: string = path.join(...pieces);

    // escape all instances of backslashes
    return initialPath.replace(/\\/g, "\\\\");
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
            ${loadScript(context, "out/vendor.js")}
            ${loadScript(context, "out/simulator.js")}
          </body>
          </html>`;
}
function switchDevice(deviceName: string) {
    currentActiveDevice = deviceName;
}

// this method is called when your extension is deactivated
export async function deactivate() {
    const monitor: SerialMonitor = SerialMonitor.getInstance();
    await monitor.closeSerialMonitor(null, false);
    UsbDetector.getInstance().stopListening();
}
