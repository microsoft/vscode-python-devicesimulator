# Device Simulator Express, a Microsoft Garage project

<a href='https://www.python.org/downloads/'><img src='https://img.shields.io/badge/Python-3.7%2B-blue.svg' alt='Python versions: 3.7+' /></a> <img src='https://img.shields.io/badge/VS%20Code-v1.43+-blue' alt='VS Code version 1.43'> <img src='https://www.repostatus.org/badges/latest/active.svg' alt='Project Status: Active – The project has reached a stable, usable state and is being actively developed.' /> <a href='LICENSE'><img src='https://img.shields.io/badge/license-MIT-blue.svg' alt='License: We are using the MIT License'></a> <a href='CONTRIBUTING.md'><img src='https://img.shields.io/badge/PRs-Welcome-brightgreen.svg' alt='We are welcoming PRS!'></a> <img src='https://img.shields.io/badge/platform-win%20%7C%20osx-lightgrey.svg' alt='Platforms Supported: Windows, MacOSX'/>

<a href='https://microsoftgarage.visualstudio.com/002806e2-ebaa-4672-9d2e-5fe5d29154ef/_boards/board/t/227906bb-31ac-4b07-8626-3d757754a616/Microsoft.RequirementCategory/'><img src='https://microsoftgarage.visualstudio.com/002806e2-ebaa-4672-9d2e-5fe5d29154ef/227906bb-31ac-4b07-8626-3d757754a616/_apis/work/boardbadge/73f82653-3da1-4a6f-bb79-c91c9eecec28' alt='Azure DevOps Board Badge' /></a>

Make without limit! Device Simulator Express, a Microsoft Garage project, allows you to code microcontrollers without the hardware on hand! You can program your Adafruit Circuit Playground Express (CPX), your BBC micro:bit or the Adafruit CLUE! Test and debug your code on the device simulator and see the same
result when you plug in your actual microcontroller. Curious about the output of the device, the serial
monitor allows you to observe the device output.

