// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import CONSTANTS from "../../constants";
import accessibility from "./Accessibility_utils";
import CPX_SVG from "./Cpx_svg";
import * as SvgStyle from "./Cpx_svg_style";
import svg from "./Svg_utils";

interface IProps {
    pixels: number[][];
    red_led: boolean;
    brightness: number;
    switch: boolean;
    on: boolean;
    onKeyEvent: (event: KeyboardEvent, active: boolean) => void;
    onMouseUp: (button: HTMLElement, event: Event) => void;
    onMouseDown: (button: HTMLElement, event: Event) => void;
    onMouseLeave: (button: HTMLElement, event: Event) => void;
}

export class CpxImage extends React.Component<IProps, any> {
    componentDidMount() {
        const svgElement = window.document.getElementById("cpx_svg");
        if (svgElement) {
            initSvgStyle(svgElement, this.props.brightness);
            setupButtons(this.props);
            setupPins(this.props);
            setupKeyPresses(this.props.onKeyEvent);
            setupSwitch(this.props);
            this.updateImage();
        }
    }
    componentDidUpdate() {
        this.updateImage();
    }
    render() {
        return CPX_SVG;
    }
    private updateImage() {
        updateNeopixels(this.props);
        updateRedLED(this.props.red_led);
        updatePowerLED(this.props.on);
        updateSwitch(this.props.switch);
    }
}

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
        fill: SvgStyle.BUTTON_OUTER,
        height: buttonWidth,
        id: id + "_OUTER",
        rx: buttonCornerRadius,
        ry: buttonCornerRadius,
        width: buttonWidth,
        x: left,
        y: top,
    });

    const outer = btng;
    const inner = svg.child(btng, "circle", {
        id: id + "_INNER",
        cx: left + buttonWidth / 2,
        cy: top + buttonWidth / 2,
        r: buttonCircleRadius,
        fill: SvgStyle.BUTTON_NEUTRAL,
    });

    return { outer, inner };
};

const initSvgStyle = (svgElement: HTMLElement, brightness: number): void => {
    const style: SVGStyleElement = svg.child(
        svgElement,
        "style",
        {}
    ) as SVGStyleElement;
    style.textContent = SvgStyle.SVG_STYLE;

    // Filters for the glow effect (Adapted from : https://github.com/microsoft/pxt-adafruit/blob/master/sim/visuals/board.ts)
    const defs: SVGDefsElement = svg.child(
        svgElement,
        "defs",
        {}
    ) as SVGDefsElement;

    const g = svg.createElement("g") as SVGElement;
    svgElement.appendChild(g);

    const glow = svg.child(defs, "filter", {
        height: "120%",
        id: "filterglow",
        width: "120%",
        x: "-5%",
        y: "-5%",
    });
    svg.child(glow, "feGaussianBlur", { stdDeviation: "5", result: "glow" });
    const merge = svg.child(glow, "feMerge", {});
    for (let i = 0; i < 3; ++i) {
        svg.child(merge, "feMergeNode", { in: "glow" });
    }

    const neopixelglow = svg.child(defs, "filter", {
        height: "600%",
        id: "neopixelglow",
        width: "600%",
        x: "-300%",
        y: "-300%",
    });
    svg.child(neopixelglow, "feGaussianBlur", {
        result: "coloredBlur",
        stdDeviation: "4.3",
    });
    const neopixelmerge = svg.child(neopixelglow, "feMerge", {});
    svg.child(neopixelmerge, "feMergeNode", { in: "coloredBlur" });
    svg.child(neopixelmerge, "feMergeNode", { in: "coloredBlur" });
    svg.child(neopixelmerge, "feMergeNode", { in: "SourceGraphic" });

    // Brightness
    const neopixelfeComponentTransfer = svg.child(
        neopixelglow,
        "feComponentTransfer",
        {}
    );
    svg.child(neopixelfeComponentTransfer, "feFuncR", {
        id: "brightnessFilterR",
        type: "linear",
        slope: brightness,
    });
    svg.child(neopixelfeComponentTransfer, "feFuncG", {
        id: "brightnessFilterG",
        slope: brightness,
        type: "linear",
    });
    svg.child(neopixelfeComponentTransfer, "feFuncB", {
        id: "brightnessFilterB",
        slope: brightness,
        type: "linear",
    });

    // BTN A+B
    const outerBtn = (left: number, top: number, label: string) => {
        return makeButton(g, left, top, "BTN_AB");
    };

    const ab = outerBtn(165, SvgStyle.MB_HEIGHT - 15, "A+B");
    const abtext = svg.child(ab.outer, "text", {
        class: "sim-text",
        x: SvgStyle.BUTTON_TEXT_BASELINE,
        y: SvgStyle.MB_HEIGHT - 18,
    }) as SVGTextElement;
    abtext.textContent = "A+B";
};

const updateNeopixels = (props: IProps): void => {
    for (let i = 0; i < props.pixels.length; i++) {
        const led = window.document.getElementById(`NEOPIXEL_${i}`);
        if (led) {
            setNeopixel(led, props.pixels[i], props.brightness);
        }
    }
};

