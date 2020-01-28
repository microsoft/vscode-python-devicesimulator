// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";
import * as React from "react";
import "./App.css";
import Device from "./container/device/Device";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <main className="App-main">
                    <Device />
                </main>
            </div>
        );
    }
}

export default App;
