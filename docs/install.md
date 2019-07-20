# Instructions on How to Install and Run the Extension

## Steps to manually install the extension

1. Link to the latest releases :
   [Releases](https://github.com/microsoft/vscode-python-embedded/releases)
2. Click on the latest release
3. At the bottom of the page download the .vsix file
4. To install the .vsix file :
   - Go to the directory where the downloaded vsix file is and run in a command console: `code --install-extension <vsix file name>`
   - Or in VS Code, go to the extension tab (a), in menu (b) select 'Install from VSIX' (c) and search the file you downloaded
     ![VSIX Install Instructions](./vsix-install-instructions.png)

## Prerequisites

- [VS Code](https://code.visualstudio.com/Download)
- [Node](https://nodejs.org/en/download/)
- [Python 3.7.4 (or latest)](https://www.python.org/downloads/)
- Python VS Code extension (download from VS Code Marketplace)
- Playsound :
  - `python -m pip install --upgrade pip`
  - `pip install playsound`
- Pywin32 : `pip install pywin32`

## How to use the extension

- [How to use the Extension](/docs/how-to-use.md)
