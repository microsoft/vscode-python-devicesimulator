import * as vscode from "vscode";

export class FileSelectionService {
    static getActiveEditorFromPath = (
        filePath: string
    ): vscode.TextDocument => {
        const activeEditor = vscode.window.visibleTextEditors.find(
            (editor: vscode.TextEditor) => editor.document.fileName === filePath
        );
        return activeEditor ? activeEditor.document : undefined;
    };
    private currentFileAbsPath: string = "";
    private currentTextDocument: vscode.TextDocument;

    public updateCurrentFileFromEditor = async (
        activeTextDocument: vscode.TextEditor | undefined,
        currentPanel: vscode.WebviewPanel
    ) => {
        if (
            activeTextDocument &&
            activeTextDocument.document &&
            activeTextDocument.document.languageId === "python"
        ) {
            this.setPathAndSendMessage(
                currentPanel,
                activeTextDocument.document.fileName
            );
            this.currentTextDocument = activeTextDocument.document;
        } else if (this.currentFileAbsPath === "") {
            this.setPathAndSendMessage(
                currentPanel,
                this.getActivePythonFile() || ""
            );
        }
        if (
            this.currentTextDocument &&
            FileSelectionService.getActiveEditorFromPath(
                this.currentTextDocument.fileName
            ) === undefined
        ) {
            await vscode.window.showTextDocument(
                this.currentTextDocument,
                vscode.ViewColumn.One
            );
        }
    };
    private setPathAndSendMessage = (
        currentPanel: vscode.WebviewPanel,
        newFilePath: string
    ) => {
        this.currentFileAbsPath = newFilePath;
        if (currentPanel) {
            currentPanel.webview.postMessage({
                command: "current-file",
                active_device: this.currentActiveDevice,

                state: {
                    running_file: newFilePath,
                },
            });
        }
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
