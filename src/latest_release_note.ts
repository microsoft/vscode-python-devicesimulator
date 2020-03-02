// TODO: find a better way of loading html into a string
export const LATEST_RELEASE_NOTE = `<h1>Device Simulator Express Release Notes 👩🏾‍💻 👨🏾‍💻 (Mar. 2, 2020)</h1>
<p>
    Welcome to the first update to the Device Simulator Express! <u>Please feel free to enable our feature flag in
        Settings
        (under the setting titled “<b>deviceSimulatorExpress.previewMode</b>” in the User settings)</u>.
</p>
<h2>Changes</h2>
<p>
    <h3>Fixes (enabled by default):</h3>
    <ul>
        <li>Enabled support for “from adafruit_circuitplayground import cp” as an import statement for the CPX and
            changed
            “New File” template to use this format.</li>
        <ul>
            <li>Aligns better with newer online tutorials. Best practice for adafruit_circuitplayground library imports
                changed with <a href="https://github.com/adafruit/Adafruit_CircuitPython_CircuitPlayground/pull/79">this
                    PR
                    in Adafruit’s official repo</a>.</li>
        </ul>
        <li>State for sensor selection persists.</li>
        <li>More reliable dependency installation and more informative setup fail information.</li>
        <li>Fixes to Serial Monitor for CPX device deployment.</li>
        <li>More robust debugger functionality.</li>
        <li>Fixed spelling and clarity errors in documentation and pop-up messages.</li>
    </ul>
    <h3>New features (only available with feature flag enabled):</h3>
    <ul>
        <li><u>BBC micro:bit simulator and debugger – <i>open up a new micro:bit file, write code for the micro:bit and
                    test it out!</u></i>
            <ul>
                <li>Ability to interact with LEDs, buttons, and sensors.</li>
                <li>Includes autocompletion and error flagging.</li>
                <li>Supports the following:</li>
                <ul>
                    <li>Classes:
                        <ul>
                            <li>display</li>
                            <li>image</li>
                            <li>accelerometer</li>
                            <li>button</li>
                        </ul>
                </ul>
                <ul>
                    <li>Global static functions:</li>
                    <ul>
                        <li>sleep()</li>
                        <li>running_time()</li>
                        <li>temperature()</li>
                    </ul>
                </ul>
            </ul>
            <ul>
                <li>Includes accessibility considerations for simulation.</li>
                <ul>
                    <li>Has ability to use keyboard for button presses and navigation.</li>
                </ul>
            </ul>
    </ul>
</p>
<h2>Upcoming Improvements</h2>
<ul>
    <li>Deploying to device on the micro:bit with serial monitor interaction.</li>
</ul>
<br>
<p><b>Happy Hacking! ✨✨🐍🐍🍰</b><br>
    &nbsp&nbsp&nbsp&nbsp&nbsp <b><i>- The Device Simulator Express Team</i></b></p>`;
