// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "./App.css";
import {
    DEVICE_LIST_KEY,
    VIEW_STATE,
    VSCODE_MESSAGES_TO_WEBVIEW,
    WEBVIEW_ATTRIBUTES_KEY,
    WEBVIEW_TYPES,
} from "./constants";
import { Device } from "./container/device/Device";
import { ViewStateContext } from "./context";
import { GettingStartedPage } from "./pages/gettingStarted";

interface IState {
    currentDevice: string;
    viewState: VIEW_STATE;
    type?:WEBVIEW_TYPES;
}

const defaultState = {
    currentDevice: DEVICE_LIST_KEY.CPX,
    viewState: VIEW_STATE.RUNNING,
    type:undefined
};

class App extends React.Component<{}, IState> {
    constructor() {
        super({});
        this.state = defaultState;
    }
    componentDidMount() {
        if (document.currentScript) {
            const webviewTypeAttribute = document.currentScript.getAttribute(
                WEBVIEW_ATTRIBUTES_KEY.TYPE
            ) as WEBVIEW_TYPES;
            if (webviewTypeAttribute) {
                this.setState({type:webviewTypeAttribute})

            } else {
                const initialDevice = document.currentScript.getAttribute(
                    "initialDevice"
                );

                if (initialDevice) {
                    // Attach message listeners only for devices
                    this.setState({ currentDevice: initialDevice });
                    window.addEventListener("message", this.handleMessage);
                }
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.handleMessage);
    }

    render() {
        return (
            <div className="App">
                <main className="App-main">
                    <ViewStateContext.Provider value={this.state.viewState}>
                        <GettingStartedPage />
                        <Device
                            currentSelectedDevice={this.state.currentDevice}
                        />
                        {this.loadContent}
                    </ViewStateContext.Provider>
                </main>
            </div>
        );
    }
    loadConten()=>{
        switch()
    }

    handleMessage = (event: any): void => {
        const message = event.data;

        switch (message.command) {
            case VSCODE_MESSAGES_TO_WEBVIEW.SET_DEVICE:
                if (message.active_device !== this.state.currentDevice) {
                    this.setState({ currentDevice: message.active_device });
                }
                break;
            case VSCODE_MESSAGES_TO_WEBVIEW.RUN_DEVICE:
                this.setState({ viewState: VIEW_STATE.RUNNING });
                break;
            case VSCODE_MESSAGES_TO_WEBVIEW.PAUSE_DEVICE:
                this.setState({ viewState: VIEW_STATE.PAUSE });
                break;
        }
    };
}

export default App;
