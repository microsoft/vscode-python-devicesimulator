import * as React from "react";
import CPX_SVG from "./Cpx_svg";
import * as SvgStyle from "./Cpx_svg_style";
import svg from "./Svg_utils";
import accessibility from "./Accessibility_utils";

interface IProps {
  pixels: Array<Array<number>>;
  red_led: boolean;
  brightness: number;
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
      firstTime = false;
    }
    // Update Neopixels state
    updateNeopixels(props);
    updateRedLED(props.red_led);
    setupButtons(props);
  }

  return CPX_SVG;
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
  const outButtons = ["A_OUTER", "B_OUTER"];
  const inButtons = ["A_INNER", "B_INNER"];
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

const setupButton = (button: HTMLElement, className: string, props: IProps) => {
  const svgButton = (button as unknown) as SVGElement;
  svg.addClass(svgButton, className);
  if (className.match(/outer/) !== null) {
    accessibility.makeFocusable(svgButton);
  }
  svgButton.onmousedown = e => props.onMouseDown(button, e);
  svgButton.onmouseup = e => props.onMouseUp(button, e);
  svgButton.onmouseleave = e => props.onMouseLeave(button, e);
};

export default Cpx;
