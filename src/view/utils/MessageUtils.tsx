interface vscode {
    postMessage(message: any): void;
}

declare const vscode: vscode;

export const sendMessage = (type: string, state: any) => {
    vscode.postMessage({ command: type, text: state });
};
