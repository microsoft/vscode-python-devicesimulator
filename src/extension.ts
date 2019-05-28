// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

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
  let disposable = vscode.commands.registerCommand(
    "extension.helloSimulator",
    () => {
      // The code you place here will be executed every time your command is executed
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
              vscode.Uri.file(path.join(context.extensionPath, "public")),
              vscode.Uri.file(path.join(context.extensionPath, "out"))
            ],
            enableScripts: true
          } // Webview options. More on these later.
        );
        // Get path to resource on disk
        const onDiskPath = vscode.Uri.file(
          path.join(context.extensionPath, "public", "apx.svg")
        );

        // And get the special URI to use with the webview
        const apxSrc = onDiskPath.with({ scheme: "vscode-resource" });

        currentPanel.webview.html = getWebviewContent(apxSrc, context);

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

  context.subscriptions.push(disposable);
}

function getWebviewContent(img: vscode.Uri, context: vscode.ExtensionContext) {
  return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>Adafruit Simulator</title>
				</head>
			<body>
				<div id="root"></div>
        <img src="${img}" width="300" />
        ${loadScript(context, "out/vendor.js")}
        ${loadScript(context, "out/aliens.js")}
			</body>
			</html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
