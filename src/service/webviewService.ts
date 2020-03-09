import * as vscode from "vscode";
import CONSTANTS from "../constants";
import * as path from "path";



// Manages different type of webview
export class WebviewService{
    private tutorialPanel: vscode.WebviewPanel|undefined
    private context:vscode.ExtensionContext

    constructor(context:vscode.ExtensionContext){
        this.context = context
    }

    openTutorialPanel(){
        if(this.tutorialPanel){
            this.tutorialPanel.reveal(vscode.ViewColumn.Beside)
            
        }else{
            this.createTutorialPanel()
        }

    }
    private createTutorialPanel(){
        this.tutorialPanel = vscode.window.createWebviewPanel(
            CONSTANTS.WEBVIEW_TYPE.TUTORIAL,
            CONSTANTS.LABEL.WEBVIEW_PANEL,
            { preserveFocus: true, viewColumn: vscode.ViewColumn.Beside },
            {
                // Only allow the webview to access resources in our extension's media directory
                localResourceRoots: [
                    vscode.Uri.file(
                        path.join(
                            this.context.extensionPath,
                            CONSTANTS.FILESYSTEM.OUTPUT_DIRECTORY
                        )
                    ),
                ],
                enableScripts: true,
            }
        );
        this.tutorialPanel.webview.html=
        this.tutorialPanel.onDidDispose(()=>{
            this.disposeTutorialPanel()
        })

    }
    private disposeTutorialPanel(){
        this.tutorialPanel=undefined
    }
    private getHTMLContent(){
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">

          <title>${CONSTANTS.NAME}</title>
          </head>
        <body>
          <div id="root"></div>
    
          <script ></script>
          ${loadScript(context, "out/vendor.js")}
          ${loadScript(context, "out/simulator.js")}
        </body>
        </html>`;
    }
}