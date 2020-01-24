import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export class CPXWorkspace {
    static get rootPath(): string | undefined {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return undefined;
        }

        for (const workspaceFolder of workspaceFolders) {
            const workspaceFolderPath = workspaceFolder.uri.fsPath;
            const cpxConfigPath = path.join(
                workspaceFolderPath,
                ".vscode",
                "cpx.json"
            );
            if (fs.existsSync(cpxConfigPath)) {
                return workspaceFolderPath;
            }
        }

        return workspaceFolders[0].uri.fsPath;
    }
}
