// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";
import * as React from "react";
import Simulator from "./components/Simulator";
import InputSlider from "./components/toolbar/InputSlider"
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Simulator />
          <InputSlider min={0} max={250} step={1} min_label={"min"} max_label={"max"}/>
          <a
            className="App-link"
            href="https://github.com/microsoft/vscode-python-embedded"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out our repo!
          </a>
        </header>
      </div>
    );
  }
}

export default App;