## Table of Contents
  - [Devices we support](#devices-we-support)
  - [Prerequisites](#prerequisites)
  - [Adafruit Circuit Playground Express (CPX) Simulator](#adafruit-circuit-playground-express-cpx-simulator)
    - [Features](#features)
    - [Useful Links](#useful-links)
    - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [BBC micro:bit Simulator](#bbc-microbit-simulator)
    - [Features](#features-1)
    - [Useful Links](#useful-links-1)
    - [Keyboard Shortcuts](#keyboard-shortcuts-1)
  - [Adafruit CLUE Simulator](#adafruit-clue-simulator)
    - [Features](#features-2)
    - [Useful Links](#useful-links-2)
    - [Keyboard Shortcuts](#keyboard-shortcuts-2)
  - [How to use](#how-to-use)
    - [Commands](#commands)
  - [Contribute](#contribute)
  - [Provide feedback](#provide-feedback)
  - [Privacy and Telemetry Notice](#privacy-and-telemetry-notice)
  - [Third Party Notice](#third-party-notice)
  - [Troubleshooting Tips](#troubleshooting-tips)
  - [License](#license)
  - [Notes](#notes)
  
## Devices we support

-   [**Adafruit Circuit Playground Express (CPX)**](#adafruit-circuit-playground-express-cpx-simulator)

    [<img alt='CircuitPlayground Express' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/cpx/cpx-img.png'>](#adafruit-circuit-playground-express-cpx-simulator)

-   [**BBC micro:bit**](#bbc-microbit-simulator)

    [<img alt='bbc micro:bit' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/microbit/microbit.png'>](#bbc-microbit-simulator)

-   [**Adafruit CLUE**](#adafruit-clue-simulator)

    [<img alt='Adafruit CLUE' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/clue/clue.png'>](#adafruit-clue-simulator)

## Build Status

| Branch  |                                                                                                                    Build Status                                                                                                                    |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| dev     |     [![Build Status](https://microsoftgarage.visualstudio.com/Intern%20GitHub/_apis/build/status/Adafruit/Pacifica-CI?branchName=dev)](https://microsoftgarage.visualstudio.com/Intern%20GitHub/_build/latest?definitionId=304&branchName=dev)     |
| staging | [![Build Status](https://microsoftgarage.visualstudio.com/Intern%20GitHub/_apis/build/status/Adafruit/Pacifica-CI?branchName=staging)](https://microsoftgarage.visualstudio.com/Intern%20GitHub/_build/latest?definitionId=304&branchName=staging) |
| master  |  [![Build Status](https://microsoftgarage.visualstudio.com/Intern%20GitHub/_apis/build/status/Adafruit/Pacifica-CI?branchName=master)](https://microsoftgarage.visualstudio.com/Intern%20GitHub/_build/latest?definitionId=304&branchName=master)  |

## Prerequisites

The following dependencies are required to install before launching Device Simulator Express.  
You will be prompted to install the Python dependencies during the first use.

-   _**[Visual Studio Code](https://code.visualstudio.com/)**_
-   _**[Python 3.7+](https://www.python.org/downloads/)**_: Make sure you've added Python and pip to your PATH in your environment variables. (1)
-   _**[Python VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)**_: This will be installed automatically from the marketplace when you install Device Simulator Express.

## Adafruit Circuit Playground Express (CPX) Simulator

### Features

-   IntelliSense and syntax highlighting for CircuitPython code for the CPX library
-   Template file generation
-   Integrated Python Debugging for the Simulator
-   Serial monitor (available on Windows and Mac only)
-   Output panel for the simulator
-   Deploy CircuitPython code to the physical device.
-   Simulation of the CPX device, including:
    -   Green LED
    -   Red LED
    -   Push Buttons A and B
    -   Slider Switch
    -   Speaker: Play .wav file
    -   10 NeoPixels
    -   Light sensor
    -   Motion sensors
    -   Acceleration detection
    -   Device shake detection
    -   Temperature sensor
    -   7 Capacitive Touch sensors

The simulator supports most of the sensors on CPX except **IR transmitter & Receiver**, **Sound Sensor (microphone)**, **Speaker (Play Tone)** and the **"tap" on Motion Sensor**.
The code related to these sensors can still run on the actual CPX board and be deployed using Device Simulator Express.  
As we only support CPX library now, other libraries (i.e. simpleio) can’t run on the simulator. But they will work on the actual device!

### Useful Links

-   Tutorials and Example Code for Adafruit CPX:
    -   [Adafruit CPX library tutorial](https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library)
    -   [Adafruit CPX Examples on GitHub](https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples)
    -   [Adafruit CPX Guided Tour (Intro for the Hardware)](https://learn.adafruit.com/adafruit-circuit-playground-express/guided-tour)
-   Format Adafruit CPX device:
    -   [Tutorial for formatting Adafruit CPX for CircuitPython](https://learn.adafruit.com/welcome-to-circuitpython/installing-circuitpython)
    -   [Download Firmware .uf2 file](https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart)
    -   [Download the latest version of the Adafruit CPX library](https://learn.adafruit.com/welcome-to-circuitpython/circuitpython-libraries)

### Keyboard Shortcuts

In Device Simulator Express, you can use keyboard to interact with the device:

-   Push Button: <kbd>A</kbd> for Button A, <kbd>B</kbd> for Button B, <kbd>C</kbd> for Buttons A & B
-   Capacitive Touch Sensor: <kbd>Shift</kbd> + <kbd>1</kbd> ~ <kbd>7</kbd> for GPIO pins A1 - A7
-   Slider Switch: <kbd>Shift</kbd> + <kbd>S</kbd>
-   Refresh the simulator: <kbd>Shift</kbd> + <kbd>R</kbd>
-   Run the simulator: <kbd>Shift</kbd> + <kbd>F</kbd>

## BBC micro:bit Simulator

### Features

-   IntelliSense and syntax highlighting for MicroPython code for the micro:bit library
-   Template file generation
-   Integrated Python Debugging for the Simulator
-   Deploy MicroPython code to the physical device
-   Serial monitor (available on Windows and Mac only)
-   Simulation of the micro:bit device, including:
    -   25 LEDs
    -   Push Buttons A and B
    -   Light sensor
    -   Motion sensors
    -   Acceleration detection including gesture detection
    -   Temperature sensor

### Useful Links

-   Tutorials and Example Code for BBC micro:bit:
    -   [MicroPython documentation](https://microbit-micropython.readthedocs.io/en/latest/)
    -   [BBC micro:bit examples on the official micro:bit website](https://microbit.org/projects/make-it-code-it/?filters=python)

### Keyboard Shortcuts

-   Push Button: <kbd>A</kbd> for Button A, <kbd>B</kbd> for Button B, <kbd>C</kbd> for Buttons A & B
-   Refresh the simulator: <kbd>Shift</kbd> + <kbd>R</kbd>
-   Run the simulator: <kbd>Shift</kbd> + <kbd>F</kbd>

## Adafruit CLUE Simulator

### Features

-   IntelliSense and syntax highlighting for CircuitPython code for the following drivers and libraries:
    -   `adafruit_clue`
    -   `adafruit_slideshow`
    -   `adafruit_display_shapes`
    -   `adafruit_display_text`
    -   `adafruit_bitmap_font`
    -   `adafruit_fancyled`
    -   `neopixel`
    -   `displayio`
-   Template file generation
-   Integrated Python Debugging for the Simulator
-   Deploy CircuitPython code to the physical device
-   Serial monitor (available on Windows and Mac only)
-   Simulation of the CLUE device, including:
    -   240x240 color screen
    -   Push Buttons A and B
    -   Sensors for:
        -   Temperature
        -   Light
        -   Color
        -   Acceleration
        -   Humidity
        -   Pressure
        -   Proximity
        -   Gestures
        -   Gyro
        -   Magnetic Field

### Useful Links

-   Tutorials and Example Code for Adafruit CLUE:
    -   [Adafruit CLUE Overview](https://learn.adafruit.com/adafruit-clue)
    -   [Adafruit CLUE Examples on GitHub](https://github.com/adafruit/Adafruit_CircuitPython_CLUE/tree/master/examples)

### Keyboard Shortcuts

-   Push Button: <kbd>A</kbd> for Button A, <kbd>B</kbd> for Button B, <kbd>C</kbd> for Buttons A & B
-   Refresh the simulator: <kbd>Shift</kbd> + <kbd>R</kbd>
-   Run the simulator: <kbd>Shift</kbd> + <kbd>F</kbd>

## How to use

To use Device Simulator Express, install the extension from the marketplace and reload VS Code.

To access many of the commands, you need to open the command palette. This can be done with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> for Windows and Linux / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> for Mac. It can also be accessed from the toolbar by going to `View -> Command Palette`.

### I. Take a look at the "Device Simulator Express: Getting Started" Command.

1. Type in `"Device Simulator Express: Getting Started"` in the command palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette).
2. Choose the the device you want to play with from the dropdown.
3. Read, copy and learn some of the things you can do with the simulator!

<img alt='Getting Started' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/getting_started.png'>

### II. Start with the "Device Simulator Express: New File" Command.

1. Type in `"Device Simulator Express: New File"` in the command palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette).
2. Select the device you want to use.
3. Name and save your file somewhere, and we’re good to go!
4. Start with some examples: you can find examples files and tutorials inside the comments at the top of the file.

<img alt='"New File" animation' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/new_file.gif'>

### III. Start from an existing Python file.

1. Open the folder or your .py file in Visual Studio Code.
2. Run `Device Simulator Express: Open Simulator` from the command palette or icon in the editor toolbar.
3. Select the device you want to use.

### IV. Run your code on the simulator.

1. Run `Run Simulator` from the command palette or use the `Play` button on the simulator webview.

<img alt='How to run the simulator animation' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/run.gif'>

### V. Deploy your code to the physical device

Before deploying the Python code to your CPX device, you need to format your device by following these tutorials:

-   _For the CPX_:

    -   Download the firmware with the .uf2 file (link: https://learn.adafruit.com/adafruit-circuit-playground-express/circuitpython-quickstart).
    -   Download the lastest versions of the cpx libraries (link: https://learn.adafruit.com/welcome-to-circuitpython/circuitpython-libraries).

-   _For the micro:bit_:

    -   Download the firmware with the .hex file (link: https://microbit.org/get-started/user-guide/firmware/).

-   _For the CLUE_:
    -   Download the latest versions of the cpx libraries and follow the instructions here (link:https://learn.adafruit.com/adafruit-clue/circuitpython).

1. Plug in your device (make sure it’s formatted properly already).
2. Run the command `"Device Simulator Express: Deploy to Device"`.

<img alt='Deploy to Device' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/deploy.png'>

### VI. Use the Serial Monitor for your device (available on Windows and Mac only)

1. Plug in your device (make sure it’s formatted properly already).
2. Run the command `"Device Simulator Express: Open Serial Monitor"`.
3. Select your baud rate for the serial port.
4. The `print()` statements in your code will show in the output console.

### VII. Debug your project on the simulator

1. Add breakpoints in your code
2. Press F5 to enter the debugging mode, and you can start debugging line by line!

### Commands

Device Simulator Express provides several commands in the Command Palette (<kbd>F1</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> / <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> for Mac OS) for working with \*.py files:

-   `Device Simulator Express: Getting Started`: Opens a page in VS Code that helps users get started with the extension. Here, users can browse through code that they can use to play with the simulators.
-   `Device Simulator Express: Run Simulator`: Runs Python code on the simulator.
-   `Device Simulator Express: New File`: Opens an unsaved .py file with template code, also opens the simulator for the selected device.
-   `Device Simulator Express: Open Simulator`: Opens the simulator in the simulator window for the selected device
-   `Device Simulator Express: Deploy to Device`: Copies the current file to the selected device.
-   `Device Simulator Express: Open Serial Monitor`: Opens the serial monitor in the integrated output window.
-   `Device Simulator Express: Close Serial Monitor`: Stops the serial monitor and releases the serial port.
-   `Device Simulator Express: Change Baud Rate`: Changes the baud rate of the selected serial port. For Adafruit CPX, the default baud rate is 115200.
-   `Device Simulator Express: Select Serial Port`: Changes the current serial port.

## Contribute

[See here for steps to run the extension locally.](https://github.com/microsoft/vscode-python-devicesimulator/blob/dev/docs/developers-setup.md)

## Provide feedback

To add a review for our extension, please do so on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-python.devicesimulatorexpress)

To report issues, provide feedback or requests, please use this link: [Provide Feedback](https://github.com/microsoft/vscode-python-devicesimulator/issues).  
We would love to hear from you about your experience to keep improving our project.

## Privacy and Telemetry Notice

### Data Collection

The software may collect information about you and your use of the software and send it to Microsoft. Microsoft may use this information to provide services and improve our products and services. You may turn off the telemetry as described in the repository. There are also some features in the software that may enable you and Microsoft to collect data from users of your applications. If you use these features, you must comply with applicable law, including providing appropriate notices to users of your applications together with a copy of Microsoft's privacy statement. Our privacy statement is located at https://go.microsoft.com/fwlink/?LinkID=824704. You can learn more about data collection and use in the help documentation and our privacy statement. Your use of the software operates as your consent to these practices.

### Disable Telemetry

The Microsoft Device Simulator Express Extension for Visual Studio Code collects usage
data and sends it to Microsoft to help improve our products and
services. Read our
[privacy statement](https://privacy.microsoft.com/privacystatement) to
learn more. This extension respects the `telemetry.enableTelemetry`
setting which you can learn more about at
https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting.

To disable telemetry, follow these steps:

1. Open **File** (Open **Code** on macOS)
2. Select **Preferences**
3. Select **Settings**
4. Search for `telemetry`
5. Uncheck the **Telemetry: Enable Telemetry** setting

## Third Party Notice

A `ThirdPartyNotices.txt` file is provided in the extension's source code listing the appropriate third-party notices.

## Troubleshooting Tips

-   The first time you install the extension, you'll need to execute the `run` command at least once in order to access auto-completion.
-   While running a code file, if you get an error saying it can't find the file, make sure you've clicked on a valid Python code file before running it.
-   To open the output panel again after closing it go to VS Code menu: `View -> Output`.
-   If you try to deploy to the CPX while it's plugged in but you still get an error saying it cannot find the board, make sure your device is formatted correctly and that its name matches `CIRCUITPY`.
-   If you can't get the Simulator communication working while debugging, try to open your `Settings` and check the port used under `"Device Simulator Express: Debugger Server Port"`. You can either change it (usually ports above 5000 should work) or try to free it, then start debugging again.
-   When you are using the serial monitor, if you get some unusual error messages, unplug the device and reload the VS Code windows.
-   If you're using Ubuntu and having some problems with setting up the environment, try reviewing [this article's](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-ubuntu-16-04) "Step 1" section on how to set up Python 3 on Ubuntu 16.04. Then, ensure that you've run `sudo apt-get install -y python3-venv` to allow for virtual environment creation.

## License

    Device Simulator Express, a Microsoft Garage project

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

1. Make sure that when you type _python_ in a terminal, the command is recognized and you have the correct version. The easiest way to do it is to select the "Add to PATH" option directly when you install Python. Otherwise you can search how to insert it manually.
2. You can choose to see the prompt or not by changing the extension configurations.
