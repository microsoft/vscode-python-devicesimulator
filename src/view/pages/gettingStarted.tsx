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
                            <option value="CPX">Circuit Playground Express</option>
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
                        <h3 className="normal-font-weight">
                            > Import the micro:bit library to use it (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre>from adafruit_circuitplayground import cp</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Turn on the little red LED</h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    cp.red_led = True</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Turn up red LED when button A is clicked</h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    if cp.button_a:</pre>
                            <pre>        cp.red_led = True</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Light up the first neopixel blue</h3>
                        <span className="codeBox">
                            <pre>cp.pixels[0] = (0, 0, 255)</pre>
                        </span>
                        <h3 className="normal-font-weight">And much more! These links have more tutorials:</h3>
                        <h3 className="normal-font-weight">
                            <a href="https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library">
                                Getting started with CPX and CircuitPython
                            </a>
                        </h3>
                        <h3 className="normal-font-weight">
                            <a href="https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples">
                                More example code
                            </a>
                        </h3>
                    </div>
                    {/* prettier-ignore */}
                    <div id="micro:bit" className="inv">
                        <h2> Tutorial for micro:bit </h2>
                        <h3 className="normal-font-weight">
                            > Import the micro:bit library to use it (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre>from microbit import *</pre>
                        </span>
                        <h3 className="normal-font-weight">
                            > Light up your micro:bit with love by showing a
                            heart
                        </h3>
                        <span className="codeBox">
                            <pre>display.show(Image.HEART)</pre>
                        </span>
                        <h3 className="normal-font-weight">
                            > Use your micro:bit to tell the world how you’re
                            feeling
                        </h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    if button_a.is_pressed():</pre>
                            <pre>        display.show(Image.HAPPY)</pre>
                            <pre>    if button_b.is_pressed():</pre>
                            <pre>        display.show(Image.SAD)</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Read then display the temperature</h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    temp = temperature()</pre>
                            <pre>    display.show(temp)</pre>
                        </span>
                        <h3 className="normal-font-weight">
                            > Display your name with the scroll functionality
                        </h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    display.show("Your name")</pre>
                        </span>
                        <h3 className="normal-font-weight">And much more! These links have more tutorials:</h3>
                        <h3 className="normal-font-weight">
                            <a href="https://microbit.org/projects/make-it-code-it/">
                                Microbit Tutorials
                            </a>
                        </h3>
                        <h3 className="normal-font-weight">
                            <a href="https://microbit-micropython.readthedocs.io/">
                                Microbit official documentation
                            </a>
                        </h3>
                    </div>
                    {/* prettier-ignore */}
                    <div id="CLUE" className="inv">
                        <h2> Tutorial for CLUE </h2>
                        <h3 className="normal-font-weight"> > Enable Preview Mode to use the CLUE (This is required)</h3>
                        <p> a. Access your settings:</p>
                        <img alt='Open settings' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/clue/open_settings.PNG' style={{ width: '346px', height: '337px' }}></img>
                        <ul>
                            <li>Windows or Linux: press <kbd>Ctrl</kbd> + <kbd>,</kbd> or go to <code>File -> Preferences -> Settings</code></li>
                            <li>Mac: press <kbd>Cmd</kbd> + <kbd>,</kbd> or go to <code>Code -> Preferences -> Settings</code>.</li>
                        </ul>
                        <p> b. Check the <code>"Device Simulator Express: Preview Mode"</code> setting.</p>
                        <img alt='Enable preview mode' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/clue/check_preview_mode.gif' style={{ width: '333px', height: '157px' }}></img>
                        <h3 className="normal-font-weight">
                            > Import the the main CLUE library (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre>from adafruit_clue import clue</pre>
                        </span>
                        <h3 className="normal-font-weight">
                            > Display text on the CLUE and change the text when
                            a button is pressed
                        </h3>
                        <span className="codeBox">
                            <pre>
                                clue_data = clue.simple_text_display(title="CLUE!", text_scale=2)
                            </pre>
                            <pre>while True:</pre>
                            <pre>    clue_data[1].text = "Hello World!"</pre>
                            <pre>    clue_data[3].text = "Temperature: {"{}"}".format(clue.temperature)</pre>
                            <pre>    if clue.button_a:</pre>
                            <pre>        clue_data[5].text = "A is pressed!"</pre>
                            <pre>    else:</pre>
                            <pre>        clue_data[5].text = "A is not pressed!"</pre>
                            <pre>    clue_data.show()</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Create a slide show on the CLUE</h3>
                        <p>
                            Make sure there are bitmap (.bmp) pictures of your choice in the same directory
                            as the code file.
                        </p>
                        <span className="codeBox">
                            <pre>import board</pre>
                            <pre>from adafruit_slideshow import SlideShow</pre>
                            <pre> </pre>
                            <pre>slideshow = SlideShow(clue.display, auto_advance=True, dwell=3, fade_effect=True)
                            </pre>
                            <pre>while slideshow.update():</pre>
                            <pre>    pass</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Light up the neopixel green</h3>
                        <span className="codeBox">
                            <pre>clue.pixel.fill(clue.GREEN)</pre>
                        </span>
                        <h3 className="normal-font-weight"> > Draw a blue rectangle on the screen</h3>
                        <span className="codeBox">
                            <pre>import board</pre>
                            <pre>import displayio</pre>
                            <pre>from adafruit_display_shapes.rect import Rect</pre>
                            <pre> </pre>
                            <pre>splash = displayio.Group(max_size=20)</pre>
                            <pre>board.DISPLAY.show(splash)</pre>
                            <pre> </pre>
                            <pre>rect = Rect(80, 20, 41, 41, fill=0x0000FF)</pre>
                            <pre>splash.append(rect)</pre>
                        </span>
                        <h3 className="normal-font-weight">And much more! These links have more tutorials:</h3>
                        <h3 className="normal-font-weight">
                            <a href="https://learn.adafruit.com/adafruit-clue/circuitpython">
                                Getting started with CLUE and CircuitPython
                            </a>
                        </h3>
                        <h3 className="normal-font-weight">
                            <a href="https://blog.adafruit.com/2020/02/12/three-fun-sensor-packed-projects-to-try-on-your-clue-adafruitlearningsystem-adafruit-circuitpython-adafruit/">
                                More example code
                            </a>
                        </h3>
                    </div>
                    {/* prettier-ignore */}
                    <div id="debugger" className="inv">
                        <h2> Tutorial for using the debugger </h2>
                        <h3 className="normal-font-weight">
                            > Enter debug mode
                        </h3>
                        <p>Press <kbd>F5</kbd> or go to <code>Run -> Start Debugging</code></p>
                        <img alt='Start debugging' src='https://raw.githubusercontent.com/microsoft/vscode-python-devicesimulator/dev/assets/readmeFiles/clue/check_preview_mode.gif' style={{ width: '333px', height: '157px' }}></img>
                        <h3 className="normal-font-weight">
                            > Set a breakpoint or multiple breakpoints 
                        </h3>
                        <p>Stopping at a breakpoint pauses the program at that particular place.</p>
                        <p>Use the debug toolbar or the shortcuts below</p>
                        <img> IMAGE OF TOOLBAR </img>
                        <ul>
                            <li><kbd>F5</kbd> to continue / pause</li>
                            <li><kbd>F10</kbd> to step over (execute current statement and all functions that it calls and stop before the next statement)</li>
                            <li><kbd>F11</kbd> to step into (stop at first statement of first function called from first line)</li>
                            <li><kbd>Shift</kbd> + <kbd>F11</kbd> to step out (run current function to end)</li>
                            <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F11</kbd> to restart</li>
                            <li><kbd>Shift</kbd> + <kbd>F5</kbd> to stop</li>
                        </ul>
                        <img> GIF OF DOING DEBUG STUFF </img>
                        <h3 className="normal-font-weight">
                            > Observe the device's state on the "Variables" tab on the left when stopped at a breakpoint
                        </h3>
                        <img> IMAGE OF LOCAL VARIABLES</img>
                        <h3 className="normal-font-weight">
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
