// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Credit: A majority of this code was taken from the Visual Studio Code Arduino extension with some modifications to suit our purposes.

import * as os from "os";
import { OutputChannel } from "vscode";
import { CONSTANTS } from "./constants";
import { logToOutputChannel } from "./extension_utils/utils";

interface ISerialPortDetail {
    path: string;
    manufacturer: string;
    vendorId: string;
    productId: string;
}

export class SerialPortControl {
    public static get serialport(): any {
        if (!SerialPortControl._serialport) {
            SerialPortControl._serialport = require("usb-native").SerialPort;
        }
        return SerialPortControl._serialport;
    }

    public static list(): Promise<ISerialPortDetail[]> {
        return new Promise((resolve, reject) => {
            SerialPortControl.serialport.list(
                (ports) => resolve(ports),
                (err) => reject(err),
            );
        });
    }

    private static _serialport: any;

    private _currentPort: string;
    private _currentBaudRate: number;
    private _currentSerialPort: any;

    public constructor(
        port: string,
        baudRate: number,
        private _outputChannel: OutputChannel
    ) {
        this._currentPort = port;
        this._currentBaudRate = baudRate;
    }

    public get isActive(): boolean {
        return this._currentSerialPort && this._currentSerialPort.isOpen;
    }

    public get currentPort(): string {
        return this._currentPort;
    }

    public open(): Promise<any> {
        logToOutputChannel(
            this._outputChannel,
            CONSTANTS.INFO.OPENING_SERIAL_PORT(this._currentPort)
        );
        return new Promise((resolve, reject) => {
            if (this._currentSerialPort && this._currentSerialPort.isOpen) {
                this._currentSerialPort.close((err: any) => {
                    if (err) {
                        return reject(err);
                    }
                    this._currentSerialPort = null;
                    return this.open().then(
                        () => {
                            resolve();
                        },
                        error => {
                            reject(error);
                        }
                    );
                });
            } else {
                this._currentSerialPort = new SerialPortControl.serialport(
                    this._currentPort,
                    { baudRate: this._currentBaudRate }
                );
                this._outputChannel.show();
                this._currentSerialPort.on("open", () => {
                    this._currentSerialPort.write(
                        CONSTANTS.MISC.SERIAL_MONITOR_TEST_IF_OPEN,
                        "Both NL & CR",
                        (err: any) => {
                            if (
                                err &&
                                !(
                                    err.message.indexOf(
                                        CONSTANTS.ERROR.COMPORT_UNKNOWN_ERROR
                                    ) >= 0
                                )
                            ) {
                                logToOutputChannel(
                                    this._outputChannel,
                                    CONSTANTS.ERROR.FAILED_TO_OPEN_SERIAL_PORT(
                                        this._currentPort
                                    )
                                );
                                logToOutputChannel(
                                    this._outputChannel,
                                    CONSTANTS.ERROR.RECONNECT_DEVICE
                                );
                                reject(err);
                            } else {
                                logToOutputChannel(
                                    this._outputChannel,
                                    CONSTANTS.INFO.OPENED_SERIAL_PORT(
                                        this._currentPort
                                    )
                                );
                                resolve();
                            }
                        }
                    );
                });
            }

            this._currentSerialPort.on("data", (event: any) => {
                logToOutputChannel(this._outputChannel, event.toString());
            });

            this._currentSerialPort.on("error", (error: any) => {
                logToOutputChannel(this._outputChannel, error.toString());
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
                    logToOutputChannel(
                        this._outputChannel,
                        CONSTANTS.INFO.CLOSED_SERIAL_PORT(this._currentPort)
                    );
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
            this._currentSerialPort.update(
                { baudRate: this._currentBaudRate },
                (error: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
}
