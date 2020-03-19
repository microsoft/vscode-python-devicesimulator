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
                <h1>Getting started</h1>

                <select
                    id="target"
                    className="deviceSelector"
                    ref={this.selectRef}
                >
                    <option selected disabled>
                        Select a Device
                    </option>
                    <option value="micro:bit">micro:bit</option>
                    <option value="CPX">CPX</option>
                </select>

                <div id="micro:bit" className="visibleElement">
                    <h2> Tutorial for micro:bit </h2>
                    <h3>
                        1. Import the micro:bit library to use it (This is
                        required)
                    </h3>
                    <span className="codeBox">
                        <pre>from microbit import *</pre>
                    </span>
                    <h3>
                        2. Light up your micro:bit with love by showing a heart
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
                        <pre> if button_a.is_pressed():</pre>
                        <pre> display.show(Image.HAPPY)</pre>
                        <pre> if button_b.is_pressed():</pre>
                        <pre> display.show(Image.SAD)</pre>
                    </span>
                    <h3> 4. Read then display the temperature.</h3>
                    <span className="codeBox">
                        <pre>while True:</pre>
                        <pre> temp = temperature()</pre>
                        <pre> display.show(temp)</pre>
                    </span>
                    <h3> And much more! These links have more tutorials:</h3>
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
                <div id="CPX" className="inv">
                    <h2> Tutorial for CPX </h2>
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
                        <pre> cp.red_led = True</pre>
                    </span>
                    <h3> 3. Turn up red LED when button A is clicked</h3>
                    <span className="codeBox">
                        <pre>while True:</pre>
                        <pre> if cp.button_a:</pre>
                        <pre> cp.red_led = True</pre>
                    </span>
                    <h3> 4. Light up the first neopixel blue</h3>
                    <span className="codeBox">
                        <pre>cp.pixels[0] = (0, 0, 255)</pre>
                    </span>
                    <h3> And much more! These links have more tutorials:</h3>
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
            </React.Fragment>
        );
    }
}
