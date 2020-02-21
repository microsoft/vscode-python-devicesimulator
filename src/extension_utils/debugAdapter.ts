import {
    DebugAdapterTracker,
    DebugAdapterTrackerFactory,
    DebugSession,
    DebugConsole,
    ProviderResult,
    Webview,
} from "vscode";
import { DebugProtocol } from "vscode-debugprotocol";
import { MessagingService } from "../service/messagingService";
import { DEBUG_COMMANDS } from "../view/constants";

export class DebugAdapter implements DebugAdapterTracker {
    private readonly console: DebugConsole | undefined;
    private readonly messagingService: MessagingService;
    constructor(
        debugSession: DebugSession,
        messagingService: MessagingService
    ) {
        this.console = debugSession.configuration.console;
        this.messagingService = messagingService;
    }
    onWillStartSession() {
        console.log("--debugadapter onWillStartSession");
    }
    onWillReceiveMessage(message: any): void {
        console.log("--debugadapter onWillReceiveMessage");
        console.log(JSON.stringify(message));
        if (message.command) {
            // Only send pertinent debug messages

            if (message.command in DEBUG_COMMANDS) {
                this.handleAdapterMessages(message.command);
            }
        }
    }
    onExit() {
        console.log("--debugadapter onExit");
    }
    handleAdapterMessages(command: DEBUG_COMMANDS) {
        this.messagingService.sendMessageToWebview(command, {});
    }
}

export class DebugAdapterFactory implements DebugAdapterTrackerFactory {
    private debugSession: DebugSession;
    private messagingService: MessagingService;
    constructor(
        debugSession: DebugSession,
        messagingService: MessagingService
    ) {
        console.log("New debug factory");
        this.debugSession = debugSession;
        this.messagingService = messagingService;
    }
    public createDebugAdapterTracker(
        session: DebugSession
    ): ProviderResult<DebugAdapterTracker> {
        console.log("It created an adapter tracker");
        return new DebugAdapter(session, this.messagingService);
    }
}
