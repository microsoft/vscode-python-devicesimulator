// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Pivot, PivotItem, PivotLinkFormat } from "office-ui-fabric-react";
import * as React from "react";
import Simulator from "../../components/Simulator";
import { TOOLBAR_ICON_ID } from "../../components/toolbar/SensorModalUtils";
import ToolBar from "../../components/toolbar/ToolBar";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";

const CPX_TOOLBAR_BUTTONS: Array<{ label: any; image: any }> = [
    {
        image: TOOLBAR_SVG.SLIDER_SWITCH_SVG,
        label: TOOLBAR_ICON_ID.SWITCH,
    },
    {
        image: TOOLBAR_SVG.PUSH_BUTTON_SVG,
        label: TOOLBAR_ICON_ID.PUSH_BUTTON,
    },
    {
        image: TOOLBAR_SVG.RED_LED_SVG,
        label: TOOLBAR_ICON_ID.RED_LED,
    },
    {
        image: TOOLBAR_SVG.SOUND_SVG,
        label: TOOLBAR_ICON_ID.SOUND,
    },
    {
        image: TOOLBAR_SVG.TEMPERATURE_SVG,
        label: TOOLBAR_ICON_ID.TEMPERATURE,
    },
    {
        image: TOOLBAR_SVG.LIGHT_SVG,
        label: TOOLBAR_ICON_ID.LIGHT,
    },
    {
        image: TOOLBAR_SVG.NEO_PIXEL_SVG,
        label: TOOLBAR_ICON_ID.NEO_PIXEL,
    },
    {
        image: TOOLBAR_SVG.SPEAKER_SVG,
        label: TOOLBAR_ICON_ID.SPEAKER,
    },
    {
        image: TOOLBAR_SVG.MOTION_SVG,
        label: TOOLBAR_ICON_ID.MOTION,
    },
    {
        image: TOOLBAR_SVG.IR_SVG,
        label: TOOLBAR_ICON_ID.IR,
    },
    {
        image: TOOLBAR_SVG.GPIO_SVG,
        label: TOOLBAR_ICON_ID.GPIO,
    },
];
interface IState {
    currentDevice: string | undefined;
}
interface IProps {
    children?: any;
}
const DEVICE_LIST_KEY = {
    CPX: "cpx",
    MICROBIT: "microbit",
};
// Container to switch between multiple devices

class Device extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            currentDevice: DEVICE_LIST_KEY.MICROBIT,
        };
    }
    render() {
        return (
            <div className="device-container">
                <Pivot
                    linkFormat={PivotLinkFormat.tabs}
                    onLinkClick={this.handleTabClick}
                >
                    <PivotItem
                        headerText="Micro:bit"
                        itemKey={DEVICE_LIST_KEY.MICROBIT}
                    />

                    <PivotItem headerText="CPX" itemKey={DEVICE_LIST_KEY.CPX} />
                </Pivot>
                <div>
                    <div
                        style={{
                            visibility:
                                this.state.currentDevice ===
                                DEVICE_LIST_KEY.MICROBIT
                                    ? "visible"
                                    : "hidden",
                        }}
                    >
                        microbit
                    </div>
                    <div
                        style={{
                            visibility:
                                this.state.currentDevice === DEVICE_LIST_KEY.CPX
                                    ? "visible"
                                    : "hidden",
                        }}
                    >
                        <Simulator />
                        <ToolBar buttonList={CPX_TOOLBAR_BUTTONS} />
                    </div>
                </div>
            </div>
        );
    }
    private handleTabClick = (item: PivotItem | undefined): void => {
        if (item) {
            this.setState({ currentDevice: item.props.itemKey });
            console.log(this.state.currentDevice);
        }
    };
}
export default Device;
