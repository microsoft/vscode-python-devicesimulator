// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Adapted from : https://github.com/microsoft/pxt-adafruit/blob/master/sim/visuals/board.ts#L477

export const MB_WIDTH = 180.09375;
export const MB_HEIGHT = 179.22874;

export const OFF_COLOR = "#c8c8c8";
export const MAX_STROKE_LUM = 75;
export const MIN_INNER_LUM = 85;
export const INTENSITY_FACTOR = 1.3;
export const RED_LED_ON: string = "#FF7777";
export const RED_LED_OFF: string = "#FFFFFF";
export const BUTTON_NEUTRAL: string = "#000000";
export const BUTTON_PRESSED: string = "#FFA500";
export const BUTTON_OUTER: string = "#DCDCDC";
export const BUTTON_CORNER_RADIUS: number = 2;
export const BUTTON_WIDTH: number = 10;
export const BUTTON_CIRCLE_RADIUS: number = 3;
export const BUTTON_TEXT_BASELINE: number = 163;
export const POWER_LED_ON: string = "#00FF00";
export const POWER_LED_OFF: string = "#FFFFFF";

// Adapted from : https://github.com/microsoft/pxt/blob/master/pxtsim/simlib.ts
export function rgbToHsl(
  rgb: [number, number, number]
): [number, number, number] {
  let [r, g, b] = rgb;
  let [r$, g$, b$] = [r / 255, g / 255, b / 255];
  let cMin = Math.min(r$, g$, b$);
  let cMax = Math.max(r$, g$, b$);
  let cDelta = cMax - cMin;
  let h: number = 0,
    s: number,
    l: number;
  let maxAndMin = cMax + cMin;

  // Luminosity
  l = (maxAndMin / 2) * 100;

  if (cDelta === 0) {
    s = 0;
    h = 0;
  } else {
    // Hue
    switch (cMax) {
      case r$:
        h = 60 * (((g$ - b$) / cDelta) % 6);
        break;
      case g$:
        h = 60 * ((b$ - r$) / cDelta + 2);
        break;
      case b$:
        h = 60 * ((r$ - g$) / cDelta + 4);
        break;
    }

    // Saturation
    if (l > 50) s = 100 * (cDelta / (2 - maxAndMin));
    else s = 100 * (cDelta / maxAndMin);
  }

  return [Math.floor(h), Math.floor(s), Math.floor(l)];
}

