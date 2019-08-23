# Project Pacifica

Make without limit! Pacifica, a Microsoft Garage project, allows you to code in CircuitPython for your awesome
Circuit Playground Express (CPX) projects! Test and debug your code on the device simulator and see the same
result when you plug in your actual microcontroller. Curious about the output of the device, the serial
monitor allows you to observe the device output.

![](assets/readmeFiles/cpx.jpg?raw=true)

## Features

- IntelliSense and syntax highlighting for CircuitPython code (only supports CPX Express library)
- Template file generation
- Integrated Python Debugging for the Simulator
- Serial monitor (available on Windows and Mac only)
- Output panel for the simulator
- Deploy CircuitPython code to the physical device.
- Simulation of the Adafruit Circuit Playground Express device, including:
  - Green LED
  - Red LED
  - Push Buttons A and B
  - Slider Switch
  - Speaker: Play .wav file
  - 10 NeoPixels
  - Light sensor
  - Motion sensors
  - Acceleration detection
  - Device shake detection
  - Temperature sensor
  - 7 Capacitive Touch sensors

The simulator supports most of the sensors on CPX except **IR transmitter & Receiver**, **Sound Sensor (microphone)**, **Speaker (Play Tone)** and the **“tap” on Motion Sensor**.
The code related to these sensors can still run on the actual CPX board and be deployed using Pacifica.  
As we only support CPX library now, other libraries (i.e. simpleio) can’t run on the simulator. But they will work on the actual device!

## Prerequisites

The following dependencies are required to install before launching Pacifica.  
You will be prompted to install the Python dependencies during the first use.

- _**[Visual Studio Code](https://code.visualstudio.com/)**_
- _**[Node](https://nodejs.org/en/download/)**_
- _**[Python 3.7.4](https://www.python.org/downloads/)**_: Make sure you've added python and pip to your PATH in your environment variables. (1)
- _**[Python VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)**_: This will be installed automatically from the marketplace when you install Pacifica.

The following dependecies can be installed for you by the extension by clicking yes when you are prompted to (**except** `pywin32` which is needed only on Windows platform). (2)

- _**Playsound**_  
  install by typing the following commands in a console: `pip install playsound`

- _**Pywin 32**_  
  install by typing the following commands in a console (only for Windows computers, you must run it manually): `pip install pywin32`
- _**Python-Socketio**_  
   install by typing the following commands in a console: `pip install python-socketio`
- _**Requests**_  
   install by typing the following commands in a console: `pip install requests`
- _**Application Insights**_  
  install by typing the following commands in a console: `pip install applicationinsights`

## Useful Links

- Tutorials and Example Code for Adafruit CPX:
  - Adafruit CPX library tutorial: (https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library)
  - Adafruit CPX Examples on GitHub: (https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples)
  - Adafruit CPX Guided Tour (Intro for the Hardware) (https://learn.adafruit.com/adafruit-circuit-playground-express/guided-tour)
- Format Adafruit CPX device:
  - Tutorial for formatting Adafruit CPX for CircuitPython (https://learn.adafruit.com/welcome-to-circuitpython/installing-circuitpython)
  - Download Firmware .uf2 file (https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart)
  - Download the latest version of the Adafruit CPX library (link: https://learn.adafruit.com/welcome-to-circuitpython/circuitpython-libraries)

## How to use

To use Pacifica, install the extension from the marketplace and reload VS Code.

### 1. Start with the “New File” Command.

1. Type in “Pacifica: New File” in the command palette(`CTRL+SHIFT+P`to open the command palette).  
   ![](assets/readmeFiles/newFile.gif?raw=true)
2. Name and save your file somewhere, and we’re good to go!(3)
3. Start with some examples: you can find examples files and tutorials inside the comments,
   as well as in the notification pop up when you run the `“Pacifica: New File”` Command.

![](assets/readmeFiles/findExamples.jpg?raw=true)

### 2. Start from an existing python file.

1. Open the folder or your .py file in Visual Studio Code.
2. Run `open Simulator` from the command palette or icon in the editor toolbar.

### 3. Run your code on the simulator .

![](assets/readmeFiles/run.gif?raw=true)

- Run `Run Simulator` from the command palette or icon in the editor toolbar.
- You can use the `Play` or `Refresh` button on the simulator webview.

### 4. Deploy your code to the physical device

Before deploying the python code to your CPX device, you need to format your device following these tutorials:

1. Download the firmware with the .uf2 file (link: https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart)
2. Download the lastest version of the cpx library (link: https://learn.adafruit.com/welcome-to-circuitpython/circuitpython-libraries).  
   **_Note:_** Make sure you name your file main.py or code.py: the device automatically runs the first file that is likely named.

![](assets/readmeFiles/deployToBoard.png?raw=true)

### 5. Use the Serial Monitor for your Adafruit CPX device(available Windows and Mac only)

1. Plug in your CPX device (make sure it’s formatted properly already)
2. Run the command `Device Simulator Express: Open Serial Monitor`
3. Select your baud rate for the serial port
4. The print() statements in your code will show in the output console

### 6. Use the sensors in the Pacifica Simulator

Generating input for the sensors can be done by interacting directly with device on the webview
or by using the toolbar.

![](assets/readmeFiles/slider_basedSensor.gif?raw=true) ![](assets/readmeFiles/otherSensors.gif?raw=true)

- **Switch, push buttons and capacitive touch:** click directly on the corresponding element on the device or use the keybindings.
- **Temperature sensor, Light sensor, acceleration:** click on the corresponding button in the toolbar and change the value using the slider or the input box attached to it.
- **Shake detection:** go to the motion sensor section in the toolbar and click on the shake button.

### 7. Debug your project on the simulator

1. Add breakpoints in your code
2. Press F5 to enter the debugging mode, and you can start debugging line by line!

## Commands

Pacifica provides several commands in the Command Palette (F1 or Ctrl + Shift + P/ Cmd + Shift + P for Mac OS) for working with \*.py files:

- `Pacifica: New File`: Opens an unsaved .py file with template code, also open the simulator.
- `Pacifica: Open Simulator`: Opens the simulator in the webView
- `Pacifica: Run on Simulator`: Runs python code on the simulator
- `Pacifica: Deploy to Board`: Copies & Pastes the code.py or main.py file to CIRCUITPY drive if detected a CPX is plugged in
- `Pacifica: Open Serial Monitor`: Opens the serial monitor in the integrated output window.
- `Pacifica: Close Serial Monitor`: Stops the serial monitor and releases the serial port.
- `Pacifica: Change Baud Rate`: Changes the baud rate of the selected serial port. For Adafruit CPX, the default baud rate is 115200.
- `Pacifica: Select Serial Port`: Changes the current serial port.

## Keybindings

In Pacifica, you can use keyboard to interact with the device:

- Push Button `A & B: A B`
- Capacitive Touch Sensor `A1 – A7: SHIFT + 1~7`
- Slider Switch: `SHIFT + S`
- Refresh the simulator: `SHIFT + R`

## Provide feedback

To report issues, provide feedback or requests, please use this link: [Provide Feedback](https://aka.ms/AA5xpxx).  
We would love to hear from you about your experience to keep improving our project.

## Privacy and Telemetry Notice

Our extension is collecting anonymous data about your usage of our features to help us improve our product. You can find the Privacy Notice here: [Data collection](PRIVACY.md), as well as instructions on how to turn it off.

## Third Party Notice

- [Third Party Notice](ThirdPartyNotices.txt)

## Troubleshooting Tips

- The first time you install the extension, you'll need to execute the `run` command at least once in order to access auto-completion.
- While running a code file, if you get an error saying it can't find the file, make sure you've clicked on a valid Python code file before running it.
- To open the output panel again after closing it go to VS Code menu: `View->Output`.
- If you have pylint enabled, it might underline the import of the adafruit_circuitplayground library, but it will work correctly.
- If you try to deploy to the device while it's plugged in but you still get an error saying it cannot find the board, make sure your Circuit Playground Express is formatted correctly and that its name matches `CIRCUITPY`.
- If you can't get the Simulator communication working while debugging, try to open your `Settings` and check the port used under `'Pacifica: Debugger Server Port'`. You can either change it (usually ports above 5000 should work) or try to free it, then start debugging again.
- When you are using the serial monitor, if you get some unusual error messages, unplug the device and reload the VS Code windows.

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

(1) Note: the easiest way to do it is to select the "Add to PATH" option directly when you install Python. Otherwise you can search how to insert it manually, but make sure that when you type _python_ in a terminal, the command is recognized and have the correct version.
(2) You can chose to see to see the prompt or not by changing the extension configirations.
(3) To be able to run the file from your physical device, it should either be named code.py or main.py.
