// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ExtensionContext, MessageItem, Uri, window } from "vscode";
import * as path from "path";
import { CONSTANTS, DialogResponses, USER_CODE_NAMES } from "../constants";
import { DependencyChecker } from "./dependencyChecker";

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
