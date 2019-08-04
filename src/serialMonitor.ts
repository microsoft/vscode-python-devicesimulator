import * as vscode from "vscode";
import { SerialPortControl, SerialPortEnding } from "./serialPortControl";
import { DeviceContext } from "./deviceContext";
import { STATUS_BAR_PRIORITY, SERIAL_MONITOR_NAME } from "./constants";

export interface ISerialPortDetail {
    comName: string;
    manufacturer: string;
    vendorId: string;
    productId: string;
}

export class SerialMonitor implements vscode.Disposable {

    public static DEFAULT_BAUD_RATE: number = 115200;
    public static DEFAULT_ENDING: SerialPortEnding = SerialPortEnding["No line ending"];

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
    private _currentBaudRate!: number;
    private _ending!: SerialPortEnding; 
    private _outputChannel!: vscode.OutputChannel;
    private _serialPortControl: SerialPortControl | null = null;
    private _baudRateStatusBar!: vscode.StatusBarItem;
    private _endingStatusBar!: vscode.StatusBarItem;
    private _openPortStatusBar!: vscode.StatusBarItem;
    private _portsStatusBar!: vscode.StatusBarItem;

    private constructor() {
        const deviceContext = DeviceContext.getInstance();
        // deviceContext.onDidChange(() => {
            if (deviceContext.port) {
                if (!this.initialized) {
                    this.initialize();
                }
                // todo fix
                this.updatePortListStatus(null);
            }
        // });
    }

    // must register the 3 commands that i have in intialize method
    public initialize() {
        const defaultBaudRate: number = SerialMonitor.DEFAULT_BAUD_RATE;
        this._outputChannel = vscode.window.createOutputChannel(SERIAL_MONITOR_NAME);
        this._outputChannel.show(true);
        this._outputChannel.appendLine("test message to channel");
        this._currentBaudRate = defaultBaudRate;
        this._portsStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.PORT);
        this._portsStatusBar.command = "pacifica.selectSerialPort";
        this._portsStatusBar.tooltip = "Select Serial Port";
        this._portsStatusBar.show();

        this._openPortStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.OPEN_PORT);
        this._openPortStatusBar.command = "pacifica.openSerialMonitor";
        this._openPortStatusBar.text = `$(plug)`;
        this._openPortStatusBar.tooltip = "Open Serial Monitor";
        this._openPortStatusBar.show();

        this._baudRateStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.BAUD_RATE);
        this._baudRateStatusBar.command = "pacifica.changeBaudRate";
        this._baudRateStatusBar.tooltip = "Baud Rate";
        this._baudRateStatusBar.text = defaultBaudRate.toString();
        // todo fix
        this.updatePortListStatus(null);

        this._endingStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY.ENDING);
        this._ending = SerialMonitor.DEFAULT_ENDING;
        this._endingStatusBar.command = "pacifica.changeEnding";
        this._endingStatusBar.tooltip = "Change Ending";
        this._endingStatusBar.text = `No line ending`;
    }

    public async selectSerialPort(vid: string, pid: string) {
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
            const chosen = await vscode.window.showQuickPick(<vscode.QuickPickItem[]>lists.map((port: ISerialPortDetail): vscode.QuickPickItem => {
                return {
                    description: port.manufacturer,
                    label: port.comName
                };
            }).sort((a, b): number => {
                return a.label === b.label ? 0 : (a.label > b.label ? 1 : -1);
            }), { placeHolder: "Select a serial port"});

            if (chosen && chosen.label) {
                this.updatePortListStatus(chosen.label);
            }
        }
    }

    public async openSerialMonitor() {
        if (!this._currentPort) {
            const ans = await vscode.window.showInformationMessage("No serial port was selected, please select a serial port first", "Yes", "No");
            if (ans === "Yes") {
                // kinda weird workaround to passing null
                await this.selectSerialPort("", "");
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
            this._serialPortControl = new SerialPortControl(this._currentPort, this._currentBaudRate, this._ending, this._outputChannel);
        }

        if (!this._serialPortControl.currentPort) {
            // loggger error
            return;
        }

        try {
            await this._serialPortControl.open();
            this.updatePortStatus(true);
        } catch (error) {
            // log error
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

    public async sendMessageToSerialPort() {
        if (this._serialPortControl && this._serialPortControl.isActive) {
            const text = await vscode.window.showInputBox();
            try {
                await this._serialPortControl.sendMessage(text);
            } catch (error) {
                // log error
            }
        } else {
            // log error 
        }
    }

    public async changeBaudRate() {
        const baudRates = SerialMonitor.listBaudRates();
        const chosen = await vscode.window.showQuickPick(baudRates.map((baudRate) => baudRate.toString()));

        if (!chosen) {
            // log that no rate is selected and will keep current rate
            return;
        }

        if (!parseInt(chosen, 10)) {
            // log that the chosen baud rate is invalid
            return;
        }

        if (!this._serialPortControl) {
            // log that serial monitor has not been started
            return;
        }

        const selectedRate: number = parseInt(chosen, 10);
        await this._serialPortControl.changeBaudRate(selectedRate);
        this._currentBaudRate = selectedRate;
        this._baudRateStatusBar.text = chosen;
    }

    public async changeEnding() {
        const chosen: string|undefined = await vscode.window.showQuickPick(Object.keys(SerialPortEnding));
        if (!chosen) {
            return;
        }
        this._ending = SerialPortEnding[chosen];
        
        if (this._serialPortControl) {
            this._serialPortControl.changeEnding(this._ending);
        }
        this._endingStatusBar.text = chosen;
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
            // show warning
            return false;
        }
    }

    private updatePortStatus(isOpened: boolean) {
        if (isOpened) {
            this._openPortStatusBar.command = "pacifica.closeSerialMonitor";
            this._openPortStatusBar.text = `$(x)`;
            this._openPortStatusBar.tooltip = "Close Serial Monitor";
            this._baudRateStatusBar.show();
            this._endingStatusBar.show();
        } else {
            this._openPortStatusBar.command = "pacifica.openSerialMonitor";
            this._openPortStatusBar.text = `$(plug)`;
            this._openPortStatusBar.tooltip = "Open Serial Monitor";
            this._baudRateStatusBar.hide();
            this._endingStatusBar.hide();
        }
    }

    private updatePortListStatus(port: string | null) {
        const deviceContext = DeviceContext.getInstance();
        if (port) {
            deviceContext.port = port;
        }
        this._currentPort = deviceContext.port;

        if (deviceContext.port) {
            // this._portsStatusBar.text = deviceContext.port;
        } else {
            // this._portsStatusBar.text = "<Select Serial Port>";
        }
    }

}