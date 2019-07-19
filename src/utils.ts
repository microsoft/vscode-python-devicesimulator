// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ExtensionContext, MessageItem, Uri, window } from "vscode";
import * as path from "path";
import { CONSTANTS, DialogResponses, USER_CODE_NAMES } from "./constants";

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
    DialogResponses.ACCEPT_PRIVACY
  )
    .then((privacySelection: MessageItem | undefined) => {
      if (privacySelection === DialogResponses.ACCEPT_PRIVACY) {
        okAction();
      }
    })
}
