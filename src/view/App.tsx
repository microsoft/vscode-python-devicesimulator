// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PivotItem } from "office-ui-fabric-react";

import * as React from "react";
import "./App.css";
import { Tab } from "./components/tab/Tab";
import { DEVICE_LIST_KEY } from "./constants";
import { Device } from "./container/device/Device";

interface vscode {
    postMessage(message: any): void;
}
declare const vscode: vscode;

const sendMessage = (type: string, state: any) => {
    vscode.postMessage({ command: type, text: state });
};
interface IState {
    currentDevice: string;
}

const defaultState = {
    currentDevice: DEVICE_LIST_KEY.CPX,
};

class App extends React.Component<{}, IState> {
    constructor() {
        super({});
        this.state = defaultState;
    }

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
        if (item && item.props && item.props.itemKey) {
            this.setState({ currentDevice: item.props.itemKey });

            sendMessage("switch-device", {
                active_device: item.props.itemKey,
            });
        }
    };
}

export default App;
