import { DebuggerCommunicationServer } from "../debuggerCommunicationServer";

export class DebuggerCommunicationService {
    private currentDebuggerServer: DebuggerCommunicationServer | undefined;

    public setCurrentDebuggerServer(debugServer: DebuggerCommunicationServer) {
        this.currentDebuggerServer = debugServer;
    }
    // Used for restart and stop event
    public resetCurrentDebuggerServer() {
        if (this.currentDebuggerServer) {
            this.currentDebuggerServer.closeConnection();
        }
        this.currentDebuggerServer = undefined;
    }
    public getCurrentDebuggerServer() {
        return this.currentDebuggerServer;
    }
    // Only used for stop event
    public handleStopEvent() {
        if (this.currentDebuggerServer) {
            this.currentDebuggerServer.disconnectFromPort();
        }
    }
}
