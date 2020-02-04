// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Simulator.css";
import { MicrobitImage } from "./MicrobitImage";

// Component grouping the functionality for micro:bit functionalities

export class Microbit extends React.Component {
    render() {
        return (
            <div className="simulator">
                <div className="microbit-container">
                    <MicrobitImage />
                </div>
                {/* Implement actionbar here */}
            </div>
        );
    }
}
