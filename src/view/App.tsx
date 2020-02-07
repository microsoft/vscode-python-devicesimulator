// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PivotItem } from "office-ui-fabric-react";

import * as React from "react";
import "./App.css";
import { Tab } from "./components/tab/Tab";
import CONSTANTS, { DEVICE_LIST_KEY, WEBVIEW_MESSAGES } from "./constants";
import { Device } from "./container/device/Device";
import { sendMessage } from "./utils/MessageUtils";

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

            sendMessage(WEBVIEW_MESSAGES.SWITCH_DEVICE, {
                active_device: item.props.itemKey,
            });
        }
    };
}

export default App;
