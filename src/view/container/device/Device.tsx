// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import Simulator from "../../components/Simulator";
import ToolBar from "../../components/toolbar/ToolBar";
import * as React from "react";

class Device extends React.Component{
    render(){
        return(
            <div className="device-container">
            <Simulator />
            <ToolBar />
            </div>
        )
    }
}
export default Device;