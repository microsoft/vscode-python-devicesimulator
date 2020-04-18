import * as React from "react";
import "./gettingStarted.css";

export class GettingStartedPage extends React.Component {
    private selectRef: React.RefObject<HTMLSelectElement> = React.createRef();

    componentDidMount() {
        this.selectRef.current?.addEventListener("change", (event: any) => {
            const visibleElement = document.querySelector(".visibleElement");
            const target = document.getElementById(event!.target!.value);
            if (visibleElement !== null) {
                visibleElement.className = "inv";
            }
            if (target !== null) {
                target.className = "visibleElement";
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h1>Getting started</h1>
                    <select
                        id="target"
                        className="deviceSelector"
                        ref={this.selectRef}
                    >
                        <option selected disabled>
                            Learn more about:
                        </option>
                        <optgroup label="Devices">
                            <option value="CPX">
                                Circuit Playground Express
                            </option>
                            <option value="micro:bit">micro:bit</option>
                            <option value="CLUE">CLUE</option>
                        </optgroup>
                        <optgroup label="Advanced features">
                            <option value="debugger">Debugger</option>
                        </optgroup>
                    </select>
                    <p>
                        Copy these snippets of code to a .py file and run the
                        simulator
                    </p>
                    {/* prettier-ignore */}
                    <div id="CPX" className="inv">
                        <h2> Tutorial for Circuit Playground Express </h2>
                        <h3 className="normalFontWeight">
                            > Import the micro:bit library to use it (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">from adafruit_circuitplayground import cp</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Turn on the little red LED</h3>
                        <span className="codeBox">
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    cp.red_led = True</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Turn up red LED when button A is clicked</h3>
                        <span className="codeBox">
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    if cp.button_a:</pre>
                            <pre className="codeText">        cp.red_led = True</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Light up the first neopixel blue</h3>
                        <span className="codeBox">
                            <pre className="codeText">cp.pixels[0] = (0, 0, 255)</pre>
                        </span>
                        <h3 className="normalFontWeight">And much more! These links have more tutorials:</h3>
                        <h3 className="normalFontWeight">
                            <a href="https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library">
                                Getting started with CPX and CircuitPython
                            </a>
                        </h3>
                        <h3 className="normalFontWeight">
                            <a href="https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples">
                                More example code
                            </a>
                        </h3>
                        <h3>Keyboard Shortcuts</h3>
                        <ul>
                            <li>Push Button: <kbd>A</kbd> for Button A, <kbd>B</kbd> for Button B, <kbd>C</kbd> for Buttons A & B</li>
                            <li>Refresh the simulator: <kbd>Shift</kbd> + <kbd>R</kbd></li>
                            <li>Run the simulator: <kbd>Shift</kbd> + <kbd>F</kbd></li>
                        </ul>
                    </div>
                    {/* prettier-ignore */}
                    <div id="micro:bit" className="inv">
                        <h2> Tutorial for micro:bit </h2>
                        <h3 className="normalFontWeight">
                            > Import the micro:bit library to use it (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">from microbit import *</pre>
                        </span>
                        <h3 className="normalFontWeight">
                            > Light up your micro:bit with love by showing a
                            heart
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">display.show(Image.HEART)</pre>
                        </span>
                        <h3 className="normalFontWeight">
                            > Use your micro:bit to tell the world how you’re
                            feeling
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    if button_a.is_pressed():</pre>
                            <pre className="codeText">        display.show(Image.HAPPY)</pre>
                            <pre className="codeText">    if button_b.is_pressed():</pre>
                            <pre className="codeText">        display.show(Image.SAD)</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Read then display the temperature</h3>
                        <span className="codeBox">
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    temp = temperature()</pre>
                            <pre className="codeText">    display.show(temp)</pre>
                        </span>
                        <h3 className="normalFontWeight">
                            > Display your name with the scroll functionality
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    display.show("Your name")</pre>
                        </span>
                        <h3 className="normalFontWeight">And much more! These links have more tutorials:</h3>
                        <h3 className="normalFontWeight">
                            <a href="https://microbit.org/projects/make-it-code-it/">
                                Microbit Tutorials
                            </a>
                        </h3>
                        <h3 className="normalFontWeight">
                            <a href="https://microbit-micropython.readthedocs.io/">
                                Microbit official documentation
                            </a>
                        </h3>
                        <h3>Keyboard Shortcuts</h3>
                        <ul>
                            <li>Push Button: <kbd>A</kbd> for Button A, <kbd>B</kbd> for Button B, <kbd>C</kbd> for Buttons A & B</li>
                            <li>Refresh the simulator: <kbd>Shift</kbd> + <kbd>R</kbd></li>
                            <li>Run the simulator: <kbd>Shift</kbd> + <kbd>F</kbd></li>
                        </ul>
                    </div>
                    {/* prettier-ignore */}
                    <div id="CLUE" className="inv">
                        <h2> Tutorial for CLUE </h2>
                        <h3 className="normalFontWeight">
                            > Import the the main CLUE library (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">from adafruit_clue import clue</pre>
                        </span>
                        <h3 className="normalFontWeight">
                            > Display text on the CLUE and change the text when
                            a button is pressed
                        </h3>
                        <span className="codeBox">
                            <pre className="codeText">
                                clue_data = clue.simple_text_display(title="CLUE!")
                            </pre>
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    clue_data[1].text = "Hello World!"</pre>
                            <pre className="codeText">    if clue.button_a:</pre>
                            <pre className="codeText">        clue_data[5].text = "A is pressed!"</pre>
                            <pre className="codeText">    else:</pre>
                            <pre className="codeText">        clue_data[5].text = "A is not pressed!"</pre>
                            <pre className="codeText">    clue_data.show()</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Create a slide show on the CLUE</h3>
                        <p>
                            Make sure there are bitmap (.bmp) pictures of your choice in the same directory
                            as the code file.
                        </p>
                        <span className="codeBox">
                            <pre className="codeText">import board</pre>
                            <pre className="codeText">from adafruit_slideshow import SlideShow</pre>
                            <pre className="codeText"> </pre>
                            <pre className="codeText">slideshow = SlideShow(clue.display, auto_advance=True, dwell=3, fade_effect=True)
                            </pre>
                            <pre className="codeText">while slideshow.update():</pre>
                            <pre className="codeText">    pass</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Light up the neopixel green</h3>
                        <span className="codeBox">
                            <pre className="codeText">clue.pixel.fill(clue.GREEN)</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Display sensor data on the CLUE</h3>
                        <span className="codeBox">
                            <pre className="codeText">clue_data = clue.simple_text_display(title="CLUE Sensor Data!", title_scale=2)</pre>
                            <pre className="codeText">while True:</pre>
                            <pre className="codeText">    clue_data[0].text = "Acceleration: {"{}"} {"{}"} {"{}"}".format(*clue.acceleration)</pre>
                            <pre className="codeText">    clue_data[1].text = "Gyro: {"{}"} {"{}"} {"{}"}".format(*clue.gyro)</pre>
                            <pre className="codeText">    clue_data[2].text = "Magnetic: {"{}"} {"{}"} {"{}"}".format(*clue.magnetic)</pre>
                            <pre className="codeText">    clue_data[3].text = "Pressure: {"{}"}hPa".format(clue.pressure)</pre>
                            <pre className="codeText">    clue_data[4].text = "Altitude: {"{}"}m".format(clue.altitude)</pre>
                            <pre className="codeText">    clue_data[5].text = "Temperature: {"{}"}C".format(clue.temperature)</pre>
                            <pre className="codeText">    clue_data[6].text = "Humidity: {"{}"}%".format(clue.humidity)</pre>
                            <pre className="codeText">    clue_data[7].text = "Proximity: {"{}"}".format(clue.proximity)</pre>
                            <pre className="codeText">    clue_data[8].text = "Gesture: {"{}"}".format(clue.gesture)</pre>
                            <pre className="codeText">    clue_data[9].text = "Color: R: {"{}"} G: {"{}"} B: {"{}"} C: {"{}"}".format(*clue.color)</pre>
                            <pre className="codeText">    clue_data[10].text = "Button A: {"{}"}".format(clue.button_a)</pre>
                            <pre className="codeText">    clue_data[11].text = "Button B: {"{}"}".format(clue.button_b)</pre>
                            <pre className="codeText">    clue_data.show()</pre>
                        </span>
                        <h3 className="normalFontWeight"> > Draw a blue rectangle on the screen</h3>
                        <span className="codeBox">
                            <pre className="codeText">import board</pre>
                            <pre className="codeText">import displayio</pre>
                            <pre className="codeText">from adafruit_display_shapes.rect import Rect</pre>
                            <pre className="codeText"> </pre>
                            <pre className="codeText">splash = displayio.Group(max_size=20)</pre>
                            <pre className="codeText">board.DISPLAY.show(splash)</pre>
                            <pre className="codeText"> </pre>
                            <pre className="codeText">rect = Rect(80, 20, 41, 41, fill=0x0000FF)</pre>
                            <pre className="codeText">splash.append(rect)</pre>
                        </span>
                        <h3 className="normalFontWeight">And much more! These links have more tutorials:</h3>
                        <h3 className="normalFontWeight">
                            <a href="https://learn.adafruit.com/adafruit-clue/circuitpython">
                                Getting started with CLUE and CircuitPython
                            </a>
                        </h3>
                        <h3 className="normalFontWeight">
                            <a href="https://blog.adafruit.com/2020/02/12/three-fun-sensor-packed-projects-to-try-on-your-clue-adafruitlearningsystem-adafruit-circuitpython-adafruit/">
                                More example code
                            </a>
                        </h3>
                        <h3>Keyboard Shortcuts</h3>
                        <ul>
                            <li>Push Button: <kbd>A</kbd> for Button A, <kbd>B</kbd> for Button B, <kbd>C</kbd> for Buttons A & B</li>
                            <li>Refresh the simulator: <kbd>Shift</kbd> + <kbd>R</kbd></li>
                            <li>Run the simulator: <kbd>Shift</kbd> + <kbd>F</kbd></li>
                            <li>Capacitive Touch Sensor: <kbd>Shift</kbd> + <kbd>1</kbd> ~ <kbd>7</kbd> for GPIO pins A1 - A7</li>
                            <li>Slider Switch: <kbd>Shift</kbd> + <kbd>S</kbd></li>
                        </ul>
                    </div>
                    {/* prettier-ignore */}
                    <div id="debugger" className="inv">
                        <h2> Tutorial for using the debugger </h2>
                        <h3 className="normalFontWeight">
                            > Enter debug mode
                        </h3>
                        <p>Press <kbd>F5</kbd> or go to <code>Run -> Start Debugging</code></p>
                        <img alt='Start debugging' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/src/view/pages/gettingStartedPictures/debugger/start_debugging.jpg' style={{ width: '390px', height: '142px' }}></img>
                        <h3 className="normalFontWeight">
                            > Set a breakpoint or multiple breakpoints 
                        </h3>
                        <p>Stopping at a breakpoint pauses the program at that particular place.</p>
                        <p>Use the debug toolbar or the shortcuts below</p>
                        <img alt='Debugger Toolbar' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/src/view/pages/gettingStartedPictures/debugger/toolbar.png'></img>
                        <ul>
                            <li><kbd>F5</kbd> to continue / pause</li>
                            <li><kbd>F10</kbd> to step over (execute current statement and all functions that it calls and stop before the next statement)</li>
                            <li><kbd>F11</kbd> to step into (stop at first statement of first function called from first line)</li>
                            <li><kbd>Shift</kbd> + <kbd>F11</kbd> to step out (run current function to end)</li>
                            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F11</kbd> to restart</li>
                            <li><kbd>Shift</kbd> + <kbd>F5</kbd> to stop</li>
                        </ul>
                        <img alt='debugging experience' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/src/view/pages/gettingStartedPictures/debugger/debugging.gif'></img>
                        <h3 className="normalFontWeight">
                            > Observe the device's state on the "Variables" tab on the left when stopped at a breakpoint
                        </h3>
                        <img alt='Debugger Variables' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/src/view/pages/gettingStartedPictures/debugger/debugger_vars.png' style={{ width: '286px', height: '504px' }}></img>
                        <h3 className="normalFontWeight">And much more! These links have more tutorials:</h3>
                        <h3 className="normalFontWeight">
                            <a href="https://code.visualstudio.com/docs/editor/debugging">
                                Learn more about debugging in VS Code
                            </a>
                        </h3>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
