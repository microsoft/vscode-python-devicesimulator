// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as cp from "child_process";

function loadScript(context: vscode.ExtensionContext, path: string) {
  return `<script src="${vscode.Uri.file(context.asAbsolutePath(path))
    .with({ scheme: "vscode-resource" })
    .toString()}"></script>`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "embedded-python" is now active!'
  );

  // Only allow a webview
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let openSimulator = vscode.commands.registerCommand(
    "adafruit.helloSimulator",
    () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
      } else {
        currentPanel = vscode.window.createWebviewPanel(
          "adafruitSimulator", // Identifies the type of the webview. Used internally
          "Adafruit CPX", // Title of the panel displayed to the user
          vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
          {
            // Only allow the webview to access resources in our extension's media directory
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, "out"))
            ],
            enableScripts: true
          } // Webview options. More on these later.
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
  let runEmulator = vscode.commands.registerCommand(
    "adafruit.runSimulator",
    () => {
      if (!currentPanel) {
        return;
      }
      /************************ */

      // Get the Python script path (And the special URI to use with the webview)
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, "src/scripts", "control.py")
      );
      const scriptPath = onDiskPath.with({ scheme: "vscode-resource" });

      // Create the Python process
      let childProcess = cp.spawn("python", [scriptPath.fsPath]);

      let dataForTheProcess = "hello";
      let dataFromTheProcess = "";

      // Data received from Python process
      childProcess.stdout.on("data", function(data) {
        dataFromTheProcess += data.toString();
      });
      // End of the data transmission
      childProcess.stdout.on("end", function() {
        console.log("Process output = ", dataFromTheProcess);
        if (currentPanel) {
          currentPanel.webview.postMessage(JSON.parse(dataFromTheProcess));
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

      ///////
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
      /************************ */
    }
  );

  context.subscriptions.push(openSimulator, runEmulator);
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
