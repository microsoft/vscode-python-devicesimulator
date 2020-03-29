// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Clue.css";
import { DEFAULT_CLUE_STATE } from "./ClueSimulator";
export interface IRefObject {
    [key: string]: React.RefObject<SVGRectElement>;
}
interface IProps {
    displayImage: string;
    neopixel: number[]
}
const LED_TINT_FACTOR = 0.5
export class ClueSvg extends React.Component<IProps, {}> {
    private svgRef: React.RefObject<SVGSVGElement> = React.createRef();
    private neopixel: React.RefObject<SVGCircleElement> = React.createRef()
    private pixelStopGradient: React.RefObject<SVGStopElement> = React.createRef()

    private buttonRefs: IRefObject = {
        BTN_A: React.createRef(),
        BTN_B: React.createRef(),
        BTN_AB: React.createRef(),
    };

    private displayRef: React.RefObject<SVGImageElement> = React.createRef();

    public getSvgRef(): React.RefObject<SVGSVGElement> {
        return this.svgRef;
    }
    public getButtons(): IRefObject {
        return this.buttonRefs;
    }
    public getDisplayRef(): React.RefObject<SVGImageElement> {
        return this.displayRef;
    }
    componentDidMount() {
        this.updateDisplay();
        this.updateNeopixel()

    }
    componentDidUpdate() {
        this.updateDisplay();
        this.updateNeopixel()
    }

    render() {
        return (
            <div className="microbit-svg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 375 250.98"
                    ref={this.svgRef}
                    x="0px"
                    y="0px"
                    width="100%"
                    height="100%"
                >
                    <defs >
                        <radialGradient id="grad1" cx="50%" cy="50%" r="70%" fx="50%" fy="50%" >
                            <stop offset="0%" stopColor="rgb(0,0,0)" stopOpacity="1" ref={this.pixelStopGradient} />
                            <stop offset="100%" stopOpacity="0" />
                        </radialGradient></defs>
                    <g id="Green">
                        <rect
                            className="cls-1"
                            x="1.92"
                            y="0.99"
                            width="301.98"
                            height="248.98"
                            rx="18.28"
                        />
                        <path
                            d="M352.66,281.16c-.24-1.61.56-3.37.5-5-.06-1.82,0-3.29,0-5.11,0-.6-.93-1.17-.59-1.49v0c0-.93.14-1.84.12-2.78a2.35,2.35,0,0,1,0-.47H51a2.15,2.15,0,0,1,.09.59c0,3.63-.33,7.25-.41,10.88a19.72,19.72,0,0,0,.34,4.79,29.45,29.45,0,0,0,1.71,4.74c.48,1.19.85,2.37,1.43,3.49l.66.63a8.82,8.82,0,0,0,1.52,1.2,14.9,14.9,0,0,1,2.11,1.61c.52.49,1,1,1.53,1.51a13,13,0,0,0,7.93,2.64,1.86,1.86,0,0,1,1.34.55H336.36a2.16,2.16,0,0,1,.6-.32c1.47-.51,3-1,4.44-1.47.74-.25,1.48-.52,2.21-.81l.22-.09.53-.23,1.05-.51c.16-.19.32-.38.49-.55a11.28,11.28,0,0,1,1.78-1.45l.71-.5c-.1.07.28-.25.28-.25s.21-.2.31-.3l.13-.12.07-.1.22-.3.48-.62c.47-1.27.86-2.58,1.31-3.85.27-.74.54-1.48.75-2.23a10.88,10.88,0,0,0,.26-1.13.64.64,0,0,1,0-.07v-.07q0-.35,0-.69a2,2,0,0,1,.51-1.29C352.73,281.68,352.7,281.41,352.66,281.16Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-2"
                            d="M337.11,97.27l-8.21,8a5.75,5.75,0,0,1-5.11,1.67,10.11,10.11,0,0,1-5.69-3.26,9.08,9.08,0,0,1-2.92-5.53,6.28,6.28,0,0,1,2.18-5l8.09-7.85,4.8,4.94L322.17,98a1.39,1.39,0,0,0-.11,2.21,1.36,1.36,0,0,0,2.18-.08l8.07-7.84Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <circle
                            className="cls-3"
                            cx="245.66"
                            cy="20.77"
                            r="6.6"
                        />
                    </g>
                    <g id="Clue">
                        <path
                            className="cls-2"
                            d="M307.54,78.85a15.08,15.08,0,1,0-2.61,2.78l-4.61-4.73a9.3,9.3,0,1,1,2.5-2.71Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <polygon
                            className="cls-2"
                            points="265.35 26.2 269.45 30.3 259.85 39.06 265.63 45.11 262.09 48.44 251.64 38.41 265.35 26.2"
                        />
                        <polygon
                            className="cls-2"
                            points="276.59 62.99 289.35 50.19 300.35 61.15 296.77 64.66 290.07 58.19 288.88 59.39 295.73 66.25 292.62 69.37 285.77 62.5 284.69 63.58 291.51 70.41 287.58 73.99 276.59 62.99"
                        />
                    </g>
                    <g id="Finger_Prints_A" data-name="Finger Prints A">
                        <path
                            className="cls-4"
                            d="M56.44,206.71s-4,.81-5.08.3"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M115.19,141.85S107,131,89.4,131.58"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M86.93,131.55s-16,1-22.88,9.67c0,0-6,7.85-12.69,10.41"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M115.19,146.78s-8.87-12.47-27.15-12a35.07,35.07,0,0,0-20.3,7.47S55,155.13,53.57,155.75c-3.49,1.56-2.94,1.16-2.94,1.16"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M116.55,154.8s-5.43-14.1-25.71-16.72c0,0-15.78,0-25,10.21"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M105.87,147.52s-14-12.75-31.18-1.62c0,0-9.16,6.27-9.43,7.6"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M108.11,149.69s12.43,8.9,4.87,27.41c0,0-14.65,24-34.36,31.87"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M85.09,201.08s22.62-15.61,25.51-27.61"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M91.68,145.64s21.42-.51,20.36,24.7"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M101.48,152.82s24.86,15-17,44.75"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M115.19,182.53s-24,28.17-39.43,32"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M115.31,187.21c-.51-.47-17.81,23.27-40.22,31.12"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M115.19,192.85s-24.84,26.76-39.43,28.33"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M65.74,148.45S55.6,160.61,51.26,160.61"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M63.46,155.69S53,165.84,51.36,164.41"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M63.92,160.13s-9.49,8.58-12.57,8.05"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M63.92,166.34s-9.53,4.74-11.82,4.74"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M63.28,174.08s-9.07,5.55-12.28,4.67"
                            transform="translate(-49.27 -48.48)"
                        />
                        <line
                            className="cls-4"
                            x1="14.37"
                            y1="130.55"
                            x2="2.53"
                            y2="133.56"
                        />
                        <path
                            className="cls-4"
                            d="M63.28,182.53S51.91,184.31,51,187.68c0,0,.26,3.95,14.56-2.56"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M71.09,153s9.67-9.07,16.46-7.75c0,0,3.72,2.71,0,3.19,0,0-11.11,3.12-12,5.05"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M92.85,185.35S84.46,198.59,59.44,206"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M88,185.12s-16,18.23-36.59,18.87"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M81.43,185.12s-12.16,13.24-30.9,15.42"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M76.62,185.12s-17.78,11.82-26.54,11.54"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M69.27,185.35c-1.14,1.32-12.46,7.88-17.91,7"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M50.53,211C74.23,208.24,82,199.2,82,199.2s3.55,3.57-2.24,5.62c0,0-7.7,3.69-8.06,14.79"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-5"
                            d="M64.67,220.54c-1.22-2.53,1.35-5.16,1.84-5.71s-5.05,3.43-8.14,2.44"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M71.64,209.67c.68-.52-14.32,6.57-20.64,4.83"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-6"
                            d="M68.7,220.6c-1.89-2.94,2.33-10.1,2.84-10.76"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M95.17,155.18a6.87,6.87,0,0,1,4.12.9c4.26,2.28,9.24,9.44,1.22,21L90.3,188.47"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M98.88,151.63s-7.68-5.19-16.61,3.51"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-7"
                            d="M94.86,177.1s7.45-5.5,6.38-10.76c-1.26-6.22-2.36-5.56-6.38-6.21"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M95,171.08s5.24-2,3.5-4.6c-.79-1.16-3.3-1.93-4.18-1.93"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-8"
                            d="M54,136.57s15.76-9.34,16.09-9.42,3.7,2.21,3.41,3.76c0,0-11.71,13-13.37,14.65-.74.72-2.32-3-2.37-3.63s3-3.1,3-3.1l-1.12-1.29-3.48,3.06S53,138.6,54,136.57Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-2"
                            d="M62.25,135.36c.09-.14,5.61-2.87,5.61-2.87l-4.52,4.61Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M63.64,170.34s-10.09,5.18-12.38,5"
                            transform="translate(-49.27 -48.48)"
                        />
                    </g>
                    <g id="Bottom">
                        <path
                            className="cls-9"
                            d="M335.52,298.51c1.73-.47,3.56-.61,5.25-1.17.4-.14.79-.29,1.18-.45l.26-.11.82-.34q.6-.26,1.23-.48l-.16-40.78s-.11-11.64-14.42-11.77c-14.3.13-13.42,11.77-13.42,11.77V298.5c6.23.17,11.41.22,16.19.2l2.81-.09A1.17,1.17,0,0,1,335.52,298.51Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-9"
                            d="M269.57,244.65c-14.3.13-13.42,11.78-13.42,11.78v41.78a53.61,53.61,0,0,1,7.28.19h.08c.85,0,1.7,0,2.56,0,1.76.07,3.53.06,5.29.06h5.57c.87,0,1.73,0,2.6.06a11,11,0,0,0,1.87-.36,2.58,2.58,0,0,1,1.27.11l1.32-.14V256.43S283.88,244.78,269.57,244.65Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-9"
                            d="M200.66,298.39c4.71.21,9.43.3,14.14.31l.48,0a2.2,2.2,0,0,1,.6-.12,2.55,2.55,0,0,1,.51-.11v-42s-.12-11.65-14.42-11.78c-14.31.13-13.42,11.78-13.42,11.78v42l.31,0a16.3,16.3,0,0,0,3.35.05h3.39l4.33,0A1.67,1.67,0,0,1,200.66,298.39Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-9"
                            d="M148.42,298.45v-42s-.11-11.65-14.41-11.78h0c-14.31.13-13.42,11.78-13.42,11.78v41.89C132.07,298,140,298.7,148.42,298.45Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-9"
                            d="M61.42,296.3l.24.11a4.86,4.86,0,0,1,.78.49,1.91,1.91,0,0,1,.52.46c4.79.23,19.65.77,25.72.83l-.15-41.45S88.42,245.1,74.12,245c-14.31.13-13.42,11.77-13.42,11.77Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <circle cx="85.24" cy="210.35" r="12.23" />
                        <circle cx="153.2" cy="210.35" r="12.23" />
                        <circle cx="220.8" cy="210.35" r="12.23" />
                        <circle cx="280.98" cy="210.35" r="12.23" />
                        <circle cx="25.35" cy="210.35" r="12.23" />
                        <rect
                            className="cls-10"
                            x="40.39"
                            y="219.54"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="48.31"
                            y="219.46"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="56.23"
                            y="219.46"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="64.16"
                            y="219.46"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="100.43"
                            y="219.76"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="108.36"
                            y="219.76"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="116.13"
                            y="219.76"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="124.05"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="132.03"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="168.17"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="176.09"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="184.01"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="191.94"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="199.86"
                            y="219.67"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="235.94"
                            y="219.61"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="243.87"
                            y="219.61"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="251.79"
                            y="219.41"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <rect
                            className="cls-10"
                            x="259.71"
                            y="219.41"
                            width="5.97"
                            height="30.12"
                            rx="0.72"
                        />
                        <path
                            className="cls-10"
                            d="M352.06,289.38V268.61a.78.78,0,0,0-.82-.72h-5.18a.78.78,0,0,0-.82.72v25.76l1.34.56c.71-.48,1.45-.93,2.18-1.4a9.06,9.06,0,0,0,1.45-1.23,5.31,5.31,0,0,0,.66-1,1.6,1.6,0,0,1,.65-.61,2,2,0,0,1,.37-.84A.73.73,0,0,0,352.06,289.38Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-10"
                            d="M52.92,291.09h0c.12-.6,0-.12,0,.13l.08.26a1.58,1.58,0,0,1,.49.73v0a1.49,1.49,0,0,0,.15.2,10.15,10.15,0,0,0,1.42,1.07,15.45,15.45,0,0,0,2.9,1.37l1,.33a3.7,3.7,0,0,1,.9.39V268.71a.83.83,0,0,0-.91-.72H53.34a.83.83,0,0,0-.91.72v20.61a2.84,2.84,0,0,1,.24.26A1.75,1.75,0,0,1,52.92,291.09Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-11"
                            d="M76,297"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-11"
                            d="M107.76,292.27"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M136.31,286.57h-1.49V281a5,5,0,0,1-1.91,1.12v-1.34a4.35,4.35,0,0,0,1.26-.72,2.76,2.76,0,0,0,.93-1.24h1.21Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M205.2,285.25v1.38H200a3.63,3.63,0,0,1,.51-1.48,9.93,9.93,0,0,1,1.66-1.86A10.32,10.32,0,0,0,203.4,282a1.61,1.61,0,0,0,.31-.91,1,1,0,0,0-.27-.76,1,1,0,0,0-.73-.27,1,1,0,0,0-.74.28,1.48,1.48,0,0,0-.32.93l-1.47-.15a2.39,2.39,0,0,1,.82-1.75,2.78,2.78,0,0,1,1.74-.54,2.51,2.51,0,0,1,1.8.62,2,2,0,0,1,.66,1.54,2.81,2.81,0,0,1-.19,1,4.43,4.43,0,0,1-.59,1,9.4,9.4,0,0,1-1,1c-.47.43-.77.72-.89.86a2.6,2.6,0,0,0-.31.41Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M263.73,283.81l1.44-.17a1.37,1.37,0,0,0,.37.84,1,1,0,0,0,1.5-.06,1.35,1.35,0,0,0,.31-.94,1.28,1.28,0,0,0-.3-.89,1,1,0,0,0-.73-.32,2.33,2.33,0,0,0-.68.11l.16-1.21a1.33,1.33,0,0,0,.92-.26.94.94,0,0,0,.31-.74.81.81,0,0,0-.23-.62.85.85,0,0,0-.62-.23.9.9,0,0,0-.64.26,1.25,1.25,0,0,0-.33.77l-1.37-.23a3.16,3.16,0,0,1,.43-1.12,1.94,1.94,0,0,1,.8-.66,2.74,2.74,0,0,1,1.16-.24,2.29,2.29,0,0,1,1.75.7,1.8,1.8,0,0,1,.54,1.28,1.83,1.83,0,0,1-1.11,1.63,1.72,1.72,0,0,1,1.06.64,1.8,1.8,0,0,1,.4,1.19,2.35,2.35,0,0,1-.74,1.74,2.81,2.81,0,0,1-3.6.11A2.4,2.4,0,0,1,263.73,283.81Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M272.09,285.86l-2.76-7.73H271l2,5.72,1.89-5.72h1.66l-2.77,7.73Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M322.5,283.73v-1.31h3.36v3.08a4.19,4.19,0,0,1-1.42.84,5.2,5.2,0,0,1-1.89.36,4.23,4.23,0,0,1-2.11-.51,3.29,3.29,0,0,1-1.36-1.45,4.77,4.77,0,0,1-.45-2.06,4.44,4.44,0,0,1,.51-2.15,3.33,3.33,0,0,1,1.48-1.44,3.93,3.93,0,0,1,1.85-.38,3.71,3.71,0,0,1,2.25.6,2.7,2.7,0,0,1,1,1.67l-1.55.29a1.64,1.64,0,0,0-.61-.9,1.89,1.89,0,0,0-1.13-.33,2.13,2.13,0,0,0-1.63.65,2.73,2.73,0,0,0-.6,1.92,3,3,0,0,0,.61,2.07,2,2,0,0,0,1.6.69,2.69,2.69,0,0,0,1-.2,3,3,0,0,0,.84-.46v-1Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M327.32,286.57v-7.73h1.51L332,284v-5.16h1.45v7.73h-1.57l-3.11-5v5Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M335.09,278.84H338a5.51,5.51,0,0,1,1.47.15,2.54,2.54,0,0,1,1.16.71,3.32,3.32,0,0,1,.74,1.25,5.65,5.65,0,0,1,.25,1.83,5,5,0,0,1-.23,1.64,3.52,3.52,0,0,1-.83,1.37,2.83,2.83,0,0,1-1.1.62,5,5,0,0,1-1.38.16h-2.94Zm1.56,1.31v5.12h1.17a4,4,0,0,0,.94-.08,1.35,1.35,0,0,0,.63-.32,1.55,1.55,0,0,0,.41-.75,4.79,4.79,0,0,0,.16-1.41,4.48,4.48,0,0,0-.16-1.38,1.72,1.72,0,0,0-.44-.75,1.45,1.45,0,0,0-.72-.36,7.16,7.16,0,0,0-1.28-.07Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            d="M74.76,278.24a2.11,2.11,0,0,1,1.75.8,6.91,6.91,0,0,1,0,6.3,2.11,2.11,0,0,1-1.75.8,2.21,2.21,0,0,1-1.82-.87A7.08,7.08,0,0,1,73,279,2.13,2.13,0,0,1,74.76,278.24Zm0,1.23a.76.76,0,0,0-.48.17,1.2,1.2,0,0,0-.33.62,8.54,8.54,0,0,0-.15,1.93,7.85,7.85,0,0,0,.14,1.87,1.29,1.29,0,0,0,.34.68.76.76,0,0,0,1,0,1.13,1.13,0,0,0,.32-.62,7.85,7.85,0,0,0,.16-1.93,8.44,8.44,0,0,0-.14-1.87,1.42,1.42,0,0,0-.34-.68A.76.76,0,0,0,74.76,279.47Z"
                            transform="translate(-49.27 -48.48)"
                        />
                    </g>
                    <g id="Finger_Prints_B" data-name="Finger Prints B">
                        <line
                            className="cls-4"
                            x1="301.28"
                            y1="125.01"
                            x2="303.85"
                            y2="125.01"
                        />
                        <path
                            className="cls-12"
                            d="M344.42,194.53l4.53,4.09v3.74l-2,2.89-3,.95s1.09,1.45.13,2.6-2.88,3.46-4.23,3.56-4.23-1.49-5.28-2.21c-.82-.56-2.5-2-2.5-2l12.38-13.47"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-2"
                            d="M344.46,199.68s2,1.59.64,3.16c0,0-2.05,1.57-2.68,1.11l-.91-1Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-2"
                            d="M336.52,208.15l2.84-3.13a1.39,1.39,0,0,1,1.31,1.44s-1,3.41-2.07,3.16C338.6,209.62,336.51,209.74,336.52,208.15Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M287.52,141.58a33.74,33.74,0,0,1,26.82-11.13"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M316.82,130.42s16,1,22.87,9.66c0,0,6,7.85,12.69,10.42"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M287.74,146.43A34.47,34.47,0,0,1,336,141.12s12.79,12.88,14.18,13.5c3.48,1.56,2.94,1.15,2.94,1.15"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M287.19,153.67s5.43-14.1,25.71-16.73c0,0,15.79.05,25,10.22"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M297.87,146.39s14-12.75,31.18-1.62c0,0,8.23,5.45,8.49,6.78"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M295.93,148.26s-13.35,11.21-5.16,27.7c0,0,14.65,24,34.35,31.87"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M318.65,199.94s-22.62-15.61-25.5-27.61"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M312.06,144.51s-24.32,1.92-19.47,25.44"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M302.17,151.55s-22.49,18.4,17.11,44.88"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M287,178.13s4.77,6.64,5.88,7.37"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M294.5,187.66s18.81,21.52,33.49,25.7"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M287,184.45c.51-.47,19.21,24.9,41.62,32.74"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M287.75,190.81S313.4,218.48,328,220"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M338,147.31s10.63,12,13.65,12.16"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M340.28,154.56s10.44,10.14,12.1,8.72"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M339.83,159s9.21,8.58,11.82,7.91"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M339.83,165.21s9.53,4.74,11.82,4.74"
                            transform="translate(-49.27 -48.48)"
                        />
                        <line
                            className="cls-4"
                            x1="290.56"
                            y1="120.26"
                            x2="298.72"
                            y2="124.28"
                        />
                        <path
                            className="cls-4"
                            d="M340.46,172.94s9.07,5.55,12.29,4.67"
                            transform="translate(-49.27 -48.48)"
                        />
                        <line
                            className="cls-4"
                            x1="290.84"
                            y1="129.42"
                            x2="302.68"
                            y2="132.43"
                        />
                        <path
                            className="cls-4"
                            d="M340.46,181.4s11.37,1.78,12.29,5.15c0,0,.37,3.87-12.64-1.88"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M332.65,151.87s-9.66-9.06-16.45-7.74c0,0-3.73,2.7,0,3.18,0,0,10.44,2.3,11.36,4.24"
                            transform="translate(-49.27 -48.48)"
                        />
                        <line
                            className="cls-4"
                            x1="299.12"
                            y1="155.01"
                            x2="303.12"
                            y2="156.54"
                        />
                        <path
                            className="cls-4"
                            d="M312.05,184.77s13.24,14.41,25.12,17.6"
                            transform="translate(-49.27 -48.48)"
                        />
                        <line
                            className="cls-4"
                            x1="299.91"
                            y1="152.87"
                            x2="303.9"
                            y2="153.36"
                        />
                        <path
                            className="cls-4"
                            d="M349.17,201.35"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M339.54,199.62"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M317.48,185c-.09-.15,10.84,10.54,22.06,14.67"
                            transform="translate(-49.27 -48.48)"
                        />
                        <line
                            className="cls-4"
                            x1="299.67"
                            y1="149.65"
                            x2="303.48"
                            y2="150.39"
                        />
                        <path
                            className="cls-4"
                            d="M323.16,185a39.85,39.85,0,0,0,19.21,11.75"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M328.65,185s14.77,9.86,23.73,10.55"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M334.13,184.45c1.94,2.33,12.8,7.64,18.25,6.78"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M334.61,205c-4.31-1.83-12.91-7-12.91-7s-2.42,3.81,2.24,5.62c0,0,7.71,3.69,8.07,14.79"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M338.6,218.29c1.65-2.77-1-6-1.54-6.74s5.45,4.45,9.1,3.62"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M332.63,207.48c-.49-.69,4.23,5.35,6.89,4.81"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M335,218.48c2.07-2.87-1.91-10.31-2.41-11"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M308.57,154.05a6.88,6.88,0,0,0-4.12.9c-4.26,2.27-9.23,9.43-1.22,21l6.4,7.7"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M304.45,149.78s7.07-3.21,10.94,1.26"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-7"
                            d="M308.89,176s-6.27-5-5.27-10.23a8.83,8.83,0,0,1,5.27-6.73"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M308.55,170s-2.65-1.89-1.77-4.23a3.08,3.08,0,0,1,2.11-1.79"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M345.59,205.67l2.39,2.16s3.67,1.95,4.78,1.68"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-4"
                            d="M343.13,209.87l2.59,1.45s5,2.41,7.4,2.17"
                            transform="translate(-49.27 -48.48)"
                        />
                    </g>
                    <g id="Buttons">
                        <rect
                            className="cls-10"
                            x="258.06"
                            y="100.27"
                            width="35.04"
                            height="34.82"
                            rx="1.79"
                        />
                        <circle
                            className="cls-13"
                            cx="275.58"
                            cy="117.58"
                            r="11.6"
                        />
                        <circle
                            className="cls-14"
                            cx="262.37"
                            cy="104.6"
                            r="3.23"
                        />
                        <circle
                            className="cls-14"
                            cx="288.79"
                            cy="104.6"
                            r="3.23"
                        />
                        <circle
                            className="cls-14"
                            cx="288.8"
                            cy="130.74"
                            r="3.23"
                        />
                        <circle
                            className="cls-14"
                            cx="262.37"
                            cy="130.74"
                            r="3.23"
                        />
                        <rect
                            className="cls-15"
                            x="13.19"
                            y="100.56"
                            width="35.04"
                            height="34.82"
                            rx="1.79"
                        />
                        <circle
                            className="cls-13"
                            cx="30.71"
                            cy="117.86"
                            r="11.6"
                        />
                        <circle
                            className="cls-14"
                            cx="17.49"
                            cy="104.88"
                            r="3.23"
                        />
                        <circle
                            className="cls-14"
                            cx="43.92"
                            cy="104.88"
                            r="3.23"
                        />
                        <circle
                            className="cls-14"
                            cx="43.92"
                            cy="131.03"
                            r="3.23"
                        />
                        <circle
                            className="cls-14"
                            cx="17.49"
                            cy="131.03"
                            r="3.23"
                        />
                    </g>
                    <g id="Buttons_at_top" data-name="Buttons at top">
                        <rect
                            className="cls-16"
                            x="105.78"
                            y="5.76"
                            width="17.4"
                            height="8.98"
                        />
                        <rect
                            className="cls-16"
                            x="182.92"
                            y="7.04"
                            width="17.4"
                            height="8.98"
                        />
                        <rect
                            x="141.05"
                            y="3.38"
                            width="24.18"
                            height="15.57"
                        />
                        <polyline
                            className="cls-17"
                            points="101.04 11.16 57.9 11.16 53.94 14.23"
                        />
                        <text
                            className="cls-18"
                            transform="translate(29.59 11.79) rotate(45.15) scale(1 1.56)"
                        >
                            LIGHT
                        </text>
                        <text
                            className="cls-18"
                            transform="translate(22.78 18.93) rotate(45.15) scale(1 1.56)"
                        >
                            GESTURE
                        </text>
                        <text
                            className="cls-18"
                            transform="translate(15.48 26.01) rotate(45.15) scale(1 1.56)"
                        >
                            P
                            <tspan className="cls-19" x="4.13" y={0}>
                                R
                            </tspan>
                            <tspan className="cls-20" x="8.47" y={0}>
                                O
                            </tspan>
                            <tspan x="13.43" y={0}>
                                XIMI
                            </tspan>
                            <tspan className="cls-21" x="28.48" y={0}>
                                T
                            </tspan>
                            <tspan x="32.56" y={0}>
                                Y
                            </tspan>
                        </text>
                        <path
                            className="cls-2"
                            d="M74,56.37l1.72-1.8.9.86-1.72,1.8L76.73,59l-.86.91-1.8-1.72-1.72,1.8-.9-.86,1.72-1.8-1.81-1.72.86-.9Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <path
                            className="cls-2"
                            d="M66.81,63.6l1.72-1.81.9.86-1.72,1.81,1.8,1.71-.86.91-1.8-1.72-1.72,1.8-.9-.86L66,64.5l-1.81-1.72.86-.9Z"
                            transform="translate(-49.27 -48.48)"
                        />
                        <rect
                            className="cls-2"
                            x="127.86"
                            y="5.76"
                            width="8.61"
                            height="12.92"
                        />
                        <rect
                            className="cls-2"
                            x="169.77"
                            y="5.76"
                            width="8.61"
                            height="12.92"
                        />
                    </g>
                    <g id="Frame">
                        <rect
                            className="cls-22"
                            x="62"
                            y="25"
                            width="182"
                            height="158"
                        />
                        <image
                            ref={this.displayRef}
                            x={65}
                            y={28}
                            width={176}
                            height={152}
                        />
                        <rect
                            className="cls-23"
                            x="1.82"
                            y="0.99"
                            width="301.98"
                            height="248.98"
                            rx="18.28"
                        />
                    </g>
                    <text x={318} y={85} className="sim-text-outside">
                        Neopixel
                        </text>
                    <circle cx={345} cy={115} r="30" fill="url(#grad1)" />
                    <circle cx={345} cy={115} r="12" ref={this.neopixel} />
                </svg>
            </div>
        );
    }
    private updateDisplay() {
        if (this.displayRef.current && this.props.displayImage) {
            this.displayRef.current.setAttribute(
                "href",
                `data:image/png;base64,${this.props.displayImage}`
            );
        }
    }
    private updateNeopixel() {
        const { neopixel } = this.props
        const rgbColor = `rgb(${neopixel[0] + (255 - neopixel[0]) * LED_TINT_FACTOR},
        ${neopixel[1] + (255 - neopixel[1]) * LED_TINT_FACTOR},${neopixel[2] + (255 - neopixel[2]) * LED_TINT_FACTOR})`

        if (this.neopixel.current) {
            this.neopixel.current.setAttribute('fill', rgbColor)
        }
        if (this.pixelStopGradient.current) {
            if (neopixel === DEFAULT_CLUE_STATE.neopixel) {
                console.log("remove opacity")

                this.pixelStopGradient.current.setAttribute('stop-opacity', '0')
            } else {
                this.pixelStopGradient.current.setAttribute('stop-opacity', '1')

            }
            this.pixelStopGradient.current.setAttribute('stop-color', rgbColor)
        }

    }
}
