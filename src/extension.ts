// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as cp from "child_process";
import * as fs from "fs";
import * as open from "open";
import * as path from "path";
import * as utils from "./extension_utils/utils";
import * as vscode from "vscode";
import {
  CONSTANTS,
  CPX_CONFIG_FILE,
  DialogResponses,
  TelemetryEventName,
  WebviewMessages
} from "./constants";
import { CPXWorkspace } from "./cpxWorkspace";
import { SimulatorDebugConfigurationProvider } from "./simulatorDebugConfigurationProvider";
import { SerialMonitor } from "./serialMonitor";
import TelemetryAI from "./telemetry/telemetryAI";
import { UsbDetector } from "./usbDetector";
import { DebuggerCommunicationServer } from "./debuggerCommunicationServer";

let currentFileAbsPath: string = "";
let currentTextDocument: vscode.TextDocument;
let telemetryAI: TelemetryAI;
let pythonExecutableName: string = "python";
let inDebugMode: boolean = false;
let debuggerCommunicationHandler: DebuggerCommunicationServer;
// Notification booleans
let firstTimeClosed: boolean = true;
let shouldShowNewFile: boolean = true;
let shouldShowInvalidFileNamePopup: boolean = true;
let shouldShowRunCodePopup: boolean = true;
export let outChannel: vscode.OutputChannel | undefined;

function loadScript(context: vscode.ExtensionContext, scriptPath: string) {
  return `<script src="${vscode.Uri.file(context.asAbsolutePath(scriptPath))
    .with({ scheme: "vscode-resource" })
    .toString()}"></script>`;
}

