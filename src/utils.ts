// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ExtensionContext, Uri, MessageItem, window } from "vscode";
import * as path from "path";
import { USER_CODE_NAMES, DialogResponses, CONSTANTS } from "./constants";

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

export const showPrivacyModal = (okAction: () => void, privacyAction: () => void) => {
  window.showInformationMessage(
    `${CONSTANTS.INFO.REDIRECT}\n${CONSTANTS.INFO.THIRD_PARTY_WEBSITE}`,
    { modal: true },
    DialogResponses.OK,
    DialogResponses.PRIVACY_STATEMENT
  )
    .then((selection2: MessageItem | undefined) => {
      if (selection2 === DialogResponses.OK) {
        okAction();
      } else if (selection2 === DialogResponses.PRIVACY_STATEMENT) {
        privacyAction();
      }
    })
}
