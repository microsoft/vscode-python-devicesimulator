// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Credit: A majority of this code was taken from the Visual Studio Code Arduino extension with some modifications to suit our purposes.

import * as os from "os";
import { OutputChannel } from "vscode";

interface ISerialPortDetail {
    comName: string;
    manufacturer: string;
    vendorId: string;
    productId: string;
}

export enum SerialPortEnding {
    "No line ending",
    "Newline",
    "Carriage return",
    "Both NL & CR"
}

export class SerialPortControl {
    public static get serialport(): any {
        if (!SerialPortControl._serialport) {
            SerialPortControl._serialport = require("../vendor/node-usb-native").SerialPort
        }
        return SerialPortControl._serialport;
    }

    public static list(): Promise<ISerialPortDetail[]> {
        return new Promise((resolve, reject) => {
            SerialPortControl.serialport.list((error: any, ports: ISerialPortDetail[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(ports);
                }
            });
        });
    }

    private static _serialport: any;

    private _currentPort: string;
    private _currentBaudRate: number;
    private _currentSerialPort: any;
    private _ending: SerialPortEnding;

    public constructor(port: string, baudRate: number, ending: SerialPortEnding, private _outputChannel: OutputChannel) {
        this._currentPort = port;
        this._currentBaudRate = baudRate;
        this._ending = ending;
    }

    public get isActive(): boolean {
        return this._currentSerialPort && this._currentSerialPort.isOpen();
    }

    public get currentPort(): string {
        return this._currentPort;
    }

    public open(): Promise<any> {
        this._outputChannel.appendLine(`[Starting] Opening the serial port - ${this._currentPort}`); 
        return new Promise((resolve, reject) => {
            if (this._currentSerialPort && this._currentSerialPort.isOpen()) {
                this._currentSerialPort.close((err: any) => {
                    if (err) {
                        return reject(err);
                    }
                    this._currentSerialPort = null;
                    return this.open().then(() => {
                        resolve();
                    }, (error) => {
                        reject(error);
                    });
                });
            } else {
                this._currentSerialPort = new SerialPortControl.serialport(this._currentPort, { baudRate: this._currentBaudRate });
                this._outputChannel.show();
                this._currentSerialPort.on("open", () => {
                    this._currentSerialPort.write("TestingOpen", "Both NL & CR", (err: any) => {
                        if (err && !(err.message.indexOf("Writing to COM port (GetOverlappedResult): Unknown error code 121") >= 0)) {
                            this._outputChannel.appendLine(`[Error] Failed to open the serial port - ${this._currentPort}`);
                            reject(err);
                        } else {
                            this._outputChannel.appendLine(`[Info] Opened the serial port - ${this._currentPort}`);
                            resolve();
                        }
                    });
                });
            }

            this._currentSerialPort.on("data", (event: any) => {
                this._outputChannel.append(event.toString());
            });

            this._currentSerialPort.on("error", (error: any) => {
                this._outputChannel.appendLine("[Error]" + error.toString());
            });
        });
    }

    public sendMessage(text: string | undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!text || !this._currentSerialPort || !this.isActive) {
                resolve();
                return;
            }

            this._currentSerialPort.write(text, SerialPortEnding[this._ending], (error: any) => {
                if (!error) {
                    resolve();
                } else {
                    return reject(error);
                }
            });
        });
    }

    public changePort(newPort: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (newPort === this._currentPort) {
                resolve();
                return;
            }
            this._currentPort = newPort;
            if (!this._currentSerialPort || !this.isActive) {
                resolve();
                return;
            }
            this._currentSerialPort.close((error: any) => {
                if (error) {
                    reject(error);
                } else {
                    this._currentSerialPort = null;
                    resolve();
                }
            });
        });
    }

    public stop(): Promise<any> {
        return new Promise((resolve, reject) => {
          if (!this._currentSerialPort || !this.isActive) {
            resolve(false);
            return;
          }
          this._currentSerialPort.close((error: any) => {
            if (this._outputChannel) {
              this._outputChannel.appendLine(`[Done] Closed the serial port ${os.EOL}`);
            }
            this._currentSerialPort = null;
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }
          });
        });
    }

    public changeBaudRate(newBaudRate: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._currentBaudRate = newBaudRate;
            if (!this._currentSerialPort || !this.isActive) {
                resolve();
                return;
            }
            this._currentSerialPort.update({ baudRate: this._currentBaudRate }, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public changeEnding(newEnding: SerialPortEnding)  {
        this._ending = newEnding;
    }
}