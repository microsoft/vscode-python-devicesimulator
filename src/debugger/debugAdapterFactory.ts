import {
    DebugAdapterTracker,
    DebugAdapterTrackerFactory,
    DebugSession,
    ProviderResult,
} from "vscode";
import { DebuggerCommunicationService } from "../service/debuggerCommunicationService";
import { MessagingService } from "../service/messagingService";
import { DebugAdapter } from "./debugAdapter";

export class DebugAdapterFactory implements DebugAdapterTrackerFactory {
    private debugSession: DebugSession;
    private messagingService: MessagingService;
    private debugCommunicationService: DebuggerCommunicationService;
    constructor(
        debugSession: DebugSession,
        messagingService: MessagingService,
        debugCommunicationService: DebuggerCommunicationService
    ) {
        this.debugSession = debugSession;
        this.messagingService = messagingService;
        this.debugCommunicationService = debugCommunicationService;
    }
    public createDebugAdapterTracker(
        session: DebugSession
    ): ProviderResult<DebugAdapterTracker> {
        return new DebugAdapter(
            session,
            this.messagingService,
            this.debugCommunicationService
        );
    }
}
