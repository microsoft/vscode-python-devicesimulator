// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";
import * as React from "react";
import Simulator from "./components/Simulator";
import ToolBar from "./components/toolbar/ToolBar";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <main className="App-main">
          <Simulator />

          <ToolBar />
        </main>
      </div>
    );
  }
}

export default App;
