// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PivotItem } from "office-ui-fabric-react";

import * as React from "react";
import "./App.css";
import { Tab } from "./components/tab/Tab";
import {
    DEVICE_LIST_KEY,
    VSCODE_MESSAGES_TO_WEBVIEW,
    WEBVIEW_MESSAGES,
} from "./constants";
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
    componentDidMount() {
        window.addEventListener("message", this.handleMessage);
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.handleMessage);
    }

    render() {
        return (
            <div className="App">
                <main className="App-main">
                    <Tab
                        handleTabClick={this.handleDeviceChange}
                        currentActiveDevice={this.state.currentDevice}
                    />
                    <Device currentSelectedDevice={this.state.currentDevice} />
                </main>
            </div>
        );
    }

    handleDeviceChange = (item?: PivotItem) => {
        if (item && item.props && item.props.itemKey) {
            sendMessage(WEBVIEW_MESSAGES.SWITCH_DEVICE, {
                active_device: item.props.itemKey,
            });
            this.setState({ currentDevice: item.props.itemKey });
        }
    };
    handleMessage = (event: any): void => {
        const message = event.data;
        console.log(JSON.stringify(message));
        if (
            message.command === VSCODE_MESSAGES_TO_WEBVIEW.SET_DEVICE &&
            message.active_device !== this.state.currentDevice
        ) {
            this.setState({ currentDevice: message.active_device });
        }
    };
}

export default App;
