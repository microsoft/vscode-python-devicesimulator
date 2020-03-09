// TODO: find a better way of loading html into a string
export const LATEST_RELEASE_NOTE = `<h1>Device Simulator Express Release Notes 🐍📝 (Mar. 10, 2020)</h1>
<p>
    Thanks for using our extension! We're back with some small updates. <u>Again, please feel free to enable our feature
        flag in
        Settings
        (under the setting titled “<b>deviceSimulatorExpress.previewMode</b>” in the User settings)</u>.
</p>
<h2>Changes</h2>
<p>
    <h3>Fixes (enabled by default):</h3>
    <ul>
        <li>Playing sounds on the CPX simulation now works on MacOS!
            <ul>
                <li>Try it out by using <i>cp.play_file(PATH_TO_FILE)</i>.</li>
            </ul>
        </li>
        <li>Previously, the play button on the simulations would sometimes require two clicks. This was fixed.</li>
        <li>The editor can now support unicode characters (such as Japanese).</li>
    </ul>
    <h3>New features (only available with feature flag enabled):</h3>
    <ul>
        <li>BBC micro:bit deploy to device and accompanying serial monitor support.
    </ul>
</p>
<br>
<p><b>Keep being a programming pro 😎🔋,</b><br>
    &nbsp&nbsp&nbsp&nbsp&nbsp <b><i>- The Device Simulator Express Team</i></b></p>`;
