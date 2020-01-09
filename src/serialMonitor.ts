// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Credit: A majority of this code was taken from the Visual Studio Code Arduino extension with some modifications to suit our purposes.

import * as vscode from "vscode";
import { outChannel } from "./extension";
import { logToOutputChannel } from "./extension_utils/utils";
import { DeviceContext } from "./deviceContext";
import CONSTANTS, { STATUS_BAR_PRIORITY, DialogResponses } from "./constants";
import { SerialPortControl } from "./serialPortControl";

export interface ISerialPortDetail {
    comName: string;
    manufacturer: string;
    vendorId: string;
    productId: string;
}

export class SerialMonitor implements vscode.Disposable {

    public static DEFAULT_BAUD_RATE: number = 115200;

    public static listBaudRates(): number[] {
        return [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880, 115200, 230400, 250000];
    }

    public static getInstance(): SerialMonitor {
        if (SerialMonitor._serialMonitor === null) {
            SerialMonitor._serialMonitor = new SerialMonitor();
        }
        return SerialMonitor._serialMonitor;
    }

    private static _serialMonitor: SerialMonitor | null = null;

    private _currentPort!: string;
    private _currentDevice!: string;
    private _currentBaudRate!: number;
    private _outputChannel!: vscode.OutputChannel;
    private _serialPortControl: SerialPortControl | null = null;
    private _baudRateStatusBar!: vscode.StatusBarItem;
    private _openPortStatusBar!: vscode.StatusBarItem;
    private _portsStatusBar!: vscode.StatusBarItem;
    private _deviceSelectionBar!: vscode.StatusBarItem;

    private constructor() {
        const deviceContext = DeviceContext.getInstance();
        deviceContext.onDidChange(() => {
            if (deviceContext.port) {
                if (!this.initialized) {
                    this.initialize();
                }
                this.updatePortListStatus(null);
            }
        });
    }

    public initialize() {
        const defaultBaudRate: number = SerialMonitor.DEFAULT_BAUD_RATE;
        this._outputChannel = vscode.window.createOutputChannel(CONSTANTS.MISC.SERIAL_MONITOR_NAME);
        this._currentBaudRate = defaultBaudRate;
        this._portsStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.PORT);
        this._portsStatusBar.command = "deviceSimulatorExpress.selectSerialPort";
        this._portsStatusBar.tooltip = "Select Serial Port";
        this._portsStatusBar.show();

