// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as http from "http";
import * as socketio from "socket.io";
import { WebviewPanel } from "vscode";
import { SERVER_INFO } from "./constants";

export const DEBUGGER_MESSAGES = {
    EMITTER: {
        INPUT_CHANGED: "input_changed",
        RECEIVED_STATE: "received_state",
        DISCONNECT: "process_disconnect",
    },
    LISTENER: {
        UPDATE_STATE: "updateState",
        RECEIVED_STATE: "receivedState",
        DISCONNECT: "disconnect",
    },
};

export class DebuggerCommunicationServer {
    private port: number;
    private serverHttp: http.Server;
    private serverIo: socketio.Server;
    private simulatorWebview: WebviewPanel | undefined;
    private currentActiveDevice;
    private isWaitingResponse = false;
    private currentCall: Function[] = [];

    constructor(
        webviewPanel: WebviewPanel | undefined,
        port = SERVER_INFO.DEFAULT_SERVER_PORT,
        currentActiveDevice: string
    ) {
        this.port = port;
        this.serverHttp = new http.Server();
        this.initHttpServer();

        this.serverIo = socketio(this.serverHttp);
        this.simulatorWebview = webviewPanel;
        this.initEventsHandlers();
        console.info(`Server running on port ${this.port}`);

        this.currentActiveDevice = currentActiveDevice;
    }

    public closeConnection(): void {
        this.disconnectSocketIo();
        this.serverIo.close();
        this.serverHttp.close();
        console.info("Closing the server");
    }

    public setWebview(webviewPanel: WebviewPanel | undefined) {
        this.simulatorWebview = webviewPanel;
    }

    public emitInputChanged(newState: string): void {
        if (this.isWaitingResponse) {
            this.currentCall.push(() => {
                this.serverIo.emit(
                    DEBUGGER_MESSAGES.EMITTER.INPUT_CHANGED,
                    newState
                );
                this.isWaitingResponse = true;
            });
        } else {
            this.serverIo.emit(
                DEBUGGER_MESSAGES.EMITTER.INPUT_CHANGED,
                newState
            );
            this.isWaitingResponse = true;
        }
    }

    private initHttpServer(): void {
        this.serverHttp.listen(this.port);
        if (!this.serverHttp.listening) {
            throw new Error(SERVER_INFO.ERROR_CODE_INIT_SERVER);
        }
    }

    private initEventsHandlers(): void {
        this.serverIo.on("connection", (socket: any) => {
            socket.on(DEBUGGER_MESSAGES.LISTENER.UPDATE_STATE, (data: any) => {
                this.handleState(data);
                this.serverIo.emit(
                    DEBUGGER_MESSAGES.EMITTER.RECEIVED_STATE,
                    {}
                );
            });
            socket.on(DEBUGGER_MESSAGES.LISTENER.RECEIVED_STATE, () => {
                this.isWaitingResponse = false;
                if (this.currentCall.length > 0) {
                    const currentCall = this.currentCall.shift();
                    currentCall();
                }
            });

            socket.on(DEBUGGER_MESSAGES.LISTENER.DISCONNECT, () => {
                this.serverIo.emit(DEBUGGER_MESSAGES.EMITTER.DISCONNECT, {});
                if (this.simulatorWebview) {
                    this.simulatorWebview.webview.postMessage({
                        command: "reset-state",
                    });
                }
            });
        });
    }
    public disconnectSocketIo() {
        this.serverIo.emit(DEBUGGER_MESSAGES.EMITTER.DISCONNECT, {});
    }

    private handleState(data: any): void {
        try {
            const messageToWebview = JSON.parse(data);
            if (messageToWebview.type === "state") {
                console.log(`State recieved: ${messageToWebview.data}`);
                if (this.simulatorWebview) {
                    this.simulatorWebview.webview.postMessage({
                        active_device: this.currentActiveDevice,
                        command: "set-state",
                        state: JSON.parse(messageToWebview.data),
                    });
                }
            }
        } catch (err) {
            console.error(`Error: Non-JSON output from the process :  ${data}`);
        }
    }
}
