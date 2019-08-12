// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Credit: A majority of this code was taken from the Visual Studio Code Arduino extension with some modifications to suit our purposes.

import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as utils from "./extension_utils/utils";
import * as vscode from "vscode";
import { SerialMonitor } from "./serialMonitor";
import { CONFIG_KEYS } from "./constants";

export class UsbDetector {
    public static getInstance(): UsbDetector {
        if (!UsbDetector._instance) {
            UsbDetector._instance = new UsbDetector();
        }
        return UsbDetector._instance;
    }

    private static _instance: UsbDetector;

    private _usbDetector: any;

    private _boardDescriptors: any = null;

    private _extensionRoot: string = null;

    private constructor() { }

    public initialize(extensionRoot: string) {
        this._extensionRoot = extensionRoot;
    }

    public async startListening() {
        const workspaceConfig = vscode.workspace.getConfiguration();
        const enableUSBDetection = workspaceConfig.get(CONFIG_KEYS.ENABLE_USB_DETECTION);

        if (os.platform() === "linux" || !enableUSBDetection) {
            return;
        }
        this._usbDetector = require("../vendor/node-usb-native").detector;

        if (!this._usbDetector) {
            return;
        }

        if (this._extensionRoot === null) {
            throw new Error("UsbDetector should be initialized before using.");
        }

        this._usbDetector.on("add", async (device: any) => {
            if (device.vendorId && device.productId) {
                const deviceDescriptor = this.getUsbDeviceDescriptor(
                    utils.convertToHex(device.vendorId, 4),
                    utils.convertToHex(device.productId, 4),
                    this._extensionRoot
                );

                // Not supported device for discovery
                if (!deviceDescriptor) {
                    return;
                }

                const boardKey = `${deviceDescriptor.package}:${deviceDescriptor.architecture}:${deviceDescriptor.id}`;
                // Log that a board was detected
                if (!SerialMonitor.getInstance().initialized) {
                    SerialMonitor.getInstance().initialize();
                }
            }
        });
    }

    public stopListening() {
        if (this._usbDetector) {
            this._usbDetector.stopMonitoring();
        }
    }

    private getUsbDeviceDescriptor(vendorId: string, productId: string, extensionRoot: string): any {
        if (!this._boardDescriptors) {
            this._boardDescriptors = [];
            const fileContent = fs.readFileSync(path.join(extensionRoot, "misc", "usbmapping.json"), "utf8");
            const boardIndexes: [] = JSON.parse(fileContent);
            boardIndexes.forEach((boardIndex: any) => {
                boardIndex.boards.forEach((board: any) => {
                    board.indexFile = boardIndex.index_file
                });
                this._boardDescriptors = this._boardDescriptors.concat(boardIndex.boards);
            });
        }
        return this._boardDescriptors.find((obj: any) => {
            return obj.vid === vendorId && 
                   (obj.pid === productId || 
                        (obj.pid.indexOf && obj.pid.indexOf(productId) >= 0));
        });
    }
}