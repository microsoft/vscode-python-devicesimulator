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

  console.log("Congratulations, your extension Adafruit_Simulator is now active!");

  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let childProcess: cp.ChildProcess;

  // Open Simulator on the webview
  let openSimulator = vscode.commands.registerCommand("adafruit.openSimulator", () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
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
  let runSimulator = vscode.commands.registerCommand("adafruit.runSimulator", () => {
      if (!currentPanel) {
        return;
      }

      const activeTextEditor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
      let currentFileAbsPath : string = "";

      if (activeTextEditor) {
        currentFileAbsPath = activeTextEditor.document.fileName;
      }

      // Get the Python script path (And the special URI to use with the webview)
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, "out", "setup.py")
      );
      const scriptPath = onDiskPath.with({ scheme: "vscode-resource" });

      // Create the Python process (after killing the one running if any)
      if (childProcess != undefined) {
        // TODO: We need to check the process was correctly killed
        childProcess.kill();
      }
      childProcess = cp.spawn("python", [scriptPath.fsPath, currentFileAbsPath]);

      let dataForTheProcess = "hello";
      let dataFromTheProcess = "";
      let oldState = "";

      // Data received from Python process
      childProcess.stdout.on("data", function(data) {
        dataFromTheProcess = data.toString();
        if (currentPanel) {
          // Process the data from the process and send one state at a time
          dataFromTheProcess.split("\0").forEach(message => {
            if (currentPanel && message.length > 0 && message != oldState) {
              console.log("Process output = ", message);
              currentPanel.webview.postMessage(JSON.parse(message));
              oldState = message;
            }
          });
        }
      });
      // Std error output
      childProcess.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
      });
      // When the process is done
      childProcess.on("close", (code: number) => {
        console.log(`Command execution exited with code: ${code}`);
      });

      // Send input to the Python process
      childProcess.stdin.write(JSON.stringify(dataForTheProcess));
      childProcess.stdin.end();

      // Handle messages from webview
      currentPanel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case "light-press":
              vscode.window.showInformationMessage(message.text);
              return;
            default:
              vscode.window.showInformationMessage("We out here");
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
