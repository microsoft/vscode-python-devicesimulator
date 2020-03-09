import * as vscode from "vscode";
import CONSTANTS from "../constants";
import * as path from "path";
import { GETTING_STARTED_HTML } from "../pages/gettingStarted";

// Manages different type of webview
export class WebviewService {
    private tutorialPanel: vscode.WebviewPanel | undefined;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    openTutorialPanel() {
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
        this.tutorialPanel.webview.html = GETTING_STARTED_HTML;
        this.tutorialPanel.onDidDispose(() => {
            this.disposeTutorialPanel();
        });
    }
    private disposeTutorialPanel() {
        this.tutorialPanel = undefined;
    }
}