// Extension activation
export async function activate(context: vscode.ExtensionContext) {
  console.info(CONSTANTS.INFO.EXTENSION_ACTIVATED);

  telemetryAI = new TelemetryAI(context);
  let currentPanel: vscode.WebviewPanel | undefined;
  let childProcess: cp.ChildProcess | undefined;
  let messageListener: vscode.Disposable;

  // Add our library path to settings.json for autocomplete functionality
  updatePythonExtraPaths();

  // Generate cpx.json
  utils.generateCPXConfig();
  pythonExecutableName = await utils.setPythonExectuableName();

  if (pythonExecutableName === "") {
    return;
  }

  if (outChannel === undefined) {
    outChannel = vscode.window.createOutputChannel(CONSTANTS.NAME);
    utils.logToOutputChannel(outChannel, CONSTANTS.INFO.WELCOME_OUTPUT_TAB, true);
  }

  vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
    await updateCurrentFileIfPython(document);
  });

  const openWebview = () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Two);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        "adafruitSimulator",
        CONSTANTS.LABEL.WEBVIEW_PANEL,
        { preserveFocus: true, viewColumn: vscode.ViewColumn.Two },
        {
          // Only allow the webview to access resources in our extension's media directory
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "out"))
          ],
          enableScripts: true
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

      if (currentPanel) {
        // Handle messages from webview
        messageListener = currentPanel.webview.onDidReceiveMessage(
          message => {
            const messageJson = JSON.stringify(message.text);
            switch (message.command) {
              case WebviewMessages.BUTTON_PRESS:
                // Send input to the Python process
                handleButtonPressTelemetry(message.text);
                console.log(`About to write ${messageJson} \n`);
                if (inDebugMode) {
                  debuggerCommunicationHandler.emitButtonPress(messageJson);
                } else if (childProcess) {
                  childProcess.stdin.write(messageJson + "\n");
                }
                break;
              case WebviewMessages.PLAY_SIMULATOR:
                console.log(`Play button ${messageJson} \n`);
                if (message.text as boolean) {
                  telemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_RUN_SIMULATOR_BUTTON);
                  runSimulatorCommand();
                } else {
                  killProcessIfRunning();
                }
                break;
              case WebviewMessages.SENSOR_CHANGED:
                console.log(`Sensor changed ${messageJson} \n`);
                if (inDebugMode) {
                  debuggerCommunicationHandler.emitSensorChanged(messageJson);
                } else if (childProcess) {
                  childProcess.stdin.write(messageJson + "\n");
                }
                break;
              case WebviewMessages.REFRESH_SIMULATOR:
                console.log("Refresh button");
                runSimulatorCommand();
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
      }

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
          debuggerCommunicationHandler.setWebview(undefined);
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
  };

  // Open Simulator on the webview
  const openSimulator: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.openSimulator",
    () => {
      telemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_OPEN_SIMULATOR);
      telemetryAI.runWithLatencyMeasure(
        openWebview,
        TelemetryEventName.PERFORMANCE_OPEN_SIMULATOR
      );
    }
  );

  const openTemplateFile = () => {
    const fileName = "template.py";
    const filePath = __dirname + path.sep + fileName;
    const file = fs.readFileSync(filePath, "utf8");

    if (shouldShowNewFile) {
      vscode.window
        .showInformationMessage(
          CONSTANTS.INFO.NEW_FILE,
          DialogResponses.DONT_SHOW,
          DialogResponses.EXAMPLE_CODE,
          DialogResponses.TUTORIALS
        )
        .then((selection: vscode.MessageItem | undefined) => {
          if (selection === DialogResponses.DONT_SHOW) {
            shouldShowNewFile = false;
            telemetryAI.trackFeatureUsage(
              TelemetryEventName.CLICK_DIALOG_DONT_SHOW
            );
          } else if (selection === DialogResponses.EXAMPLE_CODE) {
            open(CONSTANTS.LINKS.EXAMPLE_CODE);
            telemetryAI.trackFeatureUsage(
              TelemetryEventName.CLICK_DIALOG_EXAMPLE_CODE
            );
          } else if (selection === DialogResponses.TUTORIALS) {
            const okAction = () => {
              open(CONSTANTS.LINKS.TUTORIALS);
              telemetryAI.trackFeatureUsage(
                TelemetryEventName.CLICK_DIALOG_TUTORIALS
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
        telemetryAI.trackFeatureUsage(
          TelemetryEventName.ERROR_COMMAND_NEW_FILE
        );
        console.error(`Failed to open a new text document:  ${error}`);
      };
  };

  const newFile: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.newFile",
    () => {
      telemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_NEW_FILE);
      telemetryAI.runWithLatencyMeasure(
        openTemplateFile,
        TelemetryEventName.PERFORMANCE_NEW_FILE
      );
    }
  );

  const killProcessIfRunning = () => {
    if (childProcess !== undefined) {
      if (currentPanel) {
        console.info("Sending clearing state command");
        currentPanel.webview.postMessage({ command: "reset-state" });
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

    utils.logToOutputChannel(outChannel, CONSTANTS.INFO.DEPLOY_SIMULATOR);

    killProcessIfRunning();

    await updateCurrentFileIfPython(vscode.window.activeTextEditor!.document);

    if (currentFileAbsPath === "") {
      utils.logToOutputChannel(outChannel, CONSTANTS.ERROR.NO_FILE_TO_RUN, true);
    } else {
      // Save on run
      await currentTextDocument.save();

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
                TelemetryEventName.CLICK_DIALOG_DONT_SHOW
              );
            }
          });
      }

      // Activate the run webview button
      currentPanel.webview.postMessage({ command: "activate-play" });

      childProcess = cp.spawn(pythonExecutableName, [
        utils.getPathToScript(context, "out", "process_user_code.py"),
        currentFileAbsPath
      ]);

      let dataFromTheProcess = "";
      let oldMessage = "";

      // Data received from Python process
      childProcess.stdout.on("data", data => {
        dataFromTheProcess = data.toString();
        if (currentPanel) {
          // Process the data from the process and send one state at a time
          dataFromTheProcess.split("\0").forEach(message => {
            if (currentPanel && message.length > 0 && message !== oldMessage) {
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
                    currentPanel.webview.postMessage({
                      command: "set-state",
                      state: JSON.parse(messageToWebview.data)
                    });
                    break;

                  case "print":
                    console.log(
                      `Process print statement output = ${
                      messageToWebview.data
                      }`
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
                console.log(`Non-JSON output from the process :  ${message}`);
              }
            }
          });
        }
      });

      // Std error output
      childProcess.stderr.on("data", data => {
        console.error(`Error from the Python process through stderr: ${data}`);
        telemetryAI.trackFeatureUsage(TelemetryEventName.ERROR_PYTHON_PROCESS);
        utils.logToOutputChannel(outChannel, CONSTANTS.ERROR.STDERR(data), true);
        if (currentPanel) {
          console.log("Sending clearing state command");
          currentPanel.webview.postMessage({ command: "reset-state" });
        }
      });

      // When the process is done
      childProcess.on("end", (code: number) => {
        console.info(`Command execution exited with code: ${code}`);
      });
    }
  };

  const runSimulatorEditorButton: vscode.Disposable = vscode.commands.registerCommand("pacifica.runSimulatorEditorButton",
    () => {
      telemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_RUN_EDITOR_ICON);
      runSimulatorCommand();
    });

  // Send message to the webview
  const runSimulator: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.runSimulator",
    () => {
      telemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_RUN_PALETTE);
      runSimulatorCommand();
    }
  );

  const deployCodeToDevice = async () => {
    console.info("Sending code to device");

    utils.logToOutputChannel(outChannel, CONSTANTS.INFO.DEPLOY_DEVICE);

    await updateCurrentFileIfPython(vscode.window.activeTextEditor!.document);

    if (currentFileAbsPath === "") {
      utils.logToOutputChannel(outChannel, CONSTANTS.ERROR.NO_FILE_TO_RUN, true);
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
        utils.getPathToScript(context, "out", "device.py"),
        currentFileAbsPath
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
                TelemetryEventName.SUCCESS_COMMAND_DEPLOY_DEVICE
              );
              utils.logToOutputChannel(outChannel, CONSTANTS.INFO.DEPLOY_SUCCESS);
              break;

            case "no-device":
              telemetryAI.trackFeatureUsage(
                TelemetryEventName.ERROR_DEPLOY_WITHOUT_DEVICE
              );
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
                        TelemetryEventName.CLICK_DIALOG_HELP_DEPLOY_TO_DEVICE
                      );
                    };
                    utils.showPrivacyModal(okAction);
                  }
                });
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
          TelemetryEventName.ERROR_PYTHON_DEVICE_PROCESS,
          { error: `${data}` }
        );
        console.error(
          `Error from the Python device process through stderr: ${data}`
        );
        utils.logToOutputChannel(outChannel, `[ERROR] ${data} \n`, true);
      });

      // When the process is done
      deviceProcess.on("end", (code: number) => {
        console.info(`Command execution exited with code: ${code}`);
      });
    }
  };

  const runDevice: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.runDevice",
    () => {
      telemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_DEPLOY_DEVICE);
      telemetryAI.runWithLatencyMeasure(
        deployCodeToDevice,
        TelemetryEventName.PERFORMANCE_DEPLOY_DEVICE
      );
    }
  );

  const serialMonitor: SerialMonitor = SerialMonitor.getInstance();
  context.subscriptions.push(serialMonitor);
  const selectSerialPort: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.selectSerialPort",
    () => {
      // todo add telemetry after
      serialMonitor.selectSerialPort(null, null);
    }
  );

  const openSerialMonitor: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.openSerialMonitor",
    () => {
      serialMonitor.openSerialMonitor();
    }
  );

  const changeBaudRate: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.changeBaudRate",
    () => {
      serialMonitor.changeBaudRate();
    }
  );

  const closeSerialMonitor: vscode.Disposable = vscode.commands.registerCommand(
    "pacifica.closeSerialMonitor",
    (port, showWarning = true) => {
      serialMonitor.closeSerialMonitor(port, showWarning);
    }
  );

  UsbDetector.getInstance().initialize(context.extensionPath);
  UsbDetector.getInstance().startListening();

  if (CPXWorkspace.rootPath && 
    (utils.fileExistsSync(path.join(CPXWorkspace.rootPath, CPX_CONFIG_FILE)) || vscode.window.activeTextEditor)) {
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
    // Set up the webview
    killProcessIfRunning();
    openWebview();
    if (currentPanel) {
      currentPanel.webview.postMessage({ command: "activate-play" });
    }
    console.log("Debug Started");
    inDebugMode = true;
    debuggerCommunicationHandler = new DebuggerCommunicationServer(
      currentPanel
    );
  });

  // On Debug Session Stop: Stop communiation
  const debugSessionStopped = vscode.debug.onDidTerminateDebugSession(() => {
    console.log("Debug Stopped");
    inDebugMode = false;
    if (debuggerCommunicationHandler) {
      debuggerCommunicationHandler.closeConnection();
    }
    if (currentPanel) {
      currentPanel.webview.postMessage({ command: "reset-state" });
    }
  });

  context.subscriptions.push(
    changeBaudRate,
    closeSerialMonitor,
    openSerialMonitor,
    openSimulator,
    newFile,
    runSimulator,
    runSimulatorEditorButton,
    runDevice,
    selectSerialPort,
    vscode.debug.registerDebugConfigurationProvider(
      "python",
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
    currentTextDocument = activeEditor.document
  }
  return activeEditor ? activeEditor.document.fileName : "";
};

