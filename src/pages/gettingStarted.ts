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
