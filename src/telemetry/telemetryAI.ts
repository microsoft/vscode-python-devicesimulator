import * as vscode from 'vscode';
import TelemetryReporter from 'vscode-extension-telemetry';
import { TelemetryEventName } from '../constants';
import getPackageInfo from './getPackageInfo';

export class TelemetryAI {
    private static telemetryReporter;

    constructor(private vscodeContext: vscode.ExtensionContext, private extensionStartTime: number) {
        TelemetryAI.telemetryReporter = this.createTelemetryReporter(vscodeContext);
    }

    private createTelemetryReporter(context: vscode.ExtensionContext) {
        const { extensionName, extensionVersion, extensionId, instrumentationKey } = getPackageInfo(context); 
        const reporter: TelemetryReporter = new TelemetryReporter(extensionName, extensionVersion, instrumentationKey);
        context.subscriptions.push(reporter);
        return reporter;
    }
}