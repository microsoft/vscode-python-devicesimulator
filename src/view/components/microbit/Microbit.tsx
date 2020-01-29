// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { MicrobitImage } from "./MicrobitImage";

// Component grouping the functionality for circuit playground express

export class Microbit extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MicrobitImage />
            </React.Fragment>
        );
    }
}