export const SVG_STYLE = `
    svg.sim {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: block;
    }
    svg.sim.grayscale {
        -moz-filter: grayscale(1);
        -webkit-filter: grayscale(1);
        filter: grayscale(1);
    }
    .sim-button {
        pointer-events: none;
    }

    .sim-button-outer {
        cursor: pointer;
    }
    .sim-button-outer:hover {
        stroke-width: 1px;
        stroke: orange !important;
    }
    .sim-button-nut {
        fill:#704A4A;
        pointer-events:none;
    }
    .sim-button-nut:hover {
        stroke:1px solid #704A4A;
    }
    
    .sim-pin-touch.touched:hover {
        stroke:darkorange;
    }
    
    .sim-led-back:hover {
        stroke:#fff;
        stroke-width:3px;
    }
    .sim-led:hover {
        stroke:#ff7f7f;
        stroke-width:3px;
    }
    
    .sim-systemled {
        fill:#333;
        stroke:#555;
        stroke-width: 1px;
    }
    
    .sim-light-level-button {
        stroke:#f1c40f;
        stroke-width: 1px;
    }
    
    .sim-pin-level-button {
        stroke:darkorange;
        stroke-width: 1px;
    }
    
    .sim-sound-level-button {
        stroke:#7f8c8d;
        stroke-width: 1px;
    }
    
    .sim-antenna {
        stroke:#555;
        stroke-width: 2px;
    }
    
    .sim-text {
        font-family:"Lucida Console", Monaco, monospace;
        font-size:8px;
        fill:#fff;
        pointer-events: none; user-select: none;
    }
    .sim-text.small {
        font-size:6px;
    }
    .sim-text.inverted {
        fill:#000;
    }
    
    .sim-text-pin {
        font-family:"Lucida Console", Monaco, monospace;
        font-size:5px;
        fill:#fff;
        pointer-events: none;
    }
    
    .sim-thermometer {
        stroke:#aaa;
        stroke-width: 1px;
    }
    
    #rgbledcircle:hover {
        r:8px;
    }
    
    #SWITCH_HOVER {
        cursor: pointer;
    }
    .sim-slide-switch:hover #SWITCH_HOVER {
        stroke:orange !important;
        stroke-width: 1px;
    }
    
    .sim-slide-switch-inner.on {
        fill:#ff0000 !important;
    }
    
    .sim-slide-switch-inner.on {
        fill:#ff0000 !important;
    }
    
    /* animations */
    .sim-theme-glow {
        animation-name: sim-theme-glow-animation;
        animation-timing-function: ease-in-out;
        animation-direction: alternate;
        animation-iteration-count: infinite;
        animation-duration: 1.25s;
    }
    @keyframes sim-theme-glow-animation {
        from { opacity: 1; }
        to   { opacity: 0.75; }
    }

    .sim-flash {
        animation-name: sim-flash-animation;
        animation-duration: 0.1s;
    }

    @keyframes sim-flash-animation {
        from { fill: yellow; }
        to   { fill: default; }
    }

    .sim-flash-stroke {
        animation-name: sim-flash-stroke-animation;
        animation-duration: 0.4s;
        animation-timing-function: ease-in;
    }
    
    @keyframes sim-flash-stroke-animation {
        from { stroke: yellow; }
        to   { stroke: default; }
    }
    
    
    .sim-sound-stroke {
        animation-name: sim-sound-stroke-animation;
        animation-duration: 0.4s;
    }
    
    @keyframes sim-sound-stroke-animation {
        from { stroke: yellow; }
        to   { stroke: default; }
    }
    
    /* wireframe */
    .sim-wireframe * {
        fill: none;
        stroke: black;
    }
    .sim-wireframe .sim-display,
    .sim-wireframe .sim-led,
    .sim-wireframe .sim-led-back,
    .sim-wireframe .sim-head,
    .sim-wireframe .sim-theme,
    .sim-wireframe .sim-button-group,
    .sim-wireframe .sim-button-label,
    .sim-wireframe .sim-button,
    .sim-wireframe .sim-text-pin
    {
        visibility: hidden;
    }
    .sim-wireframe .sim-label
    {
        stroke: none;
        fill: #777;
    }
    .sim-wireframe .sim-board {
        stroke-width: 2px;
    }
    *:focus {
        outline: none;
    }
    .sim-button-outer:focus,
    .sim-slide-switch:focus,
    .sim-pin:focus,
    .sim-thermometer:focus,
    .sim-button-group:focus .sim-button-outer,
    .sim-light-level-button:focus,
    .sim-sound-level-button:focus {
        stroke: #4D90FE;
        stroke-width: 2px !important;
    }
    .no-drag {
        user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    .sim-PIN_A1-touch:hover,
    .sim-PIN_A2-touch:hover,
    .sim-PIN_A3-touch:hover,
    .sim-PIN_A4-touch:hover,
    .sim-PIN_A5-touch:hover,
    .sim-PIN_A6-touch:hover{
        stroke:darkorange;
        stroke-width:1px;
    }
    
    .sim-PIN_A1-touch:focus,
    .sim-PIN_A2-touch:focus,
    .sim-PIN_A3-touch:focus,
    .sim-PIN_A4-touch:focus,
    .sim-PIN_A5-touch:focus,
    .sim-PIN_A6-touch:focus,
    .sim-PIN_A7-touch:focus{
        stroke:#4D90FE;
        stroke-width:1px;

    }

`;
