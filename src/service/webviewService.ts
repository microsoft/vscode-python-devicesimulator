import * as path from "path";
import * as vscode from "vscode";
import CONSTANTS from "../constants";
import { GETTING_STARTED_HTML } from "../pages/gettingStarted";
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
    public getWebviewContent(webviewType: string, hasDevice: boolean) {
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
                    hasDevice
                )}
                ${this.loadScript(
                    this.context,
                    webviewType,
                    "out/simulator.js",
                    hasDevice
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
            }
        );
        this.tutorialPanel.webview.html = this.getWebviewContent(
            WEBVIEW_TYPES.GETTING_STARTED,
            false
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
        hasDevice: boolean
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
        return `<script ${attributeString} src="${vscode.Uri.file(
            context.asAbsolutePath(scriptPath)
        )
            .with({ scheme: "vscode-resource" })
            .toString()}"></script>`;
    }
}
