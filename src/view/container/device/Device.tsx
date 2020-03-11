// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import { Cpx } from "../../components/cpx/Cpx";
import { Microbit } from "../../components/microbit/Microbit";
import { Clue } from "../../components/clue/Clue";
import { DEVICE_LIST_KEY } from "../../constants";

interface IProps {
    currentSelectedDevice: string;
}
// Container to switch between multiple devices

export class Device extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }
    render() {
        const { currentSelectedDevice } = this.props;

        return (
            <div className="device-container">
                <React.Fragment>
                    {loadSelectedDevice(currentSelectedDevice)}
                </React.Fragment>
            </div>
        );
    }
}
const loadSelectedDevice = (currentSelectedDevice: string) => {
    switch (currentSelectedDevice) {
        case DEVICE_LIST_KEY.CPX:
            return <Cpx />;
        case DEVICE_LIST_KEY.MICROBIT:
            return <Microbit />;
        case DEVICE_LIST_KEY.CLUE:
            return <Clue />;
        default:
            return null;
    }
};