        this._deviceSelectionBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.DEVICE);
        this._deviceSelectionBar.command = "deviceSimulatorExpress.selectDevice";
        this._deviceSelectionBar.tooltip = "Select Device";
        this._deviceSelectionBar.show();
        
        this._openPortStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.OPEN_PORT);
        this._openPortStatusBar.command = "deviceSimulatorExpress.openSerialMonitor";
        this._openPortStatusBar.text = `$(plug)`;
        this._openPortStatusBar.tooltip = "Open Serial Monitor";
        this._openPortStatusBar.show();

        this._baudRateStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.BAUD_RATE);
        this._baudRateStatusBar.command = "deviceSimulatorExpress.changeBaudRate";
        this._baudRateStatusBar.tooltip = "Baud Rate";
        this._baudRateStatusBar.text = defaultBaudRate.toString();
        this.updatePortListStatus(null);
        this.updateDeviceSelection(null);
    }

    public async selectDevice() {
        const DeviceOptions: string[] = ["Adafruit Playground", "Microbit"];
        const chosen = await vscode.window.showQuickPick(<vscode.QuickPickItem[]>DeviceOptions.map((l: string): vscode.QuickPickItem => {
        return {
                description: l,
                label: l,
            };
        }), { placeHolder: "Select Device" });
        if (chosen && chosen.label) {
            this.updateDeviceSelection(chosen.label);
        }
    }

    public async selectSerialPort(vid: string | null, pid: string | null) {
        const lists = await SerialPortControl.list();
        if (!lists.length) {
            vscode.window.showInformationMessage("No serial message is available.");
            return;
        }

        if (vid && pid) {
            const valueOfVid = parseInt(vid, 16);
            const valueOfPid = parseInt(pid, 16);
            const foundPort = lists.find((port) => {
                if (port.productId && port.vendorId) {
                    return parseInt(port.productId, 16) === valueOfPid && parseInt(port.vendorId, 16) === valueOfVid;
                }
                return false;
            });
            if (foundPort && !(this._serialPortControl && this._serialPortControl.isActive)) {
                this.updatePortListStatus(foundPort.comName);
            }
        } else {
            const chosen = await vscode.window.showQuickPick(lists.map((port: ISerialPortDetail): vscode.QuickPickItem => {
                return {
                    description: port.manufacturer,
                    label: port.comName
                };
            }).sort((a, b): number => {
                return a.label === b.label ? 0 : (a.label > b.label ? 1 : -1);
            }) as vscode.QuickPickItem[], { placeHolder: CONSTANTS.MISC.SELECT_PORT_PLACEHOLDER});

            if (chosen && chosen.label) {
                this.updatePortListStatus(chosen.label);
            }
        }
    }

    public async openSerialMonitor() {
        if (!this._currentPort) {
            const ans = await vscode.window.showInformationMessage(
                CONSTANTS.WARNING.NO_SERIAL_PORT_SELECTED,
                DialogResponses.YES,
                DialogResponses.NO,
            );
            if (ans === DialogResponses.YES) {
                await this.selectSerialPort(null, null);
            }
            if (!this._currentPort) {
                return;
            }
        }

        if (this._serialPortControl) {
            if (this._currentPort !== this._serialPortControl.currentPort) {
                await this._serialPortControl.changePort(this._currentPort);
            } else if (this._serialPortControl.isActive) {
                vscode.window.showWarningMessage(`Serial Monitor is already opened for ${this._currentPort}`);
                return;
            }
        } else {
            this._serialPortControl = new SerialPortControl(this._currentPort, this._currentBaudRate, this._outputChannel);
        }

        if (!this._serialPortControl.currentPort) {
            console.error(CONSTANTS.ERROR.FAILED_TO_OPEN_SERIAL_PORT(this._currentPort));
            return;
        }

        try {
            await this._serialPortControl.open();
            this.updatePortStatus(true);
        } catch (error) {
            logToOutputChannel(outChannel, CONSTANTS.ERROR.FAILED_TO_OPEN_SERIAL_PORT_DUE_TO(this._currentPort, error), true);
        }
    }

    public get initialized(): boolean {
       return !!this._outputChannel; 
    }

    public dispose() {
        if (this._serialPortControl && this._serialPortControl.isActive) {
            return this._serialPortControl.stop();
        }
    }

    public async changeBaudRate() {
        const baudRates = SerialMonitor.listBaudRates();
        const chosen = await vscode.window.showQuickPick(baudRates.map((baudRate) => baudRate.toString()));

        if (!chosen) {
            logToOutputChannel(outChannel, CONSTANTS.WARNING.NO_RATE_SELECTED, true);
            return;
        }

        if (!parseInt(chosen, 10)) {
            logToOutputChannel(outChannel, CONSTANTS.WARNING.INVALID_BAUD_RATE, true);
            return;
        }

        if (!this._serialPortControl) {
            logToOutputChannel(outChannel, CONSTANTS.WARNING.SERIAL_MONITOR_NOT_STARTED, true);
            return;
        }

        const selectedRate: number = parseInt(chosen, 10);
        await this._serialPortControl.changeBaudRate(selectedRate);
        this._currentBaudRate = selectedRate;
        this._baudRateStatusBar.text = chosen;
    }

    public async closeSerialMonitor(port: string, showWarning: boolean = true) {
        if (this._serialPortControl) {
            if (port && port !== this._serialPortControl.currentPort) {
                // Port is not opened
                return false;
            }
            const result = await this._serialPortControl.stop();
            this.updatePortStatus(false);
            return result;
        } else if (!port && showWarning) {
            logToOutputChannel(outChannel, CONSTANTS.WARNING.SERIAL_PORT_NOT_STARTED, true);
            return false;
        }
    }

    private updatePortStatus(isOpened: boolean) {
        if (isOpened) {
            this._openPortStatusBar.command = "deviceSimulatorExpress.closeSerialMonitor";
            this._openPortStatusBar.text = `$(x)`;
            this._openPortStatusBar.tooltip = "Close Serial Monitor";
            this._baudRateStatusBar.show();
        } else {
            this._openPortStatusBar.command = "deviceSimulatorExpress.openSerialMonitor";
            this._openPortStatusBar.text = `$(plug)`;
            this._openPortStatusBar.tooltip = "Open Serial Monitor";
            this._baudRateStatusBar.hide();
        }
    }

    private updatePortListStatus(port: string | null) {
        const deviceContext = DeviceContext.getInstance();
        if (port) {
            deviceContext.port = port;
        }
        this._currentPort = deviceContext.port;

        if (deviceContext.port) {
            this._portsStatusBar.text = deviceContext.port;
        } else {
            this._portsStatusBar.text = "<Select Serial Port>";
        }
    }

    private updateDeviceSelection(device: string | null) {
        const deviceContext = DeviceContext.getInstance();
        if (device) {
            deviceContext.device = device;
        }
        this._currentDevice = deviceContext.device;
        console.info("Updating Device in Serial Monitor to " + this._currentDevice);
        if (deviceContext.device) {
            this._deviceSelectionBar.text = deviceContext.device;
        } else {
            this._deviceSelectionBar.text = "<Select Device>";
        }
    }

    public get currentDevice() {
        return this._currentDevice;
    }
}