const updateRedLED = (propsRedLED: boolean): void => {
    const redLED = window.document.getElementById("SERIAL_LED");
    if (redLED) {
        redLED.style.fill = propsRedLED
            ? SvgStyle.RED_LED_ON
            : SvgStyle.RED_LED_OFF;
    }
};

const updatePowerLED = (propsPowerLED: boolean): void => {
    const powerLED = window.document.getElementById("PWR_LED");
    if (powerLED) {
        powerLED.style.fill = propsPowerLED
            ? SvgStyle.POWER_LED_ON
            : SvgStyle.POWER_LED_OFF;
    }
};

const setNeopixel = (
    led: HTMLElement,
    pixValue: number[],
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
            pixValue[2],
        ]);
        const innerLum = Math.max(
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

const isLightOn = (pixValue: number[]): boolean => {
    return !pixValue.every(val => {
        return val === 0;
    });
};

const changeBrightness = (filterID: string, brightness: number): void => {
    const brightnessFilter: HTMLElement | null = window.document.getElementById(
        filterID
    );
    if (brightnessFilter) {
        brightnessFilter.setAttribute("slope", brightness.toString());
    }
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

const setupPins = (props: IProps): void => {
    const pins = [
        "PIN_A1",
        "PIN_A2",
        "PIN_A3",
        "PIN_A4",
        "PIN_A5",
        "PIN_A6",
        "PIN_A7",
    ];
    pins.forEach(pinName => {
        const pin = window.document.getElementById(pinName);

        if (pin) {
            const svgPin = (pin as unknown) as SVGElement;
            svg.addClass(svgPin, `sim-${pinName}-touch`);
            accessibility.makeFocusable(svgPin);
            svgPin.onmouseup = e => props.onMouseUp(pin, e);
            svgPin.onkeyup = e => props.onKeyEvent(e, false);
            svgPin.onmousedown = e => props.onMouseDown(pin, e);
            svgPin.onkeydown = e => props.onKeyEvent(e, true);
            accessibility.setAria(
                svgPin,
                "Pin",
                `Touch pin ${pinName.substr(pinName.length - 2)}`
            );
        }
    });
};

const addButtonLabels = (button: HTMLElement) => {
    let label = "";
    if (button.id.match(/AB/) !== null) {
        label = "a+b";
    } else if (button.id.match(/A/) !== null) {
        label = "a";
    } else if (button.id.match(/B/) !== null) {
        label = "b";
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
    svgButton.onkeydown = e => props.onKeyEvent(e, true);
    svgButton.onkeyup = e => props.onKeyEvent(e, false);
    svgButton.onmouseleave = e => props.onMouseLeave(button, e);
};

const setupKeyPresses = (
    onKeyEvent: (event: KeyboardEvent, active: boolean) => void
) => {
    window.document.addEventListener("keydown", event => {
        const keyEvents = [event.key, event.code];
        // Don't listen to keydown events for the switch, run button and enter key
        if (
            !(
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.S) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.CAPITAL_F) ||
                keyEvents.includes(CONSTANTS.KEYBOARD_KEYS.ENTER)
            )
        ) {
            onKeyEvent(event, true);
        }
    });
    window.document.addEventListener("keyup", event =>
        onKeyEvent(event, false)
    );
};

const setupSwitch = (props: IProps): void => {
    const switchElement = window.document.getElementById("SWITCH");
    const swInnerElement = window.document.getElementById("SWITCH_INNER");
    const swHousingElement = window.document.getElementById("SWITCH_HOUSING");

    if (switchElement && swInnerElement && swHousingElement) {
        const svgSwitch: SVGElement = (switchElement as unknown) as SVGElement;
        const svgSwitchInner: SVGElement = (swInnerElement as unknown) as SVGElement;
        const svgSwitchHousing: SVGElement = (swHousingElement as unknown) as SVGElement;

        svg.addClass(svgSwitch, "sim-slide-switch");

        svgSwitch.onmouseup = e => props.onMouseUp(switchElement, e);
        svgSwitchInner.onmouseup = e => props.onMouseUp(swInnerElement, e);
        svgSwitchHousing.onmouseup = e => props.onMouseUp(swHousingElement, e);
        svgSwitch.onkeyup = e => props.onKeyEvent(e, false);

        accessibility.makeFocusable(svgSwitch);
        accessibility.setAria(svgSwitch, "button", "On/Off Switch");
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
export const updatePinTouch = (pinState: boolean, id: string): void => {
    console.log(`updating ${id} with ${pinState}`);
    const pinElement = window.document.getElementById(id);
    const pinSvg: SVGElement = (pinElement as unknown) as SVGElement;

    if (pinElement && pinSvg) {
        pinElement.setAttribute("aria-pressed", pinState.toString());
        pinState
            ? svg.addClass(pinSvg, "pin-pressed")
            : svg.removeClass(pinSvg, "pin-pressed");
    }
};

export default CpxImage;
