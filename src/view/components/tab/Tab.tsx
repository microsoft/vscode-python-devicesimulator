import { Pivot, PivotItem, PivotLinkFormat } from "office-ui-fabric-react";
import * as React from "react";
import { CONSTANTS, DEVICE_LIST_KEY } from "../../constants";

interface IProps {
    handleTabClick: (item?: PivotItem) => void;
}
export const Tab: React.FC<IProps> = props => {
    return (
        <Pivot
            linkFormat={PivotLinkFormat.tabs}
            onLinkClick={props.handleTabClick}
        >
            <PivotItem
                headerText={CONSTANTS.DEVICE_NAME.CPX}
                itemKey={DEVICE_LIST_KEY.CPX}
            />
            <PivotItem
                headerText={CONSTANTS.DEVICE_NAME.MICROBIT}
                itemKey={DEVICE_LIST_KEY.MICROBIT}
            />
        </Pivot>
    );
};
