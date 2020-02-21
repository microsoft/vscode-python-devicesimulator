import { Webview } from "vscode";
export class MessagingService {
    private currentWebviewTarget: Webview | undefined;

    public setWebview(webview: Webview) {
        this.currentWebviewTarget = webview;
    }
    public sendMessageToWebview(debugCommand: string, state: Object) {
        if (this.currentWebviewTarget) {
            console.log(`Sending message ${debugCommand}`);
            this.currentWebviewTarget.postMessage({ command: debugCommand });
        } else {
            console.log(`The webview is not initialized`);
        }
    }
}
