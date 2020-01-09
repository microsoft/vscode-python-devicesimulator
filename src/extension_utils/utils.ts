// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { DependencyChecker } from "./dependencyChecker";
import { DeviceContext } from "../deviceContext";
import * as vscode from "vscode";
import {
  CONFIG,
  CONSTANTS,
  CPX_CONFIG_FILE,
  DialogResponses,
  USER_CODE_NAMES,
  SERVER_INFO
} from "../constants";
import { CPXWorkspace } from "../cpxWorkspace";
import * as cp from "child_process";
import * as util from "util";
const exec = util.promisify(cp.exec);

// tslint:disable-next-line: export-name
export const getPathToScript = (
  context: vscode.ExtensionContext,
  folderName: string,
  fileName: string
) => {
  const onDiskPath = vscode.Uri.file(
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
  vscode.window
    .showInformationMessage(
      `${CONSTANTS.INFO.THIRD_PARTY_WEBSITE}: ${CONSTANTS.LINKS.PRIVACY}`,
      DialogResponses.AGREE_AND_PROCEED,
      DialogResponses.CANCEL
    )
    .then((privacySelection: vscode.MessageItem | undefined) => {
      if (privacySelection === DialogResponses.AGREE_AND_PROCEED) {
        okAction();
      } else if (privacySelection === DialogResponses.CANCEL) {
        // do nothing
      }
    });
};

export const logToOutputChannel = (
  outChannel: vscode.OutputChannel | undefined,
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
  } catch (exception) {}

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
export function padStart(
  sourceString: string,
  targetLength: number,
  padString?: string
): string {
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
  const cpxConfigFilePath: string = path.join(
    CPXWorkspace.rootPath,
    CPX_CONFIG_FILE
  );
  mkdirRecursivelySync(path.dirname(cpxConfigFilePath));
  fs.writeFileSync(cpxConfigFilePath, JSON.stringify(cpxJson, null, 4));
}
export const checkPythonDependency = async () => {
  const dependencyChecker: DependencyChecker = new DependencyChecker();
  const result = await dependencyChecker.checkDependency(
    CONSTANTS.DEPENDENCY_CHECKER.PYTHON
  );
  return result.payload;
};

export const checkPipDependency = async () => {
  const dependencyChecker: DependencyChecker = new DependencyChecker();
  const result = await dependencyChecker.checkDependency(
    CONSTANTS.DEPENDENCY_CHECKER.PIP3
  );
  return result.payload;
};

export const setPythonExectuableName = async () => {
  // Find our what command is the PATH for python
  let executableName: string = "";
  const dependencyCheck = await checkPythonDependency();
  if (dependencyCheck.installed) {
    executableName = dependencyCheck.dependency;
  } else {
    vscode.window
      .showErrorMessage(
        CONSTANTS.ERROR.NO_PYTHON_PATH,
        DialogResponses.INSTALL_PYTHON
      )
      .then((selection: vscode.MessageItem | undefined) => {
        if (selection === DialogResponses.INSTALL_PYTHON) {
          const okAction = () => {
            open(CONSTANTS.LINKS.DOWNLOAD_PYTHON);
          };
          showPrivacyModal(okAction);
        }
      });
  }

  return executableName;
};

export const addVisibleTextEditorCallback = (
  currentPanel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): vscode.Disposable => {
  const initialPythonEditors = filterForPythonFiles(
    vscode.window.visibleTextEditors
  );
  currentPanel.webview.postMessage({
    command: "visible-editors",
    state: { activePythonEditors: initialPythonEditors }
  });
  return vscode.window.onDidChangeVisibleTextEditors(
    (textEditors: vscode.TextEditor[]) => {
      const activePythonEditors = filterForPythonFiles(textEditors);
      currentPanel.webview.postMessage({
        command: "visible-editors",
        state: { activePythonEditors }
      });
    },
    {},
    context.subscriptions
  );
};

export const filterForPythonFiles = (textEditors: vscode.TextEditor[]) => {
  return textEditors
    .filter(editor => editor.document.languageId === "python")
    .map(editor => editor.document.fileName);
};

export const getActiveEditorFromPath = (
  filePath: string
): vscode.TextDocument => {
  const activeEditor = vscode.window.visibleTextEditors.find(
    (editor: vscode.TextEditor) => editor.document.fileName === filePath
  );
  return activeEditor ? activeEditor.document : undefined;
};

export const getServerPortConfig = (): number => {
  // tslint:disable: no-backbone-get-set-outside-model prefer-type-cast
  if (
    vscode.workspace
      .getConfiguration()
      .has(SERVER_INFO.SERVER_PORT_CONFIGURATION)
  ) {
    return vscode.workspace
      .getConfiguration()
      .get(SERVER_INFO.SERVER_PORT_CONFIGURATION) as number;
  }
  return SERVER_INFO.DEFAULT_SERVER_PORT;
};

export const checkConfig = (configName: string): boolean => {
  return vscode.workspace.getConfiguration().get(configName) === true;
};

// >>>>>>>>>>>>>>  Remove dependency check here?
//
export const checkPythonDependencies = async (context: vscode.ExtensionContext, pythonExecutable: string) => {
  let hasInstalledDependencies: boolean = false;
  // if (checkPipDependency() && checkPythonDependency()) {
  //   if (checkConfig(CONFIG.SHOW_DEPENDENCY_INSTALL)) {
  //     hasInstalledDependencies = await promptInstallPythonDependencies(context, pythonExecutable);
  //     if (hasInstalledDependencies) {
  //       await vscode.workspace
  //         .getConfiguration()
  //         .update(CONFIG.SHOW_DEPENDENCY_INSTALL, false);
  //     }
  //   }
  // } else {
  //   hasInstalledDependencies = false;
  // }
  hasInstalledDependencies = true;
  return hasInstalledDependencies;
};

export const promptInstallPythonDependencies = (context: vscode.ExtensionContext, pythonExecutable: string) => {
  return vscode.window.showInformationMessage(
    CONSTANTS.INFO.INSTALL_PYTHON_DEPENDENCIES,
    DialogResponses.YES,
    DialogResponses.NO)
    .then((selection: vscode.MessageItem | undefined) => {
      if (selection === DialogResponses.YES) {
        return installPythonDependencies(context, pythonExecutable);
      } else if (selection === DialogResponses.NO) {
        return vscode.window.showInformationMessage(
          CONSTANTS.INFO.ARE_YOU_SURE,
          DialogResponses.INSTALL_NOW,
          DialogResponses.DONT_INSTALL
        ).then((installChoice: vscode.MessageItem | undefined) => {
          if (installChoice === DialogResponses.INSTALL_NOW) {
            return installPythonDependencies(context, pythonExecutable);
          } else {
            return false;
          }
        })
      }
    });
  // return true;
};
export const getTelemetryState = () => {
  return vscode.workspace
    .getConfiguration()
    .get("telemetry.enableTelemetry", true);
};

export const installPythonDependencies = async (context: vscode.ExtensionContext, pythonExecutable: string) => {
  let installed: boolean = false;
  try {
    vscode.window.showInformationMessage(CONSTANTS.INFO.INSTALLING_PYTHON_DEPENDENCIES);
    const requirementsPath: string = getPathToScript(context, "out", "requirements.txt");
    const pathToLibs: string = getPathToScript(context, "out", "python_libs");
    const { stdout } = await exec(`${pythonExecutable} -m pip install -r ${requirementsPath} -t ${pathToLibs}`);
    console.info(stdout);
    installed = true;
    vscode.window.showInformationMessage(CONSTANTS.INFO.SUCCESSFUL_INSTALL);
  } catch (err) {
    console.error(err);
    installed = false;
  }
  return installed
}
