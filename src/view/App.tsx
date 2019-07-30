// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";
import * as React from "react";
import Simulator from "./components/Simulator";
import TemperatureSensorBar from "./components/toolbar/TemperatureSensorBar"
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <main className="App-main">
          <Simulator />
          <div className="sensor-scrollbox">
            <TemperatureSensorBar/>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
