import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path';

export interface IPackageJson {
    name?: string;
    version?: string;
    instrumentationKey: string;
}

const getPackagePath = (context: vscode.ExtensionContext) => {
    const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, "package.json")
    );
    const packagePath = onDiskPath.with({ scheme: "vscode-resource" });

    return packagePath; 
}

export default function getPackageInfo(context: vscode.ExtensionContext): { extensionName: string, extensionVersion: string, instrumentationKey: string } {
   let packageJson: IPackageJson;
   const packagePath = getPackagePath(context); 

   try {
       packageJson = JSON.parse(fs.readFileSync(packagePath.fsPath, "utf8"));
   } catch (error) {
       console.error(`Failed to read from package.json: ${error}`);
       throw new Error(`Failed to read from package.json: ${error}`);
   }

   const extensionName: string | undefined = packageJson.name;
   const extensionVersion: string | undefined = packageJson.version;
   const instrumentationKey: string | undefined = packageJson.instrumentationKey;

   if (!extensionName) {
       throw new Error('Extension\'s package.json is missing instrumentation key.');
   }

   if (!extensionVersion) {
       throw new Error('Extension\'s package.json is missing version.');
   }

   if (!extensionVersion) {
       throw new Error('Extension\'s package.json is missing version.');
   }
   
   return { extensionName, extensionVersion, instrumentationKey };
}