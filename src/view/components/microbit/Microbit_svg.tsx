// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Adapted from : https://makecode.microbit.org/#editor

import * as React from "react";

/* tslint:disable */

export const MICROBIT_SVG = (
    <svg
        version="1.0"
        viewBox="0 0 500 408"
        className="sim"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0)"
    >
        <defs>
            <filter id="ledglow" x="-75%" y="-75%" width="300%" height="300%">
                <feMorphology
                    operator="dilate"
                    radius={4}
                    in="SourceAlpha"
                    result="thicken"
                />
                <feGaussianBlur
                    stdDeviation={5}
                    in="thicken"
                    result="blurred"
                />
                <feFlood floodColor="rgb(255, 17, 77)" result="glowColor" />
                <feComposite
                    in="glowColor"
                    in2="blurred"
                    operator="in"
                    result="ledglow_colored"
                />
                <feMerge>
                    <feMergeNode in="ledglow_colored" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="filterglow" x="-5%" y="-5%" width="120%" height="120%">
                <feGaussianBlur stdDeviation={5} result="glow" />
                <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="glow" />
                    <feMergeNode in="glow" />
                </feMerge>
            </filter>
            <linearGradient
                id="gradient-pin-0"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-1"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-2"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-3"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-4"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-5"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-6"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-7"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-8"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-9"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-10"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-11"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-12"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-13"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-14"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-15"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-16"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-17"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-18"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-19"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-20"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-21"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-22"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-23"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
            <linearGradient
                id="gradient-pin-24"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
            >
                <stop offset="0%" style={{ stopColor: "rgb(212, 175, 55)" }} />
                <stop
                    offset="100%"
                    style={{ stopColor: "rgb(212, 175, 55)" }}
                />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
                <stop offset="100%" style={{ stopColor: "rgb(255, 85, 0)" }} />
            </linearGradient>
        </defs>
        <g>
            <path
                className="sim-board"
                d="M498,31.9C498,14.3,483.7,0,466.1,0H31.9C14.3,0,0,14.3,0,31.9v342.2C0,391.7,14.3,406,31.9,406h434.2c17.6,0,31.9-14.3,31.9-31.9V31.9z M14.3,206.7c-2.7,0-4.8-2.2-4.8-4.8c0-2.7,2.2-4.8,4.8-4.8c2.7,0,4.8,2.2,4.8,4.8C19.2,204.6,17,206.7,14.3,206.7z M486.2,206.7c-2.7,0-4.8-2.2-4.8-4.8c0-2.72.2-4.8,4.8-4.8c2.7,0,4.8,2.2,4.8,4.8C491,204.6,488.8,206.7,486.2,206.7z"
                fill="#111"
            />
            <path
                className="sim-display"
                d="M333.8,310.3H165.9c-8.3,0-15-6.7-15-15V127.5c0-8.3,6.7-15,15-15h167.8c8.3,0,15,6.7,15,15v167.8C348.8,303.6,342.1,310.3,333.8,310.3z"
                fill="#111"
                style={{ fill: "rgb(17, 17, 17)" }}
            />
            <polygon
                className="sim-theme"
                points="115,56.7 173.1,0 115,0"
                style={{ fill: "rgb(255, 58, 84)" }}
            />
            <path
                className="sim-theme"
                d="M114.2,0H25.9C12.1,2.1,0,13.3,0,27.7v83.9L114.2,0z"
                style={{ fill: "rgb(255, 58, 84)" }}
            />
            <polygon
                className="sim-theme"
                points="173,27.9 202.5,0 173,0"
                style={{ fill: "rgb(255, 58, 84)" }}
            />
            <polygon
                className="sim-theme"
                points="54.1,242.4 54.1,274.1 22.4,274.1"
                style={{ fill: "rgb(255, 58, 84)" }}
            />
            <polygon
                className="sim-theme"
                points="446.2,164.6 446.2,132.8 477.9,132.8"
                style={{ fill: "rgb(255, 58, 84)" }}
            />
            <rect
                className="sim-led-back"
                x={154}
                y={113}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={152}
                y={111}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(0,0)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={200}
                y={113}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={198}
                y={111}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(1,0)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={246}
                y={113}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={244}
                y={111}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(2,0)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={292}
                y={113}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={290}
                y={111}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(3,0)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={338}
                y={113}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={336}
                y={111}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(4,0)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={154}
                y={157}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={152}
                y={155}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(0,1)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={200}
                y={157}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={198}
                y={155}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(1,1)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={246}
                y={157}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={244}
                y={155}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(2,1)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={292}
                y={157}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={290}
                y={155}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(3,1)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={338}
                y={157}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={336}
                y={155}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(4,1)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={154}
                y={201}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={152}
                y={199}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(0,2)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={200}
                y={201}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={198}
                y={199}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(1,2)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={246}
                y={201}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={244}
                y={199}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(2,2)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={292}
                y={201}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={290}
                y={199}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(3,2)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={338}
                y={201}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={336}
                y={199}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(4,2)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={154}
                y={245}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={152}
                y={243}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(0,3)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={200}
                y={245}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={198}
                y={243}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(1,3)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={246}
                y={245}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={244}
                y={243}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(2,3)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={292}
                y={245}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={290}
                y={243}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(3,3)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={338}
                y={245}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={336}
                y={243}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(4,3)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={154}
                y={289}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={152}
                y={287}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(0,4)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={200}
                y={289}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={198}
                y={287}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(1,4)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={246}
                y={289}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={244}
                y={287}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(2,4)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={292}
                y={289}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={290}
                y={287}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(3,4)</title>
            </rect>
            <rect
                className="sim-led-back"
                x={338}
                y={289}
                width={10}
                height={20}
                rx={2}
                ry={2}
                style={{ fill: "rgb(32, 32, 32)" }}
            />
            <rect
                className="sim-led"
                x={336}
                y={287}
                width={14}
                height={24}
                rx={3}
                ry={3}
                style={{
                    filter: 'url("#ledglow")',
                    fill: "rgb(255, 127, 127)",
                    opacity: 0,
                }}
            >
                <title>(4,4)</title>
            </rect>
            <g className="sim-head no-drag">
                <circle cx={258} cy={75} r={100} fill="transparent" />
                <path
                    className="sim-theme"
                    d="M269.9,50.2L269.9,50.2l-39.5,0v0c-14.1,0.1-24.6,10.7-24.6,24.8c0,13.9,10.4,24.4,24.3,24.7v0h39.6c14.2,0,24.8-10.6,24.8-24.7C294.5,61,284,50.3,269.9,50.2 M269.7,89.2L269.7,89.2l-39.3,0c-7.7-0.1-14-6.4-14-14.2c0-7.8,6.4-14.2,14.2-14.2h39.1c7.8,0,14.2,6.4,14.2,14.2C283.9,82.9,277.5,89.2,269.7,89.2"
                    style={{ fill: "rgb(255, 58, 84)" }}
                />
                <path
                    className="sim-theme"
                    d="M230.6,69.7c-2.9,0-5.3,2.4-5.3,5.3c0,2.9,2.4,5.3,5.3,5.3c2.9,0,5.3-2.4,5.3-5.3C235.9,72.1,233.5,69.7,230.6,69.7"
                    style={{ fill: "rgb(255, 58, 84)" }}
                />
                <path
                    className="sim-theme"
                    d="M269.7,80.3c2.9,0,5.3-2.4,5.3-5.3c0-2.9-2.4-5.3-5.3-5.3c-2.9,0-5.3,2.4-5.3,5.3C264.4,77.9,266.8,80.3,269.7,80.3"
                    style={{ fill: "rgb(255, 58, 84)" }}
                />
            </g>
            <text x={310} y={100} className="sim-text" />
            <path
                className="sim-pin sim-pin-touch"
                d="M16.5,341.2c0,0.4-0.1,0.9-0.1,1.3v60.7c4.1,1.7,8.6,2.7,12.9,2.7h34.4v-64.7h0.3c0,0,0-0.1,0-0.1c0-13-10.6-23.6-23.7-23.6C27.2,317.6,16.5,328.1,16.5,341.2z M21.2,341.6c0-10.7,8.7-19.3,19.3-19.3c10.7,0,19.3,8.7,19.3,19.3c0,10.7-8.6,19.3-19.3,19.3C29.9,360.9,21.2,352.2,21.2,341.6z"
                fill="url(#gradient-pin-0)"
            >
                <title>P0, ANALOG IN</title>
            </path>
            <path
                className="sim-pin sim-pin-touch"
                d="M139.1,317.3c-12.8,0-22.1,10.3-23.1,23.1V406h46.2v-65.6C162.2,327.7,151.9,317.3,139.1,317.3zM139.3,360.1c-10.7,0-19.3-8.6-19.3-19.3c0-10.7,8.6-19.3,19.3-19.3c10.7,0,19.3,8.7,19.3,19.3C158.6,351.5,150,360.1,139.3,360.1z"
                fill="url(#gradient-pin-1)"
            >
                <title>P1, ANALOG IN</title>
            </path>
            <path
                className="sim-pin sim-pin-touch"
                d="M249,317.3c-12.8,0-22.1,10.3-23.1,23.1V406h46.2v-65.6C272.1,327.7,261.8,317.3,249,317.3z M249.4,360.1c-10.7,0-19.3-8.6-19.3-19.3c0-10.7,8.6-19.3,19.3-19.3c10.7,0,19.3,8.7,19.3,19.3C268.7,351.5,260.1,360.1,249.4,360.1z"
                fill="url(#gradient-pin-2)"
            >
                <title>P2, ANALOG IN</title>
            </path>
            <path
                className="sim-pin"
                d="M0,357.7v19.2c0,10.8,6.2,20.2,14.4,25.2v-44.4H0z"
                fill="url(#gradient-pin-3)"
            >
                <title>P3, ANALOG IN, LED Col 1</title>
            </path>
            <rect
                x="66.7"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-4)"
            >
                <title>P4, ANALOG IN, LED Col 2</title>
            </rect>
            <rect
                x="79.1"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-5)"
            >
                <title>P5, BUTTON A</title>
            </rect>
            <rect
                x="91.4"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-6)"
            >
                <title>P6, LED Col 9</title>
            </rect>
            <rect
                x="103.7"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-7)"
            >
                <title>P7, LED Col 8</title>
            </rect>
            <rect
                x="164.3"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-8)"
            >
                <title>P8</title>
            </rect>
            <rect
                x="176.6"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-9)"
            >
                <title>P9, LED Col 7</title>
            </rect>
            <rect
                x="188.9"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-10)"
            >
                <title>P10, ANALOG IN, LED Col 3</title>
            </rect>
            <rect
                x="201.3"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-11)"
            >
                <title>P11, BUTTON B</title>
            </rect>
            <rect
                x="213.6"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-12)"
            >
                <title>P12, RESERVED ACCESSIBILITY</title>
            </rect>
            <rect
                x="275.2"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-13)"
            >
                <title>P13, SPI - SCK</title>
            </rect>
            <rect
                x="287.5"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-14)"
            >
                <title>P14, SPI - MISO</title>
            </rect>
            <rect
                x="299.8"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-15)"
            >
                <title>P15, SPI - MOSI</title>
            </rect>
            <rect
                x="312.1"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-16)"
            >
                <title>P16, SPI - Chip Select</title>
            </rect>
            <rect
                x="324.5"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-17)"
            >
                <title>P17, +3v3</title>
            </rect>
            <rect
                x="385.1"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-18)"
            >
                <title>P18, +3v3</title>
            </rect>
            <rect
                x="397.4"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-19)"
            >
                <title>P19, I2C - SCL</title>
            </rect>
            <rect
                x="409.7"
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-20)"
            >
                <title>P20, I2C - SDA</title>
            </rect>
            <rect
                x={422}
                y="356.7"
                width={10}
                height={50}
                className="sim-pin"
                fill="url(#gradient-pin-21)"
            >
                <title>GND</title>
            </rect>
            <path
                className="sim-pin"
                d="M483.6,402c8.2-5,14.4-14.4,14.4-25.1v-19.2h-14.4V402z"
                fill="url(#gradient-pin-22)"
            >
                <title>GND</title>
            </path>
            <path
                className="sim-pin"
                d="M359.9,317.3c-12.8,0-22.1,10.3-23.1,23.1V406H383v-65.6C383,327.7,372.7,317.3,359.9,317.3z M360,360.1c-10.7,0-19.3-8.6-19.3-19.3c0-10.7,8.6-19.3,19.3-19.3c10.7,0,19.3,8.7,19.3,19.3C379.3,351.5,370.7,360.1,360,360.1z"
                fill="url(#gradient-pin-23)"
            >
                <title>+3v3</title>
            </path>
            <path
                className="sim-pin"
                d="M458,317.6c-13,0-23.6,10.6-23.6,23.6c0,0,0,0.1,0,0.1h0V406H469c4.3,0,8.4-1,12.6-2.7v-60.7c0-0.4,0-0.9,0-1.3C481.6,328.1,471,317.6,458,317.6z M457.8,360.9c-10.7,0-19.3-8.6-19.3-19.3c0-10.7,8.6-19.3,19.3-19.3c10.7,0,19.3,8.7,19.3,19.3C477.1,352.2,468.4,360.9,457.8,360.9z"
                fill="url(#gradient-pin-24)"
            >
                <title>GND</title>
            </path>
            <text className="sim-text-pin" x={67} y={345} />
            <text className="sim-text-pin" x={165} y={345} />
            <text className="sim-text-pin" x={275} y={345} />
            <g
                className="sim-button-group"
                focusable="true"
                tabIndex={0}
                role="button"
                aria-label="A"
                style={{ fill: "rgb(151, 151, 151)" }}
            >
                <rect
                    className="sim-button-outer"
                    x="25.9"
                    y="176.4"
                    rx={4}
                    ry={4}
                    width="56.2"
                    height="56.2"
                />
                <circle className="sim-button-nut" cx="35.9" cy="186.4" r={6} />
                <circle
                    className="sim-button-nut"
                    cx="35.9"
                    cy="222.60000000000002"
                    r={6}
                />
                <circle
                    className="sim-button-nut"
                    cx="72.1"
                    cy="222.60000000000002"
                    r={6}
                />
                <circle className="sim-button-nut" cx="72.1" cy="186.4" r={6} />
            </g>
            <path
                className="sim-button"
                d="M69.7,203.5c0,8.7-7,15.7-15.7,15.7s-15.7-7-15.7-15.7c0-8.7,7-15.7,15.7-15.7S69.7,194.9,69.7,203.5"
                fill="#111"
                style={{ fill: "rgb(17, 17, 17)" }}
            />
            <g
                className="sim-button-group"
                focusable="true"
                tabIndex={0}
                role="button"
                aria-label="B"
                style={{ fill: "rgb(151, 151, 151)" }}
            >
                <rect
                    className="sim-button-outer"
                    x="418.1"
                    y="176.4"
                    rx={4}
                    ry={4}
                    width="56.2"
                    height="56.2"
                />
                <circle
                    className="sim-button-nut"
                    cx="428.1"
                    cy="186.4"
                    r={6}
                />
                <circle
                    className="sim-button-nut"
                    cx="428.1"
                    cy="222.60000000000002"
                    r={6}
                />
                <circle
                    className="sim-button-nut"
                    cx="464.3"
                    cy="222.60000000000002"
                    r={6}
                />
                <circle
                    className="sim-button-nut"
                    cx="464.3"
                    cy="186.4"
                    r={6}
                />
            </g>
            <path
                className="sim-button"
                d="M461.9,203.5c0,8.7-7,15.7-15.7,15.7c-8.7,0-15.7-7-15.7-15.7c0-8.7,7-15.7,15.7-15.7C454.9,187.8,461.9,194.9,461.9,203.5"
                fill="#111"
                style={{ fill: "rgb(17, 17, 17)" }}
            />
            <g
                className="sim-button-group"
                focusable="true"
                tabIndex={0}
                role="button"
                aria-label="A+B"
                style={{ visibility: "hidden", fill: "rgb(51, 51, 51)" }}
            >
                <rect
                    className="sim-button-outer"
                    x={417}
                    y={250}
                    rx={4}
                    ry={4}
                    width="56.2"
                    height="56.2"
                />
                <circle className="sim-button-nut" cx={427} cy={260} r={6} />
                <circle className="sim-button-nut" cx={427} cy="296.2" r={6} />
                <circle
                    className="sim-button-nut"
                    cx="463.2"
                    cy="296.2"
                    r={6}
                />
                <circle className="sim-button-nut" cx="463.2" cy={260} r={6} />
            </g>
            <circle
                className="sim-button"
                cx={446}
                cy={278}
                r="16.5"
                fill="#111"
                style={{ visibility: "hidden", fill: "rgb(17, 17, 17)" }}
            />
            <path
                className="sim-label"
                d="M35.7,376.4c0-2.8,2.1-5.1,5.5-5.1c3.3,0,5.5,2.4,5.5,5.1v4.7c0,2.8-2.2,5.1-5.5,5.1c-3.3,0-5.5-2.4-5.5-5.1V376.4zM43.3,376.4c0-1.3-0.8-2.3-2.2-2.3c-1.3,0-2.1,1.1-2.1,2.3v4.7c0,1.2,0.8,2.3,2.1,2.3c1.3,0,2.2-1.1,2.2-2.3V376.4z"
            />
            <path
                className="sim-label"
                d="M136.2,374.1c2.8,0,3.4-0.8,3.4-2.5h2.9v14.3h-3.4v-9.5h-3V374.1z"
            />
            <path
                className="sim-label"
                d="M248.6,378.5c1.7-1,3-1.7,3-3.1c0-1.1-0.7-1.6-1.6-1.6c-1,0-1.8,0.6-1.8,2.1h-3.3c0-2.6,1.8-4.6,5.1-4.6c2.6,0,4.9,1.3,4.9,4.3c0,2.4-2.3,3.9-3.8,4.7c-2,1.3-2.5,1.8-2.5,2.9h6.1v2.7h-10C244.8,381.2,246.4,379.9,248.6,378.5z"
            />
            <path
                className="sim-button-label"
                d="M48.1,270.9l-0.6-1.7h-5.1l-0.6,1.7h-3.5l5.1-14.3h3.1l5.2,14.3H48.1z M45,260.7l-1.8,5.9h3.5L45,260.7z"
            />
            <path
                className="sim-button-label"
                d="M449.1,135.8h5.9c3.9,0,4.7,2.4,4.7,3.9c0,1.8-1.4,2.9-2.5,3.2c0.9,0,2.6,1.1,2.6,3.3c0,1.5-0.8,4-4.7,4h-6V135.8zM454.4,141.7c1.6,0,2-1,2-1.7c0-0.6-0.3-1.7-2-1.7h-2v3.4H454.4z M452.4,144.1v3.5h2.1c1.6,0,2-1,2-1.8c0-0.7-0.4-1.8-2-1.8H452.4z"
            />
            <path
                className="sim-label"
                d="M352.1,381.1c0,1.6,0.9,2.5,2.2,2.5c1.2,0,1.9-0.9,1.9-1.9c0-1.2-0.6-2-2.1-2h-1.3v-2.6h1.3c1.5,0,1.9-0.7,1.9-1.8c0-1.1-0.7-1.6-1.6-1.6c-1.4,0-1.8,0.8-1.8,2.1h-3.3c0-2.4,1.5-4.6,5.1-4.6c2.6,0,5,1.3,5,4c0,1.6-1,2.8-2.1,3.2c1.3,0.5,2.3,1.6,2.3,3.5c0,2.7-2.4,4.3-5.2,4.3c-3.5,0-5.5-2.1-5.5-5.1H352.1z"
            />
            <path
                className="sim-label"
                d="M368.5,385.9h-3.1l-5.1-14.3h3.5l3.1,10.1l3.1-10.1h3.6L368.5,385.9z"
            />
            <path
                className="sim-label"
                d="M444.4,378.3h7.4v2.5h-1.5c-0.6,3.3-3,5.5-7.1,5.5c-4.8,0-7.5-3.5-7.5-7.5c0-3.9,2.8-7.5,7.5-7.5c3.8,0,6.4,2.3,6.6,5h-3.5c-0.2-1.1-1.4-2.2-3.1-2.2c-2.7,0-4.1,2.3-4.1,4.7c0,2.5,1.4,4.7,4.4,4.7c2,0,3.2-1.2,3.4-2.7h-2.5V378.3z"
            />
            <path
                className="sim-label"
                d="M461.4,380.9v-9.3h3.3v14.3h-3.5l-5.2-9.2v9.2h-3.3v-14.3h3.5L461.4,380.9z"
            />
            <path
                className="sim-label"
                d="M472.7,371.6c4.8,0,7.5,3.5,7.5,7.2s-2.7,7.2-7.5,7.2h-5.3v-14.3H472.7z M470.8,374.4v8.6h1.8c2.7,0,4.2-2.1,4.2-4.3s-1.6-4.3-4.2-4.3H470.8z"
            />
        </g>
        <g />
        <g />
    </svg>
);
