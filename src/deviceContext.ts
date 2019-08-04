import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as utils from "./utils";
import { CPX_CONFIG_FILE } from "./constants";
import { CPXWorkspace } from "./cpxWorkspace";

export class DeviceContext implements vscode.Disposable {
    public static getInstance(): DeviceContext {
        return DeviceContext._deviceContext;
    }

    private static _deviceContext: DeviceContext = new DeviceContext();

    private _onDidChange = new vscode.EventEmitter<void>();
    private _watcher: vscode.FileSystemWatcher;
    private _vscodeWatcher: vscode.FileSystemWatcher;
    private _port: string;
    
    private constructor() {
        if (vscode.workspace && CPXWorkspace.rootPath) {
            this._watcher = vscode.workspace.createFileSystemWatcher(path.join(CPXWorkspace.rootPath, CPX_CONFIG_FILE));
            this._vscodeWatcher = vscode.workspace.createFileSystemWatcher(path.join(CPXWorkspace.rootPath, ".vscode"), true, true, false);

            // reloads the config into the code if the cpx config file has changed
            this._watcher.onDidCreate(() => this.loadContext());
            this._watcher.onDidChange(() => this.loadContext());
            this._watcher.onDidDelete(() => this.loadContext());

            // uncomment after since i think the problem is that cpx.json isn't initialized and therefore can't be changed so the event handlers aren't
            // getting hit
            // this._port = "COM6"; // Will be changing the hardcoded

            this._vscodeWatcher.onDidDelete(() => this.loadContext());
        }

    }

    public loadContext(): Thenable<object> {
        return vscode.workspace.findFiles(CPX_CONFIG_FILE, null, 1)
            .then((files) => {
                let cpxConfigJson: any = {};
                if (files && files.length > 0) {
                    const configFile = files[0];
                    cpxConfigJson = utils.tryParseJSON(fs.readFileSync(configFile.fsPath, "utf8"));
                    if (cpxConfigJson) {
                        this._port = cpxConfigJson.port;
                        this._onDidChange.fire();
                    } else {
                        // Logger.notifyUserError("arduinoFileError", new Error(constants.messages.ARDUINO_FILE_ERROR));
                    }
                } else {
                    // this._port = null;
                    this._port = "COM6";
                    this._onDidChange.fire();
                }
                return this;
            }, (reason) => {
                // Workaround for change in API.
                // vscode.workspace.findFiles() for some reason now throws an error ehn path does not exist
                // vscode.window.showErrorMessage(reason.toString());
                // Logger.notifyUserError("arduinoFileUnhandleError", new Error(reason.toString()));

                 // Workaround for change in API, populate required props for arduino.json
                this._port = "COM6";
                // this._port = null;
                this._onDidChange.fire();

                return this;
            });
    }

    public saveContext() {
        if (!CPXWorkspace.rootPath) {
            return;
        }
        const cpxConfigFile = path.join(CPXWorkspace.rootPath, CPX_CONFIG_FILE);
        let cpxConfigJson: any = {};
        if (utils.fileExistsSync(cpxConfigFile)) {
            cpxConfigJson = utils.tryParseJSON(fs.readFileSync(cpxConfigFile, "utf8"));
        }
        if (!cpxConfigJson) {
            // log and notify user error
            return;
        }
        cpxConfigJson.port = this.port;

        utils.mkdirRecursivelySync(path.dirname(cpxConfigFile));
        fs.writeFileSync(cpxConfigFile, JSON.stringify(cpxConfigJson, (key, value) => {
            if (value === null) {
                return undefined;
            }
            return value;
        }, 4));
    }

    public dispose() {
        if (this._watcher) {
            this._watcher.dispose();
        }
        
        if (this._vscodeWatcher) {
            this._vscodeWatcher.dispose();
        }
    }

    public async initialize() {
        if (CPXWorkspace.rootPath && utils.fileExistsSync(path.join(CPXWorkspace.rootPath, CPX_CONFIG_FILE))) {
            // place into constants
            vscode.window.showInformationMessage("cpx.json is already generated.");
            return;
        } else {
            if (!CPXWorkspace.rootPath) {
                // place into constants
                vscode.window.showInformationMessage("Please open a folder first.");
                return;
            }
        }
    }


    public get onDidChange(): vscode.Event<void> {
        return this._onDidChange.event;
    }

    public get port() {
        return this._port;
    }

    public set port(value: string) {
        this._port = value;
        this.saveContext();
    }

}