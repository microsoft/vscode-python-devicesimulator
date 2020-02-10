interface vscode {
    postMessage(message: any): void;
}

declare const vscode: vscode;

export const sendMessage = <TState extends unknown>(
    type: string,
    state: TState
) => {
    vscode.postMessage({ command: type, text: state });
};
