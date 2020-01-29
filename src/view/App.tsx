// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PivotItem } from "office-ui-fabric-react";
import * as React from "react";
import "./App.css";
import { Tab } from "./components/tab/Tab";
import { DEVICE_LIST_KEY } from "./constants";
import { Device } from "./container/device/Device";

interface IState {
    currentDevice?: string;
}

class App extends React.Component<{}, IState> {
    state = {
        currentDevice: DEVICE_LIST_KEY.CPX,
    };

    render() {
        return (
            <div className="App">
                <main className="App-main">
                    <Tab handleTabClick={this.handleDeviceChange} />
                    <Device currentSelectedDevice={this.state.currentDevice} />
                </main>
            </div>
        );
    }

    handleDeviceChange = (item?: PivotItem) => {
        if (item) {
            this.setState({ currentDevice: item.props.itemKey });
        }
    };
}

export default App;
