# Instructions on How to Set Up and Run our Code for Developers

## Dependencies

- Node

  - Download link : https://nodejs.org/en/download/

- Python 3.7.4 (or latest)

  - Download link : https://www.python.org/downloads/
  - **NOTE :** Make sure Python is in your path under an environment variable named `python` (during installation or insert it manually afterwards)
  - **NOTE :** Make sure pip is added to your environment variables as well
    (for example it could be found at : `c:\users\<...>\appdata\local\programs\python\python37\lib\site-packages\pip`)
  - Run in a console `python -m pip install --upgrade pip`

- Playsound

  - Run the command in a console : `pip install playsound`

- pytest

  - Run the command in a console : `pip install pytest`

- Pywin32

  - Run the command in a console : `pip install pywin32`

- Python-Socketio

  - Run the command in a console : `pip install python-socketio`

- Application Insights

  - Run the command in a console : `pip install applicationinsights`

- Requests

  - Run the command in a console : `pip install requests`

- VS Code

- Python extension for VS Code (download from VS Code market place)

## Steps to Get Started Running the Extension in Debug Mode

1. Make sure you have all the dependencies installed (Node, Python, Playsound, VS Code, Python VS Code extension)

2. Open the repository

3. Open a terminal inside VS Code pointing to the code repository

4. Run the command : `npm install`

5. Run the command : `npm run compile`

6. Start debugging the extension by pressing F5 or going to VS Code Debug menu and select 'Start debugging'

## Notes on how to use it

- [Documentation to use the Extension](/docs/how-to-use.md)
- Debugging the extension opens a new VS Code window with the extension installed
- From the original VS Code window (opened in our repository) you can see outputs in the Debug Console
- In the new VS Code window, you can access the commands provided by the extension from the Commands Palette (Ctrl+Shift+P)
  listed as 'Pacifica : ...'
- If you change some files you'll need to run the 'npm run compile' command again and restart debugging

## Repository Structure (important files)

- src
  - `adafruit_circuitplayground` : our mock library
  - `extension.ts` : our extension code
  - `process_user_code.py` : the file containing the code ran by the Python process spawned by the extension, responsible for running the user's code
  - `view` : React side
    - `components/`
    - `cpx/` and `Simulator.tsx` : contain the React components and objects to display and handle the simulator webview
    - `toolbar/` : contains the React components used in the toolbar and the modal.
    - `translation/en.json`: contains the constants that should be localized. To internationalize the extension you can add additional files with constants sharing the same id found in _en.json_, but with the translated value.
