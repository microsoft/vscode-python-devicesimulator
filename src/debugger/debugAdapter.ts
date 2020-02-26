import { DebugAdapterTracker, DebugConsole, DebugSession } from "vscode";
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
        // To Implement
    }
    onWillReceiveMessage(message: any): void {
        if (message.command) {
            // Only send pertinent debug messages
            switch (message.command) {
                case DEBUG_COMMANDS.CONTINUE:
                    this.messagingService.sendStartMessage();
                    break;
                case DEBUG_COMMANDS.STACK_TRACE:
                    this.messagingService.sendPauseMessage();
            }
        }
    }
    // A debugger error should unlock the webview
    onError() {
        this.messagingService.sendStartMessage();
    }
    // Device is always running when exiting debugging mode
    onExit() {
        this.messagingService.sendStartMessage();
    }
}
