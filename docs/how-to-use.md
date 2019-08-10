# How to use the Extension

Commands are accessible through :

- **The command palette** (`Ctrl+shift+P` or `View->Command Palette`) and type 'Pacifica : `command_name`'
- **The extension buttons** available on the top right of the Text Editor Panel when you have a Python file open

## Available commands

- **Open Simulator** : opens the webview of the simulator.

- **New Project** : opens an unsaved file with links to help you and a code snippet that you can save as `code.py` / `main.py`.  
  _(**Note :** will open the simulator webview if it's not open yet)_.

- **Run Simulator** : run the code you have open on the simulator (make sure you've clicked on a valid code file).  
  _(**Note :** will open the simulator webview if it's not open yet)_.

- **Deploy to Device** : saves the code to a Circuit Playground Express.  
  _(**Note :** the board needs to be correctly formatted to a `CIRCUITPY` drive first if it's not the case : [Installing CircuitPython](https://learn.adafruit.com/welcome-to-circuitpython/installing-circuitpython))_.

## Available features

- We currently support the [Adafruit Circuit Playground Express board](https://www.adafruit.com/product/3333)
- Access to auto-completion and Python error flagging
- Output panel for the simulator (without print statements)
- Deploy to the physical device (if correctly formatted)
- Device's features :
  - NeoPixels
  - Buttons (A & B)
  - Sound - .wav files
  - Red LED
  - Switch
  - Green LED
  - Temperature sensor

## Not supported yet

- User print statements
- Auto-detect/format the device
- Serial monitor for the device
- Debugger for the simulator
- Device's features
  - Light sensor
  - Motion sensors
  - Sound sensor
  - Touch sensors
  - Sound - tones
  - IR transmitter

## Troubleshooting Tips

- The first time you install the extension, you'll need to execute the `run` command at least once in order to access auto-completion.
- While running a code file, if you get an error saying it can't find the file, make sure you've clicked on a valid Python code file before running it.
- To open the output panel again after closing it go to VS Code menu : `View->Output`.
- If you have pylint enabled, it might underline the import of the adafruit_circuitplayground library, but it will work correctly.
- If you try to deploy to the device while it's plugged in but you still get an error saying it cannot find the board, make sure your Circuit Playground Express is formatted correctly and that its name matches `CIRCUITPY`.
