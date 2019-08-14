// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as socketio from "socket.io";
import { WebviewPanel } from "vscode";
import { DEFAULT_SERVER_PORT } from "./constants";

export class DebuggerCommunicationServer {
  // TODO: Port as a constants + user setting
  private port: number;
  private serverIo: socketio.Server;
  private simulatorWebview: WebviewPanel | undefined;

  constructor(
    webviewPanel: WebviewPanel | undefined,
    port = DEFAULT_SERVER_PORT
  ) {
    this.port = port;
    this.serverIo = socketio(this.port);
    this.simulatorWebview = webviewPanel;
    this.initEventsHandlers();
  }

  public closeConnection(): void {
    this.serverIo.close();
  }

  public setWebview(webviewPanel: WebviewPanel | undefined) {
    this.simulatorWebview = webviewPanel;
  }

  // Emit Buttons Inputs Events
  public emitButtonPress(newState: string): void {
    console.log(`Emit Button Press: ${newState} \n`);
    this.serverIo.emit("button_press", newState);
  }

  // Emit Sensors Inputs Events
  public emitSensorChanged(newState: string): void {
    console.log(`Emit Sensor Changed: ${newState} \n`);
    this.serverIo.emit("sensor_changed", newState);
  }

  private initEventsHandlers(): void {
    this.serverIo.on("connection", (socket: any) => {
      console.log("Connection received");

      socket.on("updateState", (data: any) => {
        this.handleState(data);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        if (this.simulatorWebview) {
          this.simulatorWebview.webview.postMessage({ command: "reset-state" });
        }
      });
    });
  }

  private handleState(data: any): void {
    try {
      const messageToWebview = JSON.parse(data);
      if (messageToWebview.type === "state") {
        console.log(`State recieved: ${messageToWebview.data}`);
        if (this.simulatorWebview) {
          this.simulatorWebview.webview.postMessage({
            command: "set-state",
            state: JSON.parse(messageToWebview.data)
          });
        }
      }
    } catch (err) {
      console.error(`Error: Non-JSON output from the process :  ${data}`);
    }
  }
}
