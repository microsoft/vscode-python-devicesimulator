// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import CPX_SVG from "./Cpx_svg";
import * as SvgStyle from "./Cpx_svg_style";
import svg from "./Svg_utils";
import accessibility from "./Accessibility_utils";

interface IProps {
  pixels: Array<Array<number>>;
  power_led: boolean;
  red_led: boolean;
  brightness: number;
  switch: boolean;
  onMouseUp: (button: HTMLElement, event: Event) => void;
  onMouseDown: (button: HTMLElement, event: Event) => void;
  onMouseLeave: (button: HTMLElement, event: Event) => void;
}

let firstTime = true;

/** Functional Component render */
const Cpx: React.FC<IProps> = props => {
  let svgElement = window.document.getElementById("cpx_svg");

  if (svgElement) {
    if (firstTime) {
      initSvgStyle(svgElement, props.brightness);
      setupButtons(props);
      setupSwitch(props);
      firstTime = false;
    }
    // Update Neopixels and red LED state
    updateNeopixels(props);
    updateRedLED(props.red_led);
    updatePowerLED(props.power_led);
    updateSwitch(props.switch);
  }

  return CPX_SVG;
};

const makeButton = (
  g: SVGElement,
  left: number,
  top: number,
  id: string
): { outer: SVGElement; inner: SVGElement } => {
  const buttonCornerRadius = SvgStyle.BUTTON_CORNER_RADIUS;
  const buttonWidth = SvgStyle.BUTTON_WIDTH;
  const buttonCircleRadius = SvgStyle.BUTTON_CIRCLE_RADIUS;
  const btng = svg.child(g, "g", { class: "sim-button-group" });
  svg.child(btng, "rect", {
    id: id + "_OUTER",
    x: left,
    y: top,
    rx: buttonCornerRadius,
    ry: buttonCornerRadius,
    width: buttonWidth,
    height: buttonWidth,
    fill: SvgStyle.BUTTON_OUTER
  });

  const outer = btng;
  const inner = svg.child(btng, "circle", {
    id: id + "_INNER",
    cx: left + buttonWidth / 2,
    cy: top + buttonWidth / 2,
    r: buttonCircleRadius,
    fill: SvgStyle.BUTTON_NEUTRAL
  });

  return { outer, inner };
};

const initSvgStyle = (svgElement: HTMLElement, brightness: number): void => {
  let style: SVGStyleElement = svg.child(
    svgElement,
    "style",
    {}
  ) as SVGStyleElement;
  style.textContent = SvgStyle.SVG_STYLE;

  // Filters for the glow effect (Adapted from : https://github.com/microsoft/pxt-adafruit/blob/master/sim/visuals/board.ts)
  let defs: SVGDefsElement = svg.child(
    svgElement,
    "defs",
    {}
  ) as SVGDefsElement;

  let g = svg.createElement("g") as SVGElement;
  svgElement.appendChild(g);

  let glow = svg.child(defs, "filter", {
    id: "filterglow",
    x: "-5%",
    y: "-5%",
    width: "120%",
    height: "120%"
  });
  svg.child(glow, "feGaussianBlur", { stdDeviation: "5", result: "glow" });
  let merge = svg.child(glow, "feMerge", {});
  for (let i = 0; i < 3; ++i) {
    svg.child(merge, "feMergeNode", { in: "glow" });
  }

  let neopixelglow = svg.child(defs, "filter", {
    id: "neopixelglow",
    x: "-300%",
    y: "-300%",
    width: "600%",
    height: "600%"
  });
  svg.child(neopixelglow, "feGaussianBlur", {
    stdDeviation: "4.3",
    result: "coloredBlur"
  });
  let neopixelmerge = svg.child(neopixelglow, "feMerge", {});
  svg.child(neopixelmerge, "feMergeNode", { in: "coloredBlur" });
  svg.child(neopixelmerge, "feMergeNode", { in: "coloredBlur" });
  svg.child(neopixelmerge, "feMergeNode", { in: "SourceGraphic" });

  // Brightness
  let neopixelfeComponentTransfer = svg.child(
    neopixelglow,
    "feComponentTransfer",
    {}
  );
  svg.child(neopixelfeComponentTransfer, "feFuncR", {
    id: "brightnessFilterR",
    type: "linear",
    slope: brightness
  });
  svg.child(neopixelfeComponentTransfer, "feFuncG", {
    id: "brightnessFilterG",
    type: "linear",
    slope: brightness
  });
  svg.child(neopixelfeComponentTransfer, "feFuncB", {
    id: "brightnessFilterB",
    type: "linear",
    slope: brightness
  });

  // BTN A+B
  const outerBtn = (left: number, top: number, label: string) => {
    const button = makeButton(g, left, top, "BTN_AB");
    return button;
  };

  let ab = outerBtn(165, SvgStyle.MB_HEIGHT - 15, "A+B");
  let abtext = svg.child(ab.outer, "text", {
    x: SvgStyle.BUTTON_TEXT_BASELINE,
    y: SvgStyle.MB_HEIGHT - 18,
    class: "sim-text"
  }) as SVGTextElement;
  abtext.textContent = "A+B";
};

const updateNeopixels = (props: IProps): void => {
  for (let i = 0; i < props.pixels.length; i++) {
    let led = window.document.getElementById(`NEOPIXEL_${i}`);
    if (led) {
      setNeopixel(led, props.pixels[i], props.brightness);
    }
  }
};

