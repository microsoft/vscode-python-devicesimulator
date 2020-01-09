// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Credit: A majority of this code was taken from the Visual Studio Code Arduino extension with some modifications to suit our purposes.

import * as fs from "fs";
import * as path from "path";
import * as utils from "./extension_utils/utils";
import * as vscode from "vscode";
import { CPXWorkspace } from "./cpxWorkspace";
import CONSTANTS, { CPX_CONFIG_FILE } from "./constants";

export class DeviceContext implements vscode.Disposable {
    public static getInstance(): DeviceContext {
        return DeviceContext._deviceContext;
    }

    private static _deviceContext: DeviceContext = new DeviceContext();

    private _onDidChange = new vscode.EventEmitter<void>();
    private _watcher: vscode.FileSystemWatcher;
    private _vscodeWatcher: vscode.FileSystemWatcher;
    private _port!: string;
    private _device!: string;
    
    private constructor() {
        if (vscode.workspace && CPXWorkspace.rootPath) {
            this._watcher = vscode.workspace.createFileSystemWatcher(path.join(CPXWorkspace.rootPath, CPX_CONFIG_FILE));
            this._vscodeWatcher = vscode.workspace.createFileSystemWatcher(path.join(CPXWorkspace.rootPath, ".vscode"), true, true, false);

            // Reloads the config into the code if the cpx config file has changed
            this._watcher.onDidCreate(() => this.loadContext());
            this._watcher.onDidChange(() => this.loadContext());
            this._watcher.onDidDelete(() => this.loadContext());

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
                        console.error(CONSTANTS.ERROR.CPX_FILE_ERROR);
                    }
                } else {
                    this._port = null;
                    this._onDidChange.fire();
                }
                return this;
            }, (reason) => {
                this._port = null;
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
            vscode.window.showInformationMessage(CONSTANTS.INFO.CPX_JSON_ALREADY_GENERATED);
            return;
        } else {
            if (!CPXWorkspace.rootPath) {
                vscode.window.showInformationMessage(CONSTANTS.INFO.PLEASE_OPEN_FOLDER);
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

    public get device() {
        return this._device;
    }

    public set device(value: string) {
        this._device = value;
        this.saveContext();
    }
}