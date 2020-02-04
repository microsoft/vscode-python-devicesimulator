// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../../styles/Simulator.css";
import { MicrobitSimulator } from "./MicrobitSimulator";

// Component grouping the functionality for micro:bit functionalities

export class Microbit extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MicrobitSimulator />
                {/* Implement toolbar here */}
            </React.Fragment>
        );
    }
}
