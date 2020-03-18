import { Webview } from "vscode";

import * as fs from "fs";
import { VSCODE_MESSAGES_TO_WEBVIEW } from "../view/constants";
import { DeviceSelectionService } from "./deviceSelectionService";
export class MessagingService {
    private currentWebviewTarget: Webview | undefined;
    private deviceSelectionService: DeviceSelectionService;

    constructor(deviceSelectionService: DeviceSelectionService) {
        this.deviceSelectionService = deviceSelectionService;
    }
    public setWebview(webview: Webview) {
        this.currentWebviewTarget = webview;
    }

    // Send a message to webview if it exists
    public sendMessageToWebview(command: string, stateToSend: Object) {

        // fs.writeFile('C:\\Users\\t-anmah\\Documents\\python_ds_2\\src\\output2.txt', `process output: ${stateToSend}`, function (err) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log("File created!");
        // });

        if (this.currentWebviewTarget) {
            this.currentWebviewTarget.postMessage({
                command,
                active_device: this.deviceSelectionService.getCurrentActiveDevice(),
                state: { ...stateToSend },
            });
        }
    }
    public sendStartMessage() {
        this.currentWebviewTarget.postMessage({
            command: VSCODE_MESSAGES_TO_WEBVIEW.RUN_DEVICE,
        });
    }
    public sendPauseMessage() {
        this.currentWebviewTarget.postMessage({
            command: VSCODE_MESSAGES_TO_WEBVIEW.PAUSE_DEVICE,
        });
    }
}
