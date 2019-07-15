# Instructions on How to Set Up and Run our Code for Developers

## Dependencies

- Node

  - Download link : https://nodejs.org/en/download/

- Python 3.7.4 (or latest)

  - Download link : https://www.python.org/downloads/
  - **NOTE :** Make sure Python is in your path under an environment variable named `python` (during installation or insert it manually afterwards)
  - **NOTE :** Make sure pip is added to your environment variables as well
    (for example it could be find at : c:\users\<alias>\appdata\local\programs\python\python37\lib\site-packages\pip)
  - Run in a console `python -m pip install --upgrade pip`

- Simpleaudio

  - Run the command in a console : `pip install simpleaudio`
    - NOTE : If the installation doesn't work, you might need to make sure C++ 2015 build tools are installed
      (Link to download : https://visualstudio.microsoft.com/vs/older-downloads under
      'Redistributables and Build tools' : 'Microsoft Build Tools 2015')

- Pywin32

  - Run the command in a console : `pip install pywin32`

- VS Code

- Python extension for VS Code (download from VS Code market place)

## Steps to Get Started Running the Extension in Debug Mode

1. Make sure you have all the dependencies installed (Node, Python, simpleaudio, VS Code, Python VS Code extension)

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
  listed as 'Adafruit : ...'
- If you change some files you'll need to run the 'npm run compile' command again and restart debugging

## Repository Structure (important files)

- src
  - `adafruit_circuitplayground` : our mock library
  - `extension.ts` : our extension code
  - `process_user_code.py` : the file containing the code ran by the Python process spawned by the extension, responsible for running the user's code
  - `view` : React side
    - `components/`
    - `cpx/` and `Simulator.tsx` : contain the React components and objects to display and handle the simulator webview
