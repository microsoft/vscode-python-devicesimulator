// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { validCodeFileName } from "./utils";
import { CONSTANTS } from "./constants";

export class SimulatorDebugConfigurationProvider
  implements vscode.DebugConfigurationProvider {
  constructor(private pathToScript: string) {}

  /**
   * Modify the debug configuration just before a debug session is being launched.
   */
  public resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    token?: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DebugConfiguration> {
    // Check config name
    if (config.name === CONSTANTS.DEBUG_CONFIGURATION_NAME) {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor) {
        const currentFilePath = activeTextEditor.document.fileName;

        // Check file type and name
        if (
          !(activeTextEditor.document.languageId === "python") ||
          !validCodeFileName(currentFilePath)
        ) {
          return vscode.window
            .showErrorMessage(CONSTANTS.ERROR.INVALID_FILE_NAME_DEBUG)
            .then(() => {
              return undefined; // Abort launch
            });
        }
        // Set process_user_code path as program
        config.program = this.pathToScript;
        // Set user's code path as args
        config.args = [currentFilePath];
        // Set rules
        config.rules = [
          { path: this.pathToScript, include: false },
          {
            module: "adafruit_circuitplayground",
            include: false
          },
          { module: "simpleaudio", include: false }
        ];
      }
    }
    // Abort / show error message if can't find process_user_code.py
    if (!config.program) {
      return vscode.window
        .showInformationMessage(CONSTANTS.ERROR.NO_PROGRAM_FOUND_DEBUG)
        .then(() => {
          return undefined; // Abort launch
        });
    }
    return config;
  }
}
