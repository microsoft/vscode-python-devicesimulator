import * as path from "path";
import * as vscode from "vscode";
import CONSTANTS from "../constants";
import { WEBVIEW_ATTRIBUTES_KEY, WEBVIEW_TYPES } from "../view/constants";
import { DeviceSelectionService } from "./deviceSelectionService";

// Manages different type of webview
export class WebviewService {
    private tutorialPanel: vscode.WebviewPanel | undefined;
    private context: vscode.ExtensionContext;
    private deviceSelectionService: DeviceSelectionService;

    constructor(
        context: vscode.ExtensionContext,
        deviceSelectionService: DeviceSelectionService
    ) {
        this.context = context;
        this.deviceSelectionService = deviceSelectionService;
    }

    public openTutorialPanel() {
        if (this.tutorialPanel) {
            this.tutorialPanel.reveal(vscode.ViewColumn.Beside);
        } else {
            this.createTutorialPanel();
        }
    }

    public getWebviewContent(webviewType: string, hasDevice: boolean, panel: vscode.WebviewPanel) {
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
                ${this.loadScript(
            this.context,
            webviewType,
            "out/vendor.js",
            hasDevice,
            panel
        )}
                ${this.loadScript(
            this.context,
            webviewType,
            "out/simulator.js",
            hasDevice,
            panel
        )}
              </body>
              </html>`;
    }

    private createTutorialPanel() {
        this.tutorialPanel = vscode.window.createWebviewPanel(
            CONSTANTS.WEBVIEW_TYPE.TUTORIAL,
            CONSTANTS.LABEL.WEBVIEW_PANEL,
            { preserveFocus: true, viewColumn: vscode.ViewColumn.One },
            {
                enableScripts: true,
                retainContextWhenHidden: true,
            }
        );
        this.tutorialPanel.webview.html = this.getWebviewContent(
            WEBVIEW_TYPES.GETTING_STARTED,
            false,
            this.tutorialPanel
        );
        this.tutorialPanel.onDidDispose(() => {
            this.disposeTutorialPanel();
        });
    }

    private disposeTutorialPanel() {
        this.tutorialPanel = undefined;
    }

    private loadScript(
        context: vscode.ExtensionContext,
        attributeValue: string,
        scriptPath: string,
        hasDevice: boolean,
        panel: vscode.WebviewPanel
    ) {
        let attributeString: string;
        if (hasDevice) {
            attributeString = `${
                WEBVIEW_ATTRIBUTES_KEY.TYPE
                }=${attributeValue} ${
                WEBVIEW_ATTRIBUTES_KEY.INITIAL_DEVICE
                }=${this.deviceSelectionService.getCurrentActiveDevice()}`;
        } else {
            attributeString = `${WEBVIEW_ATTRIBUTES_KEY.TYPE}=${attributeValue} `;
        }
        // Load appropriate vscode ressources to the webview 
        const onDiskPath = vscode.Uri.file(context.asAbsolutePath(scriptPath));
        const scriptSrc = panel.webview.asWebviewUri(onDiskPath);

        return `<script ${attributeString} src="${scriptSrc}"></script>`;
    }
}
