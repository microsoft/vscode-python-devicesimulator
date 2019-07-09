import * as vscode from "vscode";
import * as path from "path";
import * as cp from "child_process";
import * as fs from "fs";
import * as open from "open";
import TelemetryAI from "./telemetry/telemetryAI";
import { CONSTANTS, DialogResponses, TelemetryEventName } from "./constants";

let shouldShowNewProject: boolean = true;

function loadScript(context: vscode.ExtensionContext, path: string) {
  return `<script src="${vscode.Uri.file(context.asAbsolutePath(path))
    .with({ scheme: "vscode-resource" })
    .toString()}"></script>`;
}

// Extension activation
export function activate(context: vscode.ExtensionContext) {
  console.info(CONSTANTS.INFO.EXTENSION_ACTIVATED);

  const reporter: TelemetryAI = new TelemetryAI(context);
  let currentPanel: vscode.WebviewPanel | undefined;
  let outChannel: vscode.OutputChannel | undefined;
  let childProcess: cp.ChildProcess;
  let messageListener: vscode.Disposable;

  // Add our library path to settings.json for autocomplete functionality
  updatePythonExtraPaths();
  
  if (outChannel === undefined) {
    outChannel = vscode.window.createOutputChannel(CONSTANTS.NAME);
    logToOutputChannel(outChannel, CONSTANTS.INFO.WELCOME_OUTPUT_TAB, true);
  }

  const openWebview = () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Two);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        "adafruitSimulator",
        CONSTANTS.LABEL.WEBVIEW_PANEL,
        vscode.ViewColumn.Two,
        {
          // Only allow the webview to access resources in our extension's media directory
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "out"))
          ],
          enableScripts: true
        }
      );
      
      currentPanel.webview.html = getWebviewContent(context);

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        undefined,
        context.subscriptions
      );
    }
  };

  // Open Simulator on the webview
  const openSimulator = vscode.commands.registerCommand(
    "pacifica.openSimulator",
    () => {
      TelemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_OPEN_SIMULATOR, {});
      openWebview();
    }
  );

  const newProject = vscode.commands.registerCommand(
    "pacifica.newProject",
    () => {
      TelemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_NEW_PROJECT, {});

      const fileName = "template.py";
      const filePath = __dirname + path.sep + fileName;
      const file = fs.readFileSync(filePath, "utf8");


      if (shouldShowNewProject) {
        vscode.window
          .showInformationMessage(
            CONSTANTS.INFO.NEW_PROJECT,
            ...[
              DialogResponses.DONT_SHOW,
              DialogResponses.EXAMPLE_CODE,
              DialogResponses.TUTORIALS
            ]
          )
          .then((selection: vscode.MessageItem | undefined) => {
            if (selection === DialogResponses.DONT_SHOW) {
              shouldShowNewProject = false;
            } else if (selection === DialogResponses.EXAMPLE_CODE) {
              open(CONSTANTS.LINKS.EXAMPLE_CODE);
            } else if (selection === DialogResponses.TUTORIALS) {
              open(CONSTANTS.LINKS.TUTORIALS);
            }
          });
      }

      openWebview();


      vscode.workspace
        .openTextDocument({ content: file, language: "en" })
        .then((template: vscode.TextDocument) => {
          vscode.window.showTextDocument(template, 1, false);
        }),
        (error: any) => {
          console.error(`Failed to open a new text document:  ${error}`);
        };
    }
  );

  // Send message to the webview
  const runSimulator = vscode.commands.registerCommand(
    "pacifica.runSimulator",
    () => {
      openWebview();

      if (!currentPanel) {
        return;
      }

      TelemetryAI.trackFeatureUsage(TelemetryEventName.COMMAND_RUN_SIMULATOR, {});

      console.info(CONSTANTS.INFO.RUNNING_CODE);
      const activeTextEditor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor;
      let currentFileAbsPath: string = "";

      if (activeTextEditor) {
        currentFileAbsPath = activeTextEditor.document.fileName;
      }

      // Get the Python script path (And the special URI to use with the webview)
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, "out", "setup.py")
      );
      const scriptPath = onDiskPath.with({ scheme: "vscode-resource" });

      // Create the Python process (after killing the one running if any)
      if (childProcess !== undefined) {
        if (currentPanel) {
          console.info("Sending clearing state command");
          currentPanel.webview.postMessage({ command: "reset-state" });
        }
        // TODO: We need to check the process was correctly killed
        childProcess.kill();
      }

      logToOutputChannel(outChannel, CONSTANTS.INFO.DEPLOY_SIMULATOR);

      childProcess = cp.spawn("python", [
        scriptPath.fsPath,
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
            if (currentPanel && message.length > 0 && message != oldMessage) {
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
        logToOutputChannel(outChannel, CONSTANTS.ERROR.STDERR(data), true);
        if (currentPanel) {
          console.log("Sending clearing state command");
          currentPanel.webview.postMessage({ command: "reset-state" });
        }
      });

      // When the process is done
      childProcess.on("end", (code: number) => {
        console.info(`Command execution exited with code: ${code}`);
      });

      if (messageListener !== undefined) {
        messageListener.dispose();
        const index = context.subscriptions.indexOf(messageListener);
        if (index > -1) {
          context.subscriptions.splice(index, 1);
        }
      }
      // Handle messages from webview
      messageListener = currentPanel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case "button-press":
              // Send input to the Python process
              handleButtonPressTelemetry(message.text);
              console.log("About to write");
              console.log(JSON.stringify(message.text) + "\n");
              childProcess.stdin.write(JSON.stringify(message.text) + "\n");
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
  );

  // Send message to the webview
  const runDevice = vscode.commands.registerCommand("pacifica.runDevice", () => {
    console.info("Sending code to device");

    logToOutputChannel(outChannel, CONSTANTS.INFO.DEPLOY_DEVICE);

    const activeTextEditor: vscode.TextEditor | undefined =
      vscode.window.activeTextEditor;
    let currentFileAbsPath: string = "";

    if (activeTextEditor) {
      currentFileAbsPath = activeTextEditor.document.fileName;
    }

    // Get the Python script path (And the special URI to use with the webview)
    const onDiskPath = vscode.Uri.file(
      path.join(context.extensionPath, "out", "device.py")
    );
    const scriptPath = onDiskPath.with({ scheme: "vscode-resource" });

    const deviceProcess = cp.spawn("python", [
      scriptPath.fsPath,
      currentFileAbsPath
    ]);

    let dataFromTheProcess = "";

    // Data received from Python process
    deviceProcess.stdout.on("data", data => {
      dataFromTheProcess = data.toString();
      if (dataFromTheProcess === CONSTANTS.INFO.COMPLETED_MESSAGE) {
        logToOutputChannel(outChannel, CONSTANTS.INFO.DEPLOY_SUCCESS);
      }
      console.log(`Device output = ${dataFromTheProcess}`);
    });

    // Std error output
    deviceProcess.stderr.on("data", data => {
      console.error(
        `Error from the Python device process through stderr: ${data}`
      );
      logToOutputChannel(outChannel, `[ERROR] ${data} \n`, true);
    });

    // When the process is done
    deviceProcess.on("end", (code: number) => {
      console.info(`Command execution exited with code: ${code}`);
    });
  });

  context.subscriptions.push(
    openSimulator,
    runSimulator,
    runDevice,
    newProject
  );
}

const handleButtonPressTelemetry = (buttonState: any) => {
  if (buttonState["button_a"] && buttonState["button_b"]) {
    TelemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_BUTTON_AB);
  } else if (buttonState["button_a"]) {
    TelemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_BUTTON_A);
  } else if (buttonState["button_b"]) {
    TelemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_BUTTON_B);
  } else if (buttonState["switch"]) {
    TelemetryAI.trackFeatureUsage(TelemetryEventName.SIMULATOR_SWITCH);
  }
}

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

const logToOutputChannel = (
  outChannel: vscode.OutputChannel | undefined,
  message: string,
  show: boolean = false
) => {
  if (outChannel) {
    if (show) outChannel.show();
    outChannel.append(message);
  }
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

// this method is called when your extension is deactivated
export function deactivate() { }