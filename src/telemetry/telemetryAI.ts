import * as vscode from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";
import getPackageInfo from "./getPackageInfo";

// tslint:disable-next-line:export-name
export default class TelemetryAI {
    private static telemetryReporter: TelemetryReporter;
    private static enableTelemetry: boolean | undefined;

    constructor(vscodeContext: vscode.ExtensionContext) {
        TelemetryAI.telemetryReporter = this.createTelemetryReporter(vscodeContext);
        TelemetryAI.enableTelemetry = vscode.workspace.getConfiguration().get("telemetry.enableTelemetry");
        if (TelemetryAI.enableTelemetry === undefined) {
            TelemetryAI.enableTelemetry = true;
        }
    }

    public getExtensionName(context: vscode.ExtensionContext): string {
        const { extensionName } = getPackageInfo(context);
        return extensionName;
    }

    public getExtensionVersionNumber(context: vscode.ExtensionContext): string {
        const { extensionVersion } = getPackageInfo(context);
        return extensionVersion;
    }

    public sendTelemetryIfEnabled(eventName: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
        if (TelemetryAI.enableTelemetry) {
            TelemetryAI.telemetryReporter.sendTelemetryEvent(eventName, properties, measurements);
        }
    }

    public trackFeatureUsage(eventName: string, eventProperties?: { [key: string]: string }) {
        this.sendTelemetryIfEnabled(eventName, eventProperties)
    }

    public runWithLatencyMeasure(functionToRun: () => void, eventName: string): void {
        const numberOfNanosecondsInSecond: number = 1000000000;
        const startTime: number = Number(process.hrtime.bigint());
        functionToRun();
        const latency: number = Number(process.hrtime.bigint()) - startTime;
        const measurement = {
            duration: latency / numberOfNanosecondsInSecond
        }
        this.sendTelemetryIfEnabled(eventName, {}, measurement);
    }

    private createTelemetryReporter(context: vscode.ExtensionContext): TelemetryReporter {
        const { extensionName, extensionVersion, instrumentationKey } = getPackageInfo(context);
        const reporter: TelemetryReporter = new TelemetryReporter(extensionName, extensionVersion, instrumentationKey);
        context.subscriptions.push(reporter);
        return reporter;
    }
}