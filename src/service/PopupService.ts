// import { Webview } from "vscode";
import * as vscode from "vscode";
import { LATEST_RELEASE_NOTE } from "../latest_release_note";

export class PopupService {
    public static OPEN_RELEASE_NOTE() {
        const panel = vscode.window.createWebviewPanel(
            "releaseNote",
            "Release Note",
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = LATEST_RELEASE_NOTE;
    }
}
