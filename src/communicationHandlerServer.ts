// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as socketio from "socket.io";
import { WebviewPanel, window } from "vscode";

const DEFAULT_SERVER_PORT: number = 5555;

export class CommunicationHandlerServer {
  // TODO: Port as a constants + user setting
  private serverIo: socketio.Server;
  private simulatorWebview: WebviewPanel | undefined;
  private port: number;

  constructor(
    webviewPanel: WebviewPanel | undefined,
    port = DEFAULT_SERVER_PORT
  ) {
    this.port = port;
    this.serverIo = socketio(this.port);
    this.simulatorWebview = webviewPanel;
    this.initEventsHandlers();
  }

  // TDOD: When to close the socket ?
  public closeConnection(): void {
    this.serverIo.close();
  }

  public setWebview(webviewPanel: WebviewPanel | undefined) {
    this.simulatorWebview = webviewPanel;
  }

  // TODO: Find a better way to send event to socket ?
  public emitButtonAPressed(newState: string): void {
    this.serverIo.emit("button_a_pressed", newState);
  }

  private initEventsHandlers(): void {
    this.serverIo.on("connection", (socket: any) => {
      console.log("Connection received");

      socket.on("updateState", (data: any) => {
        this.handleState(data);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        // TODO : send reset state ?
      });
    });
  }

  private handleState(data: any): void {
    try {
      // TODO: JSON or string ??
      // TODO: keep switch case (we know always case in that event) ??
      const messageToWebview = JSON.parse(data);
      switch (messageToWebview.type) {
        case "state":
          console.log(`State recieved: ${messageToWebview.data}`);
          if (this.simulatorWebview) {
            this.simulatorWebview.webview.postMessage({
              command: "set-state",
              state: JSON.parse(messageToWebview.data)
            });
          }
          break;

        default:
          console.log(
            `Non-state JSON output from the process : ${messageToWebview}`
          );
          break;
      }
    } catch (err) {
      console.log(`Non-JSON output from the process :  ${data}`);
      console.log(err);
    }
  }
}
