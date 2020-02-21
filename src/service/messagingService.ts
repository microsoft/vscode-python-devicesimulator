import { Webview } from "vscode";
import { VSCODE_MESSAGES_TO_WEBVIEW } from "../view/constants";
export class MessagingService {
    private currentWebviewTarget: Webview | undefined;

    public setWebview(webview: Webview) {
        this.currentWebviewTarget = webview;
    }

    // Send a message to webview if it exists
    public sendMessageToWebview(debugCommand: string, state: Object) {
        if (this.currentWebviewTarget) {
            this.currentWebviewTarget.postMessage({ command: debugCommand });
        }
    }
    public sendStartMessage() {
        this.currentWebviewTarget.postMessage({
            command: VSCODE_MESSAGES_TO_WEBVIEW.RUN_DEVICE,
        });
    }
    public sendStopMessage() {
        this.currentWebviewTarget.postMessage({
            command: VSCODE_MESSAGES_TO_WEBVIEW.PAUSE_DEVICE,
        });
    }
}
