
import RefreshLogo from "../../svgs/refresh_svg";
import Button from "../Button";
import * as React from "react";
import {CONSTANTS} from "../../constants"
interface IProps{
    onTogglePlay: (event: React.MouseEvent<HTMLElement>) => void,
    onToggleRefresh: (event: React.MouseEvent<HTMLElement>) => void,
    playStopImage:JSX.Element
}
class ActionBar extends React.Component<IProps,any>{
    render(){
        const {onTogglePlay,onToggleRefresh,playStopImage}=this.props;
        return(
            <div className="buttons">
            <Button
              onClick={onTogglePlay}
              focusable={true}
              image={playStopImage}
              styleLabel="play"
              label="play"
              width={CONSTANTS.SIMULATOR_BUTTON_WIDTH}
            />
            <Button
              onClick={onToggleRefresh}
              focusable={true}
              image={RefreshLogo}
              styleLabel="refresh"
              label="refresh"
              width={CONSTANTS.SIMULATOR_BUTTON_WIDTH}
            />
          </div>
        )
    }
}
export default ActionBar