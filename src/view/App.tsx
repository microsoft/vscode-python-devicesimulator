// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";
import * as React from "react";
import Device from "./container/device/Device"
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <main className="App-main">
          <Device/>
        </main>
      </div>
    );
  }
}

export default App;
