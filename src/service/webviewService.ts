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

    public getWebviewContent(
        webviewType: string,
        hasDevice: boolean,
        panel: vscode.WebviewPanel
    ) {
        const onDiskPath = vscode.Uri.file(
            this.context.asAbsolutePath(CONSTANTS.SCRIPT_PATH.SIMULATOR)
        );
        const scriptSrc = panel.webview.asWebviewUri(onDiskPath);

        const vscodeImportPath = vscode.Uri.file(
            this.context.asAbsolutePath(CONSTANTS.SCRIPT_PATH.VSCODE_API)
        );
        const vscodeImportPathSrc = panel.webview.asWebviewUri(
            vscodeImportPath
        );

        const attributeString = this.getAttributeString(webviewType, hasDevice);
        const nonce = getNonce();

        return `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta
                http-equiv="Content-Security-Policy"
                content=" script-src ${panel.webview.cspSource}  nonce-${nonce}"
              />
                <title>${CONSTANTS.NAME}</title>
                </head>
              <body>
                <div id="root"></div>
                <script nonce="${nonce}" src=${vscodeImportPathSrc} ></script>
                <script nonce="${nonce}" src=${scriptSrc} ${attributeString} ></script>

            </body>
            < /html>`;
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
    private getAttributeString(webviewType: string, hasDevice: boolean) {
        if (hasDevice) {
            return `${WEBVIEW_ATTRIBUTES_KEY.TYPE}=${webviewType} ${
                WEBVIEW_ATTRIBUTES_KEY.INITIAL_DEVICE
            }=${this.deviceSelectionService.getCurrentActiveDevice()} `;
        } else {
            return `${WEBVIEW_ATTRIBUTES_KEY.TYPE}=${webviewType} `;
        }
    }
}
// Nonce generator taken from vscode extension samples
function getNonce() {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
