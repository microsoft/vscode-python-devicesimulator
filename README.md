# Project Pacifica

_Pacifica_ is a Visual Studio Code Extension that allows you to realize awesome microcontroller projects using use Python regardless if you have a device or not.
Start using CircuitPython for Adafruit Circuit Playground Express (CPX)! Never worry about not having your board in hand,
with Pacifica you can test your code anywhere and anytime and see the same result on the Simulator than
when you deploy it to your actual microcontroller!

## Features

- IntelliSense and syntax highlighting for Circuit Python code (only supports CPX library)
- Template file generation
- Integrated Python Debugging for the Simulator
- Serial monitor (available on Windows and Mac only)
- Output panel for the simulator
- Deployment to the physical device (if correctly formatted)
- Device Simulation for the Adafruit Circuit Playground Express board, including:
  - Green LED
  - Red LED
  - Push Buttons A and B
  - Slider Switch
  - Speaker: Play .wav file
  - 10 NeoPixels
  - Light sensor
  - Motion sensors
  - Acceleration detection
  - Board shake detection
  - Temperature sensor
  - 7 Capacitive Touch sensors

Some functionalities available on the board and/or the CPX library are not supported by our Simulator.
Code samples using these functionalities can still be deployed to the board using Pacifica:

- IR transmitter & Receiver
- Sound Sensor (microphone)
- Tone support
- Tap detection

## Prerequisites

The following dependencies are required to install before launching Pacifica.  
You will be prompted to install the Python dependencies during the first use.

- _**[Visual Studio Code](https://code.visualstudio.com/)**_
- _**[Node](https://nodejs.org/en/download/)**_
- _**[Python 3.7.4](https://www.python.org/downloads/)**_: Make sure you've added python and pip to your PATH to your environment variables. (1)
- _**[Python VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)**_: This will be installed automatically from the marketplace when you install Pacifica.
- _**Playsound**_  
  install by typing the following commands in a console : `pip install playsound`

- _**Pywin 32**_  
  install by typing the following commands in a console : `pip install pywin32`
- _**Python-Socketio**_  
   install by typing the following commands in a console : `pip install python-socketio`
- _**Requests**_  
   install by typing the following commands in a console : `pip install requests`
- _**Application Insights**_  
  install by typing the following commands in a console : `pip install applicationinsights`

## How to use

To use Pacifica, install the extension from the market place and reload VS Code.

### Start with the “New File” Command.

1. Type in “Pacifica: New File” in the command palette.
   `gif #1 for the keyboard short cut & select the New File command(DONE)`
2. Name and save your file somewhere, and we’re good to go!(2)
3. Start with some examples: you can find examples files and tutorials inside the comments,
   as well as in the notification pop up when you run the “New Project” Command.
   `[Static image #1 of the “New File” Command (DONE)]`

### Start from an existing python file instead.

1. Open the folder or your .py file in Visual Studio Code.
2. Run the `open Simulator` from the command palette or icon in the editor toolbar.

### Running your code on the simulator .

- Run the `Run Simulator` from the command palette or icon in the editor toolbar.
- You can use the `Play` or `Refresh` button on the simulator webview.

### Deploying code to the physical device

Before deploying the python code to your CPX device, you need to format your board following these tutorials:

1. Download the firmware with the .uf2 file (link : https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart)
2. Download the lastest version of the cpx library (link : https://learn.adafruit.com/welcome-to-circuitpython/circuitpython-libraries).  
   **_Note:_** Make sure you name your file main.py or code.py : the device automatically runs the first file that is likely named.

`[Static Image #2 showing this [DONE]]`

### Using the Serial Monitor for your Adafruit CPX device(Windows and Mac only)

1. Plug in your CPX device (make sure it’s formatted properly already)
2. Run the command `Device Simulator Express: Open Serial Monitor`
3. Select your baud rate the serial port
4. The print() statements in your code will show in the output console  
   `[gif#3 coming soon, after merged!]`

### Using the sensors in the Pacifica Simulator

Generating input for the sensors can be done by interacting directly with board on the webview
or by using the toolbar under the board.

- **Switch, push buttons and capacitive touch :** click directly on the corresponding element on the board or use the keybindings.
- **Temperature sensor, Light sensor, acceleration:** click on the corresponding button in the toolbar and change the value using the slider or the input box next attached to it.
- **Shake detection:** click on the motin sensor button in the toolbar and click on the shake button.

### Debug your project on the simulator

1. Add breakpoints in your code
2. Press F5 entering the debugging mode, and you can start debugging line by line!

## Commands

Pacifica provides serval commands in the Command Palette (F1 or Ctrl + Shift + P/ Cmd + Shift + P for Mac OS) for working with \*.py files:

- `Pacifica: New File:` Opens an unsaved .py file with template code, also open the simulator.
- `Pacifica: Open Simulator`: Opens the simulator in the webView
- `Pacifica: Run on Simulator`: Runs python code on the simulator
- `Pacifica: Deploy to Board`: Copies & Pastes the code.py or main.py file to CIRCUITPY drive if detected a CPX is plugged in
- `Pacifica: Open Serial Monitor`: Opens the serial monitor in the integrated output window.
- `Pacifica: Close Serial Monitor`: Stops the serial monitor and release the serial port.
- `Pacifica: Change Baud Rate`: Changes the baud rate of the selected serial port. For Adafruit CPX, the default baud rate is 115200.
- `Pacifica: Select Serial Port`: Changes the current serial port.

## Keybindings

In Pacifica, you can use keyboard to interact with the board:

- Push Button `A & B: A B`
- Capacitive Touch Sensor `A1 – A7: SHIFT + 1~7`
- Slider Switch: `SHIFT + S`
- Refresh the simulator: `SHIFT + R`

## Provide feedback

To report issues, provide feedback or requests, please use this link : [Provide Feedback](https://aka.ms/AA5xpxx).  
We would love to hear from your experience to keep improving our project.

## Privacy and Telemetry Notice

Our extension is collecting anonymous data about your usage of our features to help us improve our product. You can find the Privacy Notice here : [Data collection](PRIVACY.md), as well as instructions on how to turn it off.

## Third Party Notice

- [Third Party Notice](ThirdPartyNotices.txt)

## License

    Project Pacifica

    Copyright (c) Microsoft Corporation. All rights reserved.

    MIT License

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

## Notes

(1) Note: the easiest way to do it might be when you install Python, you can select the "Add to PATH" option directly. Otherwise you can search how to insert it manually, but make sure that when you type python in a terminal, the command is recognized and have the correct version.
