import { Pivot, PivotItem, PivotLinkFormat } from "office-ui-fabric-react";
import * as React from "react";
import { DEVICE_LIST_KEY, CONSTANTS } from "../../constants";

interface IProps {
    handleTabClick: (item?: PivotItem) => void;
}
export class Tab extends React.Component<IProps, any> {
    render() {
        const { handleTabClick } = this.props;
        return (
            <Pivot
                linkFormat={PivotLinkFormat.tabs}
                onLinkClick={handleTabClick}
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
    }
}
