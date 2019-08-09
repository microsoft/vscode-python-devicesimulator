// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as fs from "fs";
import * as path from "path";
import { DependencyChecker } from "./dependencyChecker";
import { DeviceContext } from "../deviceContext";
import { ExtensionContext, MessageItem, OutputChannel, Uri, window } from "vscode";
import { CONSTANTS, CPX_CONFIG_FILE, DialogResponses, USER_CODE_NAMES } from "../constants";

// tslint:disable-next-line: export-name
export const getPathToScript = (
  context: ExtensionContext,
  folderName: string,
  fileName: string
) => {
  const onDiskPath = Uri.file(
    path.join(context.extensionPath, folderName, fileName)
  );
  const scriptPath = onDiskPath.with({ scheme: "vscode-resource" });
  return scriptPath.fsPath;
};

export const validCodeFileName = (filePath: string) => {
  return (
    filePath.endsWith(USER_CODE_NAMES.CODE_PY) ||
    filePath.endsWith(USER_CODE_NAMES.MAIN_PY)
  );
};

export const showPrivacyModal = (okAction: () => void) => {
  window.showInformationMessage(
    `${CONSTANTS.INFO.THIRD_PARTY_WEBSITE} ${CONSTANTS.LINKS.PRIVACY}`,
    DialogResponses.MESSAGE_UNDERSTOOD
  )
    .then((privacySelection: MessageItem | undefined) => {
      if (privacySelection === DialogResponses.MESSAGE_UNDERSTOOD) {
        okAction();
      }
    })
}

export const logToOutputChannel = (
  outChannel: OutputChannel | undefined,
  message: string,
  show: boolean = false
): void => {
  if (outChannel) {
    if (show) {
      outChannel.show(true);
    }
    outChannel.append(message);
  }
};

export function tryParseJSON(jsonString: string): any | boolean {
  try {
    const jsonObj = JSON.parse(jsonString);
    if (jsonObj && typeof jsonObj === "object") {
        return jsonObj;
    }
  } catch (exception) { }

  return false;
}

export function fileExistsSync(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

export function mkdirRecursivelySync(dirPath: string): void {
  if (directoryExistsSync(dirPath)) {
    return;
  }
  const dirname = path.dirname(dirPath);
  if (path.normalize(dirname) === path.normalize(dirPath)) {
    fs.mkdirSync(dirPath);
  } else if (directoryExistsSync(dirname)) {
    fs.mkdirSync(dirPath);
  } else {
    mkdirRecursivelySync(dirname);
    fs.mkdirSync(dirPath);
  }
}

export function directoryExistsSync(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * This method pads the current string with another string (repeated, if needed)
 * so that the resulting string reaches the given length.
 * The padding is applied from the start (left) of the current string.
 */
export function padStart(sourceString: string, targetLength: number, padString?: string): string {
  if (!sourceString) {
      return sourceString;
  }

  if (!(String.prototype as any).padStart) {
      // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
      padString = String(padString || " ");
      if (sourceString.length > targetLength) {
          return sourceString;
      } else {
          targetLength = targetLength - sourceString.length;
          if (targetLength > padString.length) {
              padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
          }
          return padString.slice(0, targetLength) + sourceString;
      }
  } else {
      return (sourceString as any).padStart(targetLength, padString);
  }
}

export function convertToHex(num: number, width = 0): string {
  return padStart(num.toString(16), width, "0");
}

export function generateCPXConfig(): void {
  const deviceContext: DeviceContext = DeviceContext.getInstance();
  const cpxJson = {
    port: deviceContext.port
  };
  const cpxConfigFilePath: string = CPX_CONFIG_FILE;
  mkdirRecursivelySync(path.dirname(cpxConfigFilePath));
  fs.writeFileSync(cpxConfigFilePath, JSON.stringify(cpxJson, null, 4));
}
export const checkPythonDependency = async () => {
  const dependencyChecker: DependencyChecker = new DependencyChecker();
  const result = await dependencyChecker.checkDependency(CONSTANTS.DEPENDENCY_CHECKER.PYTHON);
  return result.payload;
}

export const setPythonExectuableName = async () => {
  // Find our what command is the PATH for python
  let executableName: string = "";
  const dependencyCheck = await checkPythonDependency();
  if (dependencyCheck.installed) {
    executableName = dependencyCheck.dependency;
  } else {
    window.showErrorMessage(CONSTANTS.ERROR.NO_PYTHON_PATH,
      DialogResponses.INSTALL_PYTHON)
      .then((selection: MessageItem | undefined) => {
        if (selection === DialogResponses.INSTALL_PYTHON) {
          const okAction = () => {
            open(CONSTANTS.LINKS.DOWNLOAD_PYTHON);
          };
          showPrivacyModal(okAction);
        }
      });
  }

  return executableName;
}
