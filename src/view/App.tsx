// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";
import * as React from "react";
import Simulator from "./components/Simulator";
import InputSlider from "./components/toolbar/InputSlider";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <main className="App-main">
          <Simulator />
          <InputSlider
            min={0}
            max={250}
            step={1}
            min_label={"min"}
            max_label={"max"}
          />
        </main>
      </div>
    );
  }
}

export default App;
