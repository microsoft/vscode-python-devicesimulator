# Instructions on How to Set Up and Run our Code for Developers

## Dependencies

- Node

  - Download link : https://nodejs.org/en/download/

- Python 3.7.4 (or latest)

- Download link : https://www.python.org/downloads/
- **NOTE :** Make sure Python is in your path under an environment variable named `python` or `python3.7` (during installation or insert it manually afterwards)
- **NOTE :** Make sure pip is added to your environment variables as well
  (for example it could be found at : `c:\users\<...>\appdata\local\programs\python\python37\lib\site-packages\pip`)
- Run in a console `python -m pip install --upgrade pip`
    
* Python Modules
  - **Note:** On extension activation, you will be prompted with a popup asking if you want the modules to be automatically installed for you. The following python modules should be downloaded when you select "yes" on the prompt message.
    - pywin32 **(on Windows only)**
        - On Windows, you need to use the following command in the console to manually install pywin32: `pip install pywin32`
    - *playsound*
    - *pytest*
    - *python-socketio*
    - *requests*
    - *applicationinsights*

    *italics*: used in simulation mode only
* VS Code

* Python extension for VS Code (download from VS Code market place)

## Steps to Get Started Running the Extension Locally

1. Make sure you have all the dependencies installed (Node, Python, Playsound, VS Code, Python VS Code extension)

2. Open the repository

3. Open a terminal inside VS Code pointing to the code repository

4. Run the command : `npm install`

5. Run the command : `npm run compile`

6. Start running the extension locally by pressing F5 or going to VS Code Debug menu and select 'Start debugging'

## Notes on how to use it

- [Documentation to use the Extension](/docs/how-to-use.md)
- Debugging the extension opens a new VS Code window with the local build of the extension
- From the original VS Code window (opened in our repository) you can see outputs in the Debug Console
- In the new VS Code window, you can access the commands provided by the extension from the Commands Palette (Ctrl+Shift+P)
  listed as 'Device Simulator Express : ...'
- If you change some files you'll need to run the 'npm run compile' command again and restart debugging

## Formatting

- We use prettier to format the Typescript and CSS files, and we use black to format the Python files.
    - You will need to install them, if they are not installed already. This can be done by running the command: `npm install prettier` and `pip install black` respectively.
- To check that your files are formatted correctly, run the command: `npm run check`.
- To format your files correctly, run the command: `npm run format`.

## Repository Structure (important files)

- src
  - `adafruit_circuitplayground` : our mock library
  - `extension.ts` : our extension code
  - `process_user_code.py` : the file containing the code ran by the Python process spawned by the extension, responsible for running the user's code
  - `view` : React side
    - `components/`
    - `cpx/` and `Simulator.tsx` : contain the React components and objects to display and handle the simulator webview
    - `toolbar/` : contains the React components used in the toolbar and the modal.
    - `translation/en.json`: contains the constants that should be localized. To internationalize the extension you can add additional files with constants sharing the same id found in _en.json_, but with the translated values.
