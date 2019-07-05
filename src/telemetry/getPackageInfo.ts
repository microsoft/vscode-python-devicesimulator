import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path';

export interface IPackageJson {
    name?: string;
    version?: string;
    publisher?: string;
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
       // Throw an error
       console.error();
       throw error;
   }

   const extensionName: string | undefined = packageJson.name;
   const extensionVersion: string | undefined = packageJson.version;
   const publisher: string | undefined = packageJson.publisher;
   const instrumentationKey: string | undefined = packageJson.instrumentationKey;

   if (!extensionName) {
       throw new Error('Extension\'s package.json is missing instrumentation key.');
   }

   if (!extensionVersion) {
       throw new Error('Extension\'s package.json is missing version.');
   }

   if (!publisher) {
       throw new Error('Extension\'s package.json is missing publisher.');
   }

   if (!extensionVersion) {
       throw new Error('Extension\'s package.json is missing version.');
   }
   
   return { extensionName, extensionVersion, instrumentationKey };
}