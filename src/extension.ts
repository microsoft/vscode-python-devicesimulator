import * as vscode from "vscode";
import * as path from "path";
import * as cp from "child_process";

function loadScript(context: vscode.ExtensionContext, path: string) {
  return `<script src="${vscode.Uri.file(context.asAbsolutePath(path))
    .with({ scheme: "vscode-resource" })
    .toString()}"></script>`;
}

// Extension activation
export function activate(context: vscode.ExtensionContext) {
  console.info(
    "Congratulations, your extension Adafruit_Simulator is now active!"
  );

  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let outChannel: vscode.OutputChannel | undefined = undefined;
  let childProcess: cp.ChildProcess;
  let messageListener: vscode.Disposable;

  // Add our library path to settings.json for autocomplete functionality
  updatePythonExtraPaths();

  // Open Simulator on the webview
  let openSimulator = vscode.commands.registerCommand(
    "adafruit.openSimulator",
    () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.Two);
      } else {
        currentPanel = vscode.window.createWebviewPanel(
          "adafruitSimulator",
          "Adafruit CPX",
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
    }
  );

  // Send message to the webview
  let runSimulator = vscode.commands.registerCommand(
    "adafruit.runSimulator",
    () => {
      if (!currentPanel) {
        return;
      }

      console.info("Running user code");
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

      // Opening the output panel
      if (outChannel === undefined) {
        outChannel = vscode.window.createOutputChannel("Adafruit Simulator");
        logToOutputChannel(
          outChannel,
          "Welcome to the Adafruit Simulator output tab !\n\n",
          true
        );
      }

      logToOutputChannel(
        outChannel,
        "\n[INFO] Deploying code to the simulator...\n"
      );

      childProcess = cp.spawn("python", [
        scriptPath.fsPath,
        currentFileAbsPath
      ]);

      let dataFromTheProcess = "";
      let oldMessage = "";

      // Data received from Python process
      childProcess.stdout.on("data", function(data) {
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
                logToOutputChannel(outChannel, `[PRINT] ${message}\n`);
              }
            }
          });
        }
      });

      // Std error output
      childProcess.stderr.on("data", data => {
        console.error(`Error from the Python process through stderr: ${data}`);
        logToOutputChannel(outChannel, `[ERROR] ${data} \n`, true);
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
              console.log("About to write");
              console.log(JSON.stringify(message.text) + "\n");
              childProcess.stdin.write(JSON.stringify(message.text) + "\n");
              break;
            default:
              vscode.window.showInformationMessage(
                "Webview sent an unexpected message"
              );
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(openSimulator, runSimulator);
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

            <title>Adafruit Simulator</title>
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
export function deactivate() {}
