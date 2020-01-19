import Simulator from "../../components/Simulator";
import ToolBar from "../../components/toolbar/ToolBar";
import * as React from "react";

class Device extends React.Component<any,any>{
    render(){
        return(
            <div>
            <Simulator />
            <ToolBar />
            </div>
        )
    }
}
export default Device;