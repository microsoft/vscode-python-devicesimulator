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
    DialogResponses,
    GLOBAL_ENV_VARS,
    HELPER_FILES,
    LANGUAGE_VARS,
    SERVER_INFO,
    TelemetryEventName,
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
import { SetupService } from "./service/setupService";
import { TelemetryHandlerService } from "./service/telemetryHandlerService";
import { WebviewService } from "./service/webviewService";
import { SimulatorDebugConfigurationProvider } from "./simulatorDebugConfigurationProvider";
import getPackageInfo from "./telemetry/getPackageInfo";
import TelemetryAI from "./telemetry/telemetryAI";
import { UsbDetector } from "./usbDetector";
import {
    VSCODE_MESSAGES_TO_WEBVIEW,
    WEBVIEW_MESSAGES,
    WEBVIEW_TYPES,
} from "./view/constants";

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

let pythonProcessDataBuffer: string[];

export let outChannel: vscode.OutputChannel | undefined;

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
    telemetryAI = new TelemetryAI(context);
    setupService = new SetupService(telemetryAI);
    let currentPanel: vscode.WebviewPanel | undefined;
    let childProcess: cp.ChildProcess | undefined;
    let messageListener: vscode.Disposable;
    let activeEditorListener: vscode.Disposable;
    const webviewService = new WebviewService(context, deviceSelectionService);
    const telemetryHandlerService = new TelemetryHandlerService(
        telemetryAI,
        deviceSelectionService
    );
    const formalNameToNickNameMapping = {
        [CONSTANTS.DEVICE_NAME_FORMAL.CPX]: CONSTANTS.DEVICE_NAME.CPX,
        [CONSTANTS.DEVICE_NAME_FORMAL.MICROBIT]: CONSTANTS.DEVICE_NAME.MICROBIT,
        [CONSTANTS.DEVICE_NAME_FORMAL.CLUE]: CONSTANTS.DEVICE_NAME.CLUE,
    };

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
            currentPanel.webview.html = webviewService.getWebviewContent(
                WEBVIEW_TYPES.SIMULATOR,
                true
            );
            currentPanel.reveal(vscode.ViewColumn.Beside);
        } else {
            currentPanel = vscode.window.createWebviewPanel(
                CONSTANTS.WEBVIEW_TYPE.SIMULATOR,
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

            currentPanel.webview.html = webviewService.getWebviewContent(
                WEBVIEW_TYPES.SIMULATOR,
                true
            );
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
                                telemetryHandlerService.handleButtonPressTelemetry(
                                    message.text
                                );
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
                            case WEBVIEW_MESSAGES.GESTURE:
                            case WEBVIEW_MESSAGES.SENSOR_CHANGED:
                                telemetryHandlerService.handleGestureTelemetry(
                                    message.text
                                );
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
                                telemetryHandlerService.handleSensorTelemetry(
                                    message.text
                                );
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

    // Open Simulator on the webview
    const openSimulator: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.openSimulator",
        async () => {
            const isPreviewMode = getIsPreviewMode();

            const chosen_device = await vscode.window.showQuickPick(
                Object.values(CONSTANTS.DEVICE_NAME_FORMAL).filter(
                    device =>
                        isPreviewMode ||
                        device !== CONSTANTS.DEVICE_NAME_FORMAL.CLUE
                )
            );

            if (!chosen_device) {
                utils.logToOutputChannel(
                    outChannel,
                    CONSTANTS.INFO.NO_DEVICE_CHOSEN_TO_SIMULATE_TO,
                    true
                );
                return;
            }

            const device = formalNameToNickNameMapping[chosen_device];
            deviceSelectionService.setCurrentActiveDevice(device);
            const telemetryEvents = telemetryHandlerService.getTelemetryEventsForOpenSimulator(
                device
            );
            telemetryAI.trackFeatureUsage(
                telemetryEvents.openSimulatorTelemetryEvent
            );
            telemetryAI.runWithLatencyMeasure(
                openWebview,
                telemetryEvents.openSimulatorPerformanceTelemetryEvent
            );
        }
    );

    const gettingStartedOpen: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.gettingStarted",
        () => {
            telemetryAI.trackFeatureUsage(
                TelemetryEventName.COMMAND_GETTING_STARTED
            );
            webviewService.openTutorialPanel();
        }
    );

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
                telemetryHandlerService.handleNewFileErrorTelemetry();
                console.error(`Failed to open a new text document:  ${error}`);
            };
    };

    const newFile: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.newFile",
        async () => {
            const isPreviewMode = getIsPreviewMode();

            const chosen_device = await vscode.window.showQuickPick(
                Object.values(CONSTANTS.DEVICE_NAME_FORMAL).filter(
                    device =>
                        isPreviewMode ||
                        device !== CONSTANTS.DEVICE_NAME_FORMAL.CLUE
                )
            );

            if (!chosen_device) {
                utils.logToOutputChannel(
                    outChannel,
                    CONSTANTS.INFO.NO_DEVICE_CHOSEN_FOR_NEW_FILE,
                    true
                );
                return;
            }

            const device = formalNameToNickNameMapping[chosen_device];
            deviceSelectionService.setCurrentActiveDevice(device);

            const deviceToTemplateMapping = {
                [CONSTANTS.DEVICE_NAME.CPX]: CONSTANTS.TEMPLATE.CPX,
                [CONSTANTS.DEVICE_NAME.MICROBIT]: CONSTANTS.TEMPLATE.MICROBIT,
                [CONSTANTS.DEVICE_NAME.CLUE]: CONSTANTS.TEMPLATE.CLUE,
            };
            const templateFile = deviceToTemplateMapping[device];

            const telemetryEvents = telemetryHandlerService.getTelemetryEventsForNewFile(
                device
            );

            telemetryAI.trackFeatureUsage(
                telemetryEvents.newFileTelemetryEvent
            );
            telemetryAI.runWithLatencyMeasure(
                () => openTemplateFile(templateFile),
                telemetryEvents.newFilePerformanceTelemetryEvent
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
        pythonProcessDataBuffer = [];
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
            const args = [
                utils.getPathToScript(
                    context,
                    CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
                    HELPER_FILES.PROCESS_USER_CODE_PY
                ),
                fileSelectionService.getCurrentFileAbsPath(),
                JSON.stringify({ enable_telemetry: utils.getTelemetryState() }),
            ];
            childProcess = cp.spawn(pythonExecutablePath, args);

            let dataFromTheProcess = "";
            let oldMessage = "";

            // Data received from Python process
            childProcess.stdout.on("data", data => {
                dataFromTheProcess = data.toString();
                if (currentPanel) {
                    // NOTE: parts of the flow regarding pythonProcessDataBuffer
                    // are needed for the CLUE simulator to properly receive
                    // base_64 strings on UNIX systems.

                    // added any incomplete data to beginning
                    const processedData = pythonProcessDataBuffer
                        .join("")
                        .concat(dataFromTheProcess);
                    pythonProcessDataBuffer = [];

                    // Process the data from the process and send one state at a time
                    processedData.split("\0").forEach(message => {
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
                                if (err instanceof SyntaxError) {
                                    // if not a JSON string, it is incomplete
                                    // add to beginning of next strings
                                    pythonProcessDataBuffer.push(message);
                                } else {
                                    console.log(
                                        `Errored output: ${messageToWebview}`
                                    );
                                }
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
                CONSTANTS.ERROR.NO_FILE_TO_DEPLOY,
                true
            );
            vscode.window.showErrorMessage(
                CONSTANTS.ERROR.NO_FILE_TO_DEPLOY,
                DialogResponses.MESSAGE_UNDERSTOOD
            );
        } else {
            await fileSelectionService.getCurrentTextDocument().save();

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
                    telemetryHandlerService.handleDeployToDeviceFinishedTelemetry(
                        messageToWebview,
                        device
                    );
                } catch (err) {
                    console.log(
                        `Non-JSON output from the process :  ${dataFromTheProcess}`
                    );
                }
            });

            // Std error output
            deviceProcess.stderr.on("data", data => {
                telemetryHandlerService.handleDeployToDeviceErrorTelemetry(
                    data,
                    device
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

    const deployToDevice: vscode.Disposable = vscode.commands.registerCommand(
        "deviceSimulatorExpress.common.deployToDevice",
        async () => {
            const isPreviewMode = getIsPreviewMode();

            const chosen_device = await vscode.window.showQuickPick(
                Object.values(CONSTANTS.DEVICE_NAME_FORMAL).filter(
                    device =>
                        isPreviewMode ||
                        device !== CONSTANTS.DEVICE_NAME_FORMAL.CLUE
                )
            );

            if (!chosen_device) {
                utils.logToOutputChannel(
                    outChannel,
                    CONSTANTS.INFO.NO_DEVICE_CHOSEN_TO_DEPLOY_TO,
                    true
                );
                return;
            }

            const device = formalNameToNickNameMapping[chosen_device];

            const telemetryEvents = telemetryHandlerService.getTelemetryEventsForStartingDeployToDevice(
                device
            );

            telemetryAI.trackFeatureUsage(telemetryEvents.deployTelemetryEvent);
            telemetryAI.runWithLatencyMeasure(() => {
                deployCode(device);
            }, telemetryEvents.deployPerformanceTelemetryEvent);
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

                telemetryHandlerService.handleDebuggerTelemetry();

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

                    telemetryHandlerService.handleDebuggerFailTelemetry();

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

    const getIsPreviewMode = (): boolean => {
        const isPreviewMode: boolean = vscode.workspace
            .getConfiguration()
            .get(CONFIG.ENABLE_PREVIEW_MODE);
        return isPreviewMode;
    };

    context.subscriptions.push(
        installDependencies,
        runSimulator,
        changeBaudRate,
        closeSerialMonitor,
        deployToDevice,
        newFile,
        openSimulator,
        openSerialMonitor,
        selectSerialPort,
        gettingStartedOpen,
        vscode.debug.registerDebugConfigurationProvider(
            CONSTANTS.DEBUG_CONFIGURATION_TYPE,
            simulatorDebugConfiguration
        ),
        debugSessionsStarted,
        debugSessionStopped,
        configsChanged
    );
}

const updatePythonExtraPaths = () => {
    updateConfigLists(
        "python.autoComplete.extraPaths",
        [
            __dirname,
            path.join(__dirname, CONSTANTS.FILESYSTEM.MICROPYTHON_DIRECTORY),
            path.join(__dirname, CONSTANTS.FILESYSTEM.CLUE),
            path.join(__dirname, CONSTANTS.FILESYSTEM.BASE_CIRCUITPYTHON),
        ],
        vscode.ConfigurationTarget.Global
    );
};

const updatePylintArgs = (context: vscode.ExtensionContext) => {
    const outPath: string = utils.createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY
    );
    const micropythonPath: string = utils.createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        CONSTANTS.FILESYSTEM.MICROPYTHON_DIRECTORY
    );

    const cluePath: string = utils.createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        CONSTANTS.FILESYSTEM.CLUE
    );

    const baseCircuitPythonPath: string = utils.createEscapedPath(
        context.extensionPath,
        CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY,
        CONSTANTS.FILESYSTEM.BASE_CIRCUITPYTHON
    );
    // update pylint args to extend system path
    // to include python libs local to extention
    updateConfigLists(
        "python.linting.pylintArgs",
        [
            "--init-hook",
            `import sys; sys.path.extend([\"${outPath}\",\"${micropythonPath}\",\"${cluePath}\",\"${baseCircuitPythonPath}\"])`,
        ],
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

// this method is called when your extension is deactivated
export async function deactivate() {
    const monitor: SerialMonitor = SerialMonitor.getInstance();
    await monitor.closeSerialMonitor(null, false);
    UsbDetector.getInstance().stopListening();
}
