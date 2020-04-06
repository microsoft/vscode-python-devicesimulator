import * as React from "react";
import "./gettingStarted.css";

export class GettingStartedPage extends React.Component {
    private selectRef: React.RefObject<HTMLSelectElement> = React.createRef();

    componentDidMount() {
        if (this.selectRef.current) {
            this.selectRef.current.addEventListener("change", (event: any) => {
                const visibleElement = document.querySelector(
                    ".visibleElement"
                );
                const target = document.getElementById(event!.target!.value);
                if (visibleElement !== null) {
                    visibleElement.className = "inv";
                }
                if (target !== null) {
                    target.className = "visibleElement";
                }
            });
        }
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
                            Select a Device
                        </option>
                        <option value="CPX">Circuit Playground Express</option>
                        <option value="micro:bit">micro:bit</option>
                        <option value="CLUE">CLUE</option>
                    </select>
                    <h3>
                        Copy these snippets of code to a .py file and run the
                        simulator
                    </h3>
                    {/* prettier-ignore */}
                    <div id="CPX" className="inv">
                        <h2> Tutorial for Circuit Playground Express </h2>
                        <h3>
                            1. Import the micro:bit library to use it (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre>from adafruit_circuitplayground import cp</pre>
                        </span>
                        <h3> 2. Turn on the little red LED</h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    cp.red_led = True</pre>
                        </span>
                        <h3> 3. Turn up red LED when button A is clicked</h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    if cp.button_a:</pre>
                            <pre>        cp.red_led = True</pre>
                        </span>
                        <h3> 4. Light up the first neopixel blue</h3>
                        <span className="codeBox">
                            <pre>cp.pixels[0] = (0, 0, 255)</pre>
                        </span>
                        <h3>And much more! These links have more tutorials:</h3>
                        <h3>
                            <a href="https://learn.adafruit.com/circuitpython-made-easy-on-circuit-playground-express/circuit-playground-express-library">
                                Getting started with CPX and CircuitPython
                            </a>
                        </h3>
                        <h3>
                            <a href="https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/tree/master/examples">
                                More example code
                            </a>
                        </h3>
                    </div>
                    {/* prettier-ignore */}
                    <div id="micro:bit" className="inv">
                        <h2> Tutorial for micro:bit </h2>
                        <h3>
                            1. Import the micro:bit library to use it (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre>from microbit import *</pre>
                        </span>
                        <h3>
                            2. Light up your micro:bit with love by showing a
                            heart
                        </h3>
                        <span className="codeBox">
                            <pre>display.show(Image.HEART)</pre>
                        </span>
                        <h3>
                            3. Use your micro:bit to tell the world how you’re
                            feeling
                        </h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    if button_a.is_pressed():</pre>
                            <pre>        display.show(Image.HAPPY)</pre>
                            <pre>    if button_b.is_pressed():</pre>
                            <pre>        display.show(Image.SAD)</pre>
                        </span>
                        <h3> 4. Read then display the temperature</h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    temp = temperature()</pre>
                            <pre>    display.show(temp)</pre>
                        </span>
                        <h3>
                            5. Display your name with the scroll functionality
                        </h3>
                        <span className="codeBox">
                            <pre>while True:</pre>
                            <pre>    display.show("Your name")</pre>
                        </span>
                        <h3>And much more! These links have more tutorials:</h3>
                        <h3>
                            <a href="https://microbit.org/projects/make-it-code-it/">
                                Microbit Tutorials
                            </a>
                        </h3>
                        <h3>
                            <a href="https://microbit-micropython.readthedocs.io/">
                                Microbit official documentation
                            </a>
                        </h3>
                    </div>
                    {/* prettier-ignore */}
                    <div id="CLUE" className="inv">
                        <h2> Tutorial for CLUE </h2>
                        <h3>
                            1. Import the the main CLUE library (This is
                            required)
                        </h3>
                        <span className="codeBox">
                            <pre>from adafruit_clue import clue</pre>
                        </span>
                        <h3>
                            2. Display text on the CLUE and change the text when
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
                        <h3> 3. Create a slide show on the CLUE</h3>
                        <p>
                            Make sure there are bitmap (.bmp) pictures of your choice in the same directory
                            as the code file.
                        </p>
                        <span className="codeBox">
                            <pre>import board</pre>
                            <pre>from adafruit_slideshow import SlideShow</pre>
                            <pre> </pre>
                            <pre>slideshow = SlideShow(board.DISPLAY, auto_advance=True, dwell=3, fade_effect=True)
                            </pre>
                            <pre>while slideshow.update():</pre>
                            <pre>    pass</pre>
                        </span>
                        <h3> 4. Light up the neopixel green</h3>
                        <span className="codeBox">
                            <pre>clue.pixel.fill(clue.GREEN)</pre>
                        </span>
                        <h3> 5. Draw a blue rectangle on the screen</h3>
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
                        <h3>And much more! These links have more tutorials:</h3>
                        <h3>
                            <a href="https://learn.adafruit.com/adafruit-clue/circuitpython">
                                Getting started with CLUE and CircuitPython
                            </a>
                        </h3>
                        <h3>
                            <a href="https://blog.adafruit.com/2020/02/12/three-fun-sensor-packed-projects-to-try-on-your-clue-adafruitlearningsystem-adafruit-circuitpython-adafruit/">
                                More example code
                            </a>
                        </h3>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
