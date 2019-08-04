import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as utils from "./utils";
import { SerialMonitor } from "./serialMonitor";

export class UsbDetector {
    public static getInstance(): UsbDetector {
        if (!UsbDetector._instance) {
            UsbDetector._instance = new UsbDetector();
        }
        return UsbDetector._instance;
    }

    private static _instance: UsbDetector;

    private _usbDetector;

    private _boardDescriptors = null;

    private _extensionRoot = null;

    private constructor() { }

    public initialize(extensionRoot: string) {
        this._extensionRoot = extensionRoot;
    }

    public async startListening() {
        // todo need to change later to see if user allows usb detection
        const enableUSBDetection = true;
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

        this._usbDetector.on("add", async (device) => {
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
                // log that a board was detected
                // if (!ArduinoContext.initialized) {
                //     await ArduinoActivator.activate();
                // } 
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
            const boardIndexes = JSON.parse(fileContent);
            boardIndexes.forEach(boardIndex => {
                boardIndex.boards.forEach(board => {
                    board.indexFile = boardIndex.index_file
                });
                this._boardDescriptors = this._boardDescriptors.concat(boardIndex.boards);
            });
        }
        return this._boardDescriptors.find((obj) => {
            return obj.vid === vendorId && 
                   (obj.pid === productId || 
                        (obj.pid.indexOf && obj.pid.indexOf(productId) >= 0));
        });
    }
}