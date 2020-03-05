import * as vscode from "vscode";
import { VSCODE_MESSAGES_TO_WEBVIEW } from "../view/constants";
import { DeviceSelectionService } from "./deviceSelectionService";
import { MessagingService } from "./messagingService";

export class FileSelectionService {
    private currentFileAbsPath: string = "";
    private currentTextDocument: vscode.TextDocument;
    private messagingService: MessagingService;

    constructor(messagingService: MessagingService) {
        this.messagingService = messagingService;
    }

    public getCurrentFileAbsPath() {
        return this.currentFileAbsPath;
    }
    public getCurrentTextDocument() {
        return this.currentTextDocument;
    }
    public updateCurrentFileFromTextFile = async (
        activeTextDocument: vscode.TextDocument | undefined
    ) => {
        if (activeTextDocument) {
            await this.updateCurrentFileFromEditor({
                document: activeTextDocument,
            } as vscode.TextEditor);
        } else {
            return;
        }
    };
    public updateCurrentFileFromEditor = async (
        activeTextDocument: vscode.TextEditor | undefined
    ) => {
        if (
            activeTextDocument &&
            activeTextDocument.document &&
            activeTextDocument.document.languageId === "python"
        ) {
            this.setPathAndSendMessage(activeTextDocument.document.fileName);
            this.currentTextDocument = activeTextDocument.document;
        } else if (this.currentFileAbsPath === "") {
            this.setPathAndSendMessage(this.getActivePythonFile() || "");
        }
        if (
            this.currentTextDocument &&
            this.getActiveEditorFromPath(this.currentTextDocument.fileName) ===
                undefined
        ) {
            await vscode.window.showTextDocument(
                this.currentTextDocument,
                vscode.ViewColumn.One
            );
        }
    };
    public findCurrentTextDocument() {
        if (this.currentFileAbsPath) {
            const foundDocument = this.getActiveEditorFromPath(
                this.currentFileAbsPath
            );
            if (foundDocument !== undefined) {
                this.currentTextDocument = foundDocument;
            }
        }
    }

    public setPathAndSendMessage = (newFilePath: string) => {
        this.currentFileAbsPath = newFilePath;
        this.messagingService.sendMessageToWebview(
            VSCODE_MESSAGES_TO_WEBVIEW.CURRENT_FILE,
            {
                running_file: newFilePath,
            }
        );
    };
    private getActiveEditorFromPath = (
        filePath: string
    ): vscode.TextDocument => {
        const activeEditor = vscode.window.visibleTextEditors.find(
            (editor: vscode.TextEditor) => editor.document.fileName === filePath
        );
        return activeEditor ? activeEditor.document : undefined;
    };
    private getActivePythonFile = () => {
        const editors: vscode.TextEditor[] = vscode.window.visibleTextEditors;
        const activeEditor = editors.find(
            editor => editor.document.languageId === "python"
        );
        if (activeEditor) {
            this.currentTextDocument = activeEditor.document;
        }
        return activeEditor ? activeEditor.document.fileName : "";
    };
}
