// TODO: find a better way of loading html into a string
export const LATEST_RELEASE_NOTE = `<h1>Device Simulator Express Release Notes ⌨️🐍💞 (April 15, 2020)</h1>
<p>
    <p>
        We're unveiling a new addition to our DSX family of microcontroller simulators! Please welcome the <b>Adafruit
            CLUE
            simulator</b> 💕🔍.<br>
        This change is <b>hidden</b> under a preview flag by default. <a
            href="https://github.com/microsoft/vscode-python-devicesimulator/blob/dev/README.md#how-to-enable-preview-flag">See
            here</a> to learn how to enable
        preview mode!<br>
    </p>
    <p>
        Also, support for <b>BBC micro:bit</b> simulation is now <b>officially released</b>! 💖✨ Previously, it was hidden
        behind a
        preview flag.
    </p>
    <p>
        <h2>Features:</h2>
        <ul>
            <li>Added the support for the <b>Adafruit CLUE</b>! This is hidden behind a preview flag by default.
                <ul>
                    <li>
                        Added CLUE Simulator, featuring simulation for the following:
                        <ul>
                            <li>240x240 color display.</li>
                            <li>Sensors (for temperature, light, color, acceleration, humidity, pressure, proximity,
                                gestures, gyro, and magnetic field).</li>
                        </ul>
                    </li>
                    <li>Implemented deploy-to-device for CLUE.</li>
                    <li>CLUE code debugger integration.</li>
                </ul>
            </li>
            <li>Support for <b>BBC micro:bit</b> is now fully released and will appear by default.</li>

            <li>New "Getting Started" page containing CPX, micro:bit, and CLUE example code.</li>
            <li>Incorporated support for gesture simulation on the micro:bit.</li>
            <li>Tab UI now has callout for "about" information on each sensor/input option.</li>
            <li>The CircuitPython Neopixel and Adafruit_Fancyled libraries can now be used with the Adafruit CPX without
                importing the CPX library. <a
                    href="https://circuitpython.readthedocs.io/projects/fancyled/en/latest/examples.html">See here</a>
                for an example.</li>
        </ul>
        <h2>Changes:</h2>
        <ul>
            <li>Command palette only shows actions (ie: Open Simulator, Deploy to Device) once instead of per device.
            </li>

        </ul>
        <h2>Fixes:</h2>
        <ul>
            <li>Fixed issue with sensors on micro:bit debugger.</li>
        </ul>
    </p>
    <p><b>Keep being a coding champ 🤩🏆🙌,</b><br>
        &nbsp&nbsp&nbsp&nbsp&nbsp <b><i>- The Device Simulator Express Team</i></b></p>`;
