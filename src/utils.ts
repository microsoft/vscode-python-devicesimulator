// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ExtensionContext, Uri } from "vscode";
import * as path from "path";
import { USER_CODE_NAMES } from "./constants";

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
  const fileName = filePath.substr(
    filePath.length - USER_CODE_NAMES.VALID_LENGTH,
    USER_CODE_NAMES.VALID_LENGTH
  );
  return (
    fileName === USER_CODE_NAMES.CODE_PY || fileName === USER_CODE_NAMES.CODE_PY
  );
};
