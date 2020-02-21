// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "./App.css";
import {
    DEVICE_LIST_KEY,
    VSCODE_MESSAGES_TO_WEBVIEW,
    DEBUG_COMMANDS,
    VIEW_STATE,
} from "./constants";
import { Device } from "./container/device/Device";
import {ViewStateContext} from './context'

interface IState {
    currentDevice: string;
    viewState:VIEW_STATE;
}

const defaultState = {
    currentDevice: DEVICE_LIST_KEY.CPX,
    viewState:VIEW_STATE.RUNNING
};




class App extends React.Component<{}, IState> {
    constructor() {
        super({});
        this.state = defaultState;
    }
    componentDidMount() {
        if (document.currentScript) {
            const initialDevice = document.currentScript.getAttribute(
                "initialDevice"
            );

            if (initialDevice) {
                this.setState({ currentDevice: initialDevice });
            }
        }
        window.addEventListener("message", this.handleMessage);
    }
    componentWillUnmount() {
        window.removeEventListener("message", this.handleMessage);
    }

    render() {
        return (
            <div className="App">
                <main className="App-main">
                    <ViewStateContext.Provider value ={this.state.viewState}>
                    <Device currentSelectedDevice={this.state.currentDevice} />
                    </ViewStateContext.Provider></main>
            </div>
        );
    }

    handleMessage = (event: any): void => {
        const message = event.data;
        console.log(
            "blabla"+JSON.stringify(message));
        switch (message.command) {
            case VSCODE_MESSAGES_TO_WEBVIEW.SET_DEVICE:
                if (message.active_device !== this.state.currentDevice) {
                    this.setState({ currentDevice: message.active_device });
                }
                break;
            case DEBUG_COMMANDS.CONTINUE:
                this.setState({viewState:VIEW_STATE.RUNNING})
                break;
            case DEBUG_COMMANDS.STACK_TRACE:
                this.setState({viewState:VIEW_STATE.PAUSE})

                break;
        }
    };
}

export default App;
