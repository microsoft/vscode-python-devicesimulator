
import * as React from "react";
import CPX_SVG from "./cpx_svg";
import * as SvgStyle from "./cpx_svg_style";
import svg from "./svg_utils";


interface IProps {
  name?: string;
  pixels: Array<Array<number>>;
  onClick: () => void;
}


/** Functional Component render */
const Cpx: React.FC<IProps> = props => {

  let svgElement = window.document.getElementById('svg');

  if (svgElement)
    initSvgStyle(svgElement);

  // Update LEDs state
  updateLEDs(props.pixels);
  
  return (
    CPX_SVG
  );
};


const initSvgStyle = (svgElement: HTMLElement): void => {
  let style: SVGStyleElement = svg.child(svgElement, "style", {}) as SVGStyleElement;
  style.textContent = SvgStyle.SVG_STYLE;

  // Filters for the glow effect (Adapted from : https://github.com/microsoft/pxt-adafruit/blob/master/sim/visuals/board.ts)
  let defs: SVGDefsElement = svg.child(svgElement, "defs", {}) as SVGDefsElement;

  let glow = svg.child(defs, "filter", { id: "filterglow", x: "-5%", y: "-5%", width: "120%", height: "120%" });
  svg.child(glow, "feGaussianBlur", { stdDeviation: "5", result: "glow" });
  let merge = svg.child(glow, "feMerge", {});
  for (let i = 0; i < 3; ++i) svg.child(merge, "feMergeNode", { in: "glow" })

  let neopixelglow = svg.child(defs, "filter", { id: "neopixelglow", x: "-300%", y: "-300%", width: "600%", height: "600%" });
  svg.child(neopixelglow, "feGaussianBlur", { stdDeviation: "4.3", result: "coloredBlur" });
  let neopixelmerge = svg.child(neopixelglow, "feMerge", {});
  svg.child(neopixelmerge, "feMergeNode", { in: "coloredBlur" });
  svg.child(neopixelmerge, "feMergeNode", { in: "coloredBlur" });
  svg.child(neopixelmerge, "feMergeNode", { in: "SourceGraphic" });
}


const isLightOn = (pixValue: Array<number>): boolean => {
  return ! pixValue.includes(-1);
}  


const setLED = (pixValue: Array<number>, led: HTMLElement): void => {
  if (isLightOn(pixValue)) {
    led.style.fill = "rgb(" + pixValue.toString() + ")";
    led.style.filter = `url(#neopixelglow)`;
  }  
  else {
    led.style.fill = "#c8c8c8";
    led.style.filter = `none`;
  }  
};  


const updateLEDs = (pixelsState: Array<Array<number>>): void => {
  for (let i = 0; i < 10 ; i ++) {
    let led = window.document.getElementById(`LED${i}`);
    if (led) {
      setLED(pixelsState[i], led);
    }
  }
}


export default Cpx;