const getFileFromFilePicker = () => {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    filters: {
      "All files": ["*"],
      "Python files": ["py"]
    },
    openLabel: "Run File"
  };

  return vscode.window.showOpenDialog(options).then(fileUri => {
    if (fileUri && fileUri[0] && fileUri[0].fsPath.endsWith(".py")) {
      console.log(`Selected file: ${fileUri[0].fsPath}`);
      return fileUri[0].fsPath;
    }
  });
};

const updateCurrentFileIfPython = async (
  activeTextDocument: vscode.TextDocument | undefined
) => {
  if (activeTextDocument && activeTextDocument.languageId === "python") {
    currentFileAbsPath = activeTextDocument.fileName;
    currentTextDocument = activeTextDocument;
  } else if (currentFileAbsPath === "") {
    currentFileAbsPath =
      getActivePythonFile() || (await getFileFromFilePicker()) || "";
  }
  if (currentFileAbsPath) {
    await vscode.window.showTextDocument(currentTextDocument, vscode.ViewColumn.One);
  }
};

const handleButtonPressTelemetry = (buttonState: any) => {
  if (buttonState["button_a"] && buttonState["button_b"]) {
    telemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_BUTTON_AB);
  } else if (buttonState["button_a"]) {
    telemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_BUTTON_A);
  } else if (buttonState["button_b"]) {
    telemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_BUTTON_B);
  } else if (buttonState["switch"]) {
    telemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_SWITCH);
  }
};

const updatePythonExtraPaths = () => {
  const pathToLib: string = __dirname;
  const currentExtraPaths: string[] =
    vscode.workspace.getConfiguration().get("python.autoComplete.extraPaths") ||
    [];
  if (!currentExtraPaths.includes(pathToLib)) {
    currentExtraPaths.push(pathToLib);
  }
  vscode.workspace
    .getConfiguration()
    .update(
      "python.autoComplete.extraPaths",
      currentExtraPaths,
      vscode.ConfigurationTarget.Global
    );
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
            <script>
              const vscode = acquireVsCodeApi();
            </script>
            ${loadScript(context, "out/vendor.js")}
            ${loadScript(context, "out/simulator.js")}
          </body>
          </html>`;
}

export async function deactivate() {
  const monitor: SerialMonitor = SerialMonitor.getInstance();
  await monitor.closeSerialMonitor(null, false); 
  UsbDetector.getInstance().stopListening();
}
