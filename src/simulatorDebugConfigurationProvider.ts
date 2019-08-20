// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as vscode from "vscode";
import {
  validCodeFileName,
  getServerPortConfig
} from "./extension_utils/utils";
import { CONSTANTS, DialogResponses } from "./constants";

let shouldShowInvalidFileNamePopup: boolean = true;

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
    // Check config type
    if (config.type === CONSTANTS.DEBUG_CONFIGURATION_TYPE) {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor) {
        const currentFilePath = activeTextEditor.document.fileName;

        // Check file type and name
        if (!(activeTextEditor.document.languageId === "python")) {
          return vscode.window
            .showErrorMessage(CONSTANTS.ERROR.INVALID_FILE_EXTENSION_DEBUG)
            .then(() => {
              return undefined; // Abort launch
            });
        } else if (
          !validCodeFileName(currentFilePath) &&
          shouldShowInvalidFileNamePopup
        ) {
          vscode.window
            .showInformationMessage(
              CONSTANTS.INFO.INVALID_FILE_NAME_DEBUG,
              ...[DialogResponses.DONT_SHOW, DialogResponses.MESSAGE_UNDERSTOOD]
            )
            .then((selection: vscode.MessageItem | undefined) => {
              if (selection === DialogResponses.DONT_SHOW) {
                shouldShowInvalidFileNamePopup = false;
              }
            });
        }
        // Set the new configuration type so the python debugger can take over
        config.type = "python";
        // Set process_user_code path as program
        config.program = this.pathToScript;
        // Set user's code path and server's port as args
        config.args = [currentFilePath, getServerPortConfig().toString()];
        // Set rules
        config.rules = [
          { path: this.pathToScript, include: false },
          {
            module: "adafruit_circuitplayground",
            include: false
          },
          { module: "playsound", include: false }
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
