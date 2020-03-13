export const GETTING_STARTED_HTML = `<!DOCTYPE html>
    <html>
        <head>
            <title></title>
        </head>
        <style>
            .inv {
                display: none;
            }
            .deviceSelector {
                width: 250px;
                border: 1px solid #3D484C;
                margin: 0 0 5px;
                padding: 8px;
                border-radius: 5px;
                font-size: 12px;
                padding-right: 30px;
            }
            .codeBox {
                display: block;
                width: 90%;
                margin: 10px;
                padding: 15px;
                text-align: left;
                background: none;
                border: 1px solid grey;
                border-radius:4px;
            }

        </style>
        <body>
            <h1>Getting started</h1>

            <select id="target" class="deviceSelector">
                <option selected disabled>Select a Device</option>
                <option value="micro:bit">micro:bit</option>
                <option value="CPX">CPX</option>
            <select>
    
            <div id="micro:bit" class="visibleElement">
                <h2> Tutorial for micro:bit </h2>
                <h3> 1. Import the micro:bit library to use it! (This is required)</h3>
                <span class="codeBox">
                    <pre>from microbit import *</pre>
                </span>
                <h3> 2. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">
                    <pre>display.show(Image.HEART)</pre>
                </span>                
                <h3> 3. Use your micro:bit to tell the world how you’re feeling.
                </h3>
                <span class="codeBox">
                    <pre>while True:</pre>
                    <pre>   if button_a.is_pressed():</pre>
                    <pre>      display.show(Image.HAPPY)</pre>
                    <pre>   if button_b.is_pressed():</pre>
                    <pre>       display.show(Image.SAD)</pre>
                </span>
                <h3> 4. Read then display the temperature.</h3>
                <span class="codeBox">
                    <pre>while True:</pre>
                    <pre>    temp = temperature()</pre>
                    <pre>    display.show(temp)</pre>
                </span>
                <h3> And much more! These links have more tutorials:</h3>
                <h3>
                    <a href="https://microbit.org/projects/make-it-code-it/">Microbit Tutorials</a>
                </h3>
                <h3>
                    <a href="https://microbit-micropython.readthedocs.io/">Microbit official documentation</a>
                </h3>
            </div>
            <div id="CPX" class="inv">
                <h2> Tutorial for CPX </h2>
                <h3> 1. Import the micro:bit library to use it!</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
                <h3> 1. Light up your micro:bit with love by showing a heart.</h3>
                <span class="codeBox">display.show(Image.HEART)</span>
            </div>
    
            <script>
                document
                    .getElementById('target')
                    .addEventListener('change', function () {
                        'use strict';
                        var visibleElement = document.querySelector('.visibleElement'),   
                            target = document.getElementById(this.value);
                        if (visibleElement !== null) {
                            visibleElement.className = 'inv';
                        }
                        if (target !== null ) {
                            target.className = 'visibleElement';
                        }
                });
            </script>
        </body>
    </html>`;