const updateRedLED = (propsRedLED: boolean): void => {
  let redLED = window.document.getElementById("SERIAL_LED");
  if (redLED) {
    redLED.style.fill = propsRedLED
      ? SvgStyle.RED_LED_ON
      : SvgStyle.RED_LED_OFF;
  }
};

const updatePowerLED = (propsPowerLED: boolean): void => {
  let powerLED = window.document.getElementById("PWR_LED");
  if (powerLED) {
    powerLED.style.fill = propsPowerLED
      ? SvgStyle.POWER_LED_ON
      : SvgStyle.POWER_LED_OFF;
  }
};

const setNeopixel = (
  led: HTMLElement,
  pixValue: Array<number>,
  brightness: number
): void => {
  if (isLightOn(pixValue) && brightness > 0) {
    // Neopixels style (Adapted from : https://github.com/microsoft/pxt-adafruit/blob/master/sim/visuals/board.ts)
    changeBrightness("brightnessFilterR", brightness);
    changeBrightness("brightnessFilterG", brightness);
    changeBrightness("brightnessFilterB", brightness);

    let [hue, sat, lum] = SvgStyle.rgbToHsl([
      pixValue[0],
      pixValue[1],
      pixValue[2]
    ]);
    let innerLum = Math.max(
      lum * SvgStyle.INTENSITY_FACTOR,
      SvgStyle.MIN_INNER_LUM
    );
    lum = (lum * 90) / 100 + 10; // at least 10% luminosity for the stroke

    led.style.filter = `url(#neopixelglow)`;
    led.style.fill = `hsl(${hue}, ${sat}%, ${innerLum}%)`;
    led.style.stroke = `hsl(${hue}, ${sat}%, ${Math.min(
      lum * 3,
      SvgStyle.MAX_STROKE_LUM
    )}%)`;
    led.style.strokeWidth = `1.5`;
  } else {
    led.style.fill = SvgStyle.OFF_COLOR;
    led.style.filter = `none`;
    led.style.stroke = `none`;
  }
};

const isLightOn = (pixValue: Array<number>): boolean => {
  return !pixValue.every(val => {
    return val == 0;
  });
};

const changeBrightness = (filterID: string, brightness: number): void => {
  let brightnessFilter: HTMLElement | null = window.document.getElementById(
    filterID
  );
  if (brightnessFilter)
    brightnessFilter.setAttribute("slope", brightness.toString());
};

const setupButtons = (props: IProps): void => {
  const outButtons = ["A_OUTER", "B_OUTER", "AB_OUTER"];
  const inButtons = ["A_INNER", "B_INNER", "AB_INNER"];
  outButtons.forEach(buttonName => {
    const button = window.document.getElementById("BTN_" + buttonName);

    if (button) {
      setupButton(button, "sim-button-outer", props);
    }
  });
  inButtons.forEach(buttonName => {
    const button = window.document.getElementById("BTN_" + buttonName);
    if (button) {
      setupButton(button, "sim-button", props);
    }
  });
};

const addButtonLabels = (button: HTMLElement) => {
  let label = "";
  if (button.id.match(/AB/) !== null) {
    label = "A+B";
  } else if (button.id.match(/A/) !== null) {
    label = "A";
  } else if (button.id.match(/B/) !== null) {
    label = "B";
  }
  accessibility.setAria(button, "button", label);
};

const setupButton = (button: HTMLElement, className: string, props: IProps) => {
  const svgButton = (button as unknown) as SVGElement;
  svg.addClass(svgButton, className);
  addButtonLabels(button);
  if (className.match(/outer/) !== null) {
    accessibility.makeFocusable(svgButton);
  }
  svgButton.onmousedown = e => props.onMouseDown(button, e);
  svgButton.onmouseup = e => props.onMouseUp(button, e);
  svgButton.onmouseleave = e => props.onMouseLeave(button, e);
};

const setupSwitch = (props: IProps): void => {
  const switchElement = window.document.getElementById("SWITCH");
  const swInnerElement = window.document.getElementById("SWITCH_INNER");
  const swHousingElement = window.document.getElementById("SWITCH_HOUSING");

  if (switchElement && swInnerElement && swHousingElement) {
    let svgSwitch: SVGElement = (switchElement as unknown) as SVGElement;
    let svgSwitchInner: SVGElement = (swInnerElement as unknown) as SVGElement;
    let svgSwitchHousing: SVGElement = (swHousingElement as unknown) as SVGElement;

    svg.addClass(svgSwitch, "sim-slide-switch");

    svgSwitch.onmouseup = e => props.onMouseUp(switchElement, e);
    svgSwitchInner.onmouseup = e => props.onMouseUp(swInnerElement, e);
    svgSwitchHousing.onmouseup = e => props.onMouseUp(swHousingElement, e);

    accessibility.makeFocusable(svgSwitch);
    accessibility.setAria(
      svgSwitch,
      "button",
      "On/Off Switch. Current state : " + props.switch ? "On" : "Off"
    );
  }
};

export const updateSwitch = (switchState: boolean): void => {
  const switchElement = window.document.getElementById("SWITCH");
  const switchInner = (window.document.getElementById(
    "SWITCH_INNER"
  ) as unknown) as SVGElement;

  if (switchElement && switchInner) {
    svg.addClass(switchInner, "sim-slide-switch-inner");

    if (switchState) {
      svg.addClass(switchInner, "on");
      switchInner.setAttribute("transform", "translate(-5,0)");
    } else {
      svg.removeClass(switchInner, "on");
      switchInner.removeAttribute("transform");
    }
    switchElement.setAttribute("aria-pressed", switchState.toString());
  }
};

export default Cpx;
