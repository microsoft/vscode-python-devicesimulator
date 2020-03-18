import * as path from "path";
import * as vscode from "vscode";
import CONSTANTS from "../constants";
import { GETTING_STARTED_HTML } from "../pages/gettingStarted";
import { WEBVIEW_ATTRIBUTES_KEY, WEBVIEW_TYPES } from "../view/constants";

// Manages different type of webview
export class WebviewService {
    static loadScript(
        context: vscode.ExtensionContext,
        attributeKey: WEBVIEW_ATTRIBUTES_KEY,
        attributeValue: string,
        scriptPath: string
    ) {
        return `<script ${attributeKey}=${attributeValue} src="${vscode.Uri.file(
            context.asAbsolutePath(scriptPath)
        )
            .with({ scheme: "vscode-resource" })
            .toString()}"></script>`;
    }
    private tutorialPanel: vscode.WebviewPanel | undefined;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public openTutorialPanel() {
        if (this.tutorialPanel) {
            this.tutorialPanel.reveal(vscode.ViewColumn.Beside);
        } else {
            this.createTutorialPanel();
        }
    }
    private createTutorialPanel() {
        this.tutorialPanel = vscode.window.createWebviewPanel(
            CONSTANTS.WEBVIEW_TYPE.TUTORIAL,
            CONSTANTS.LABEL.WEBVIEW_PANEL,
            { preserveFocus: true, viewColumn: vscode.ViewColumn.One },
            {
                enableScripts: true,
            }
        );
        this.tutorialPanel.webview.html = this.getWebviewContent(
            WEBVIEW_ATTRIBUTES_KEY.TYPE,
            WEBVIEW_TYPES.GETTING_STARTED
        );
        this.tutorialPanel.onDidDispose(() => {
            this.disposeTutorialPanel();
        });
    }
    private disposeTutorialPanel() {
        this.tutorialPanel = undefined;
    }
    private getWebviewContent(
        attributeKey: WEBVIEW_ATTRIBUTES_KEY,
        attributeValue: string
    ) {
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
                ${WebviewService.loadScript(
                    this.context,
                    attributeKey,
                    attributeValue,
                    "out/vendor.js"
                )}
                ${WebviewService.loadScript(
                    this.context,
                    attributeKey,
                    attributeValue,
                    "out/simulator.js"
                )}
              </body>
              </html>`;
    }
}
