import {
    DebugAdapterTracker,
    DebugAdapterTrackerFactory,
    DebugSession,
    DebugConsole,
    ProviderResult,
} from "vscode";
import { DebugProtocol } from "vscode-debugprotocol";

export class DebugAdapter implements DebugAdapterTracker {
    private readonly console: DebugConsole | undefined;
    constructor(debugSession: DebugSession) {
        this.console = debugSession.configuration.console;
    }
    onWillStartSession() {
        console.log("--debugadapter onWillStartSession");
    }
    onWillReceiveMessage(message: any): void {
        console.log("--debugadapter onWillReceiveMessage");
        console.log(JSON.stringify(message));
    }
    onExit() {
        console.log("--debugadapter onExit");
    }
}

export class DebugAdapterFactory implements DebugAdapterTrackerFactory {
    private debugSession: DebugSession;
    constructor(debugSession: DebugSession) {
        console.log("New debug factory");
        this.debugSession = debugSession;
    }
    public createDebugAdapterTracker(
        session: DebugSession
    ): ProviderResult<DebugAdapterTracker> {
        console.log("It created an adapter tracker");
        return new DebugAdapter(session);
    }
}
