import * as socketio from "socket.io";
import { Webview, window } from "vscode";

export class CommunicationHandlerServer {
  private io: socketio.Server | null;
  private isClosed: boolean;

  constructor(private webview: Webview, private port: number = 5555) {
    console.log("Starting server");

    // this.io = socketio(this.port);
    this.io = null;
    // this.initEventHandlers();
    this.isClosed = true;
  }

  public getPort(): number {
    return this.port;
  }

  public closeConnection(): void {
    if (this.io) {
      this.io.close(() => {
        this.isClosed = true;
      });
      this.io = null;
    }
  }

  public initConnection(): void {
    if (this.io) {
      this.closeConnection();
    }
    this.io = socketio(this.port);
    this.initEventHandlers();
    this.isClosed = false;
  }

  private initEventHandlers() {
    if (this.io) {

      this.io.on("connection", socket => {
        console.log("Connection received");
        
        socket.on("messageFromClient", data => {
          console.log("Message received from client : ", data);
          window.showInformationMessage("Received a message from client socket");
        });

        socket.on("updateState", data => {
          // console.log("State received : ", data);
          // window.showInformationMessage("Received a message from client socket");
          
          try { // JSON OR STRING ??
            const messageToWebview = JSON.parse(data);
            switch (messageToWebview.type) {
              case "state":
                console.log(
                  `Process state output = ${messageToWebview.data}`
                );
                this.webview.postMessage({
                  command: "set-state",
                  state: JSON.parse(messageToWebview.data)
                });
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
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      });
    }
  }
}
