import * as vscode from 'vscode';
import * as fs from 'fs'

export interface IPackageJson {
    name?: string;
    version?: string;
    publisher?: string;
    instrumentationKey: string;
}

export default function getPackageInfo(context: vscode.ExtensionContext): { extensionName: string, extensionVersion: string, instrumentationKey: string } {
   let packageJson: IPackageJson;

   try {
       packageJson = JSON.parse(fs.readFileSync("../../package.json", "utf8"));
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