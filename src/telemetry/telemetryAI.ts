import * as vscode from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";
import getPackageInfo from "./getPackageInfo";

// tslint:disable-next-line:export-name
export default class TelemetryAI {
    public static trackFeatureUsage(eventName: string, eventProperties?: { [key: string]: string }) {
        TelemetryAI.telemetryReporter.sendTelemetryEvent(eventName, eventProperties);
    }

    public static runWithLatencyMeasure(functionToRun: Function, eventName: string): void {
        const numberOfNanosecondsInSecond: number = 1000000000;
        const currentTime: number = Number(process.hrtime.bigint());
        functionToRun();
        const latency: number = Number(process.hrtime.bigint()) - currentTime;
        const measurement = {
            duration: latency / numberOfNanosecondsInSecond
        }
        TelemetryAI.telemetryReporter.sendTelemetryEvent(eventName, {}, measurement);
    }

    private static telemetryReporter: TelemetryReporter;

    constructor(vscodeContext: vscode.ExtensionContext) {
        TelemetryAI.telemetryReporter = this.createTelemetryReporter(vscodeContext);
    }

    public getExtensionName(context: vscode.ExtensionContext): string {
        const { extensionName } = getPackageInfo(context);
        return extensionName;
    }

    public getExtensionVersionNumber(context: vscode.ExtensionContext): string {
        const { extensionVersion } = getPackageInfo(context);
        return extensionVersion;
    }

    public trackEventTime(eventName: string, startTime: number, endTime: number = Date.now(), eventProperties?: { [key: string]: string }) {
        this.trackTimeDuration(eventName, startTime, endTime, eventProperties);
    }

    private createTelemetryReporter(context: vscode.ExtensionContext): TelemetryReporter {
        const { extensionName, extensionVersion, instrumentationKey } = getPackageInfo(context);
        const reporter: TelemetryReporter = new TelemetryReporter(extensionName, extensionVersion, instrumentationKey);
        context.subscriptions.push(reporter);
        return reporter;
    }

    private trackTimeDuration(eventName: string, startTime: number, endTime: number, properties?: { [key: string]: string }) {
        const measurement = {
            duration: (endTime - startTime) / 1000
        }
        // Only send event if telemetry is not suppressed
        TelemetryAI.telemetryReporter.sendTelemetryEvent(eventName, properties, measurement);
    }
}