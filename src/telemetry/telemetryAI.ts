import * as vscode from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";
import getPackageInfo from "./getPackageInfo";

// tslint:disable-next-line:export-name
export default class TelmemetryAI {
    private static telemetryReporter: TelemetryReporter;

    constructor(private vscodeContext: vscode.ExtensionContext) {
        TelmemetryAI.telemetryReporter = this.createTelemetryReporter(vscodeContext);
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

    public trackFeatureUsage(eventName: string, eventProperties?: { [key: string]: string }) {
        const measurement = {};
        TelmemetryAI.telemetryReporter.sendTelemetryEvent(eventName, eventProperties, measurement);
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
        TelmemetryAI.telemetryReporter.sendTelemetryEvent(eventName, properties, measurement);
    }
}