import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import * as testRenderer from "react-test-renderer";
import { SENSOR_LIST } from "../../constants";
import * as TOOLBAR_SVG from "../../svgs/toolbar_svg";
import { MICROBIT_TOOLBAR_ICON_ID } from "./SensorModalUtils";
import Toolbar from "./ToolBar";

const MOCK_TOOLBAR_BUTTONS: Array<{ label: string; image: JSX.Element }> = [
    {
        image: TOOLBAR_SVG.LIGHT_SVG,
        label: MICROBIT_TOOLBAR_ICON_ID.LIGHT,
    },
    {
        image: TOOLBAR_SVG.MOTION_SVG,
        label: MICROBIT_TOOLBAR_ICON_ID.ACCELEROMETER,
    },
];
const mockUpdateSensors = () => {
    return;
};
const mockInitialValues = {
    [SENSOR_LIST.TEMPERATURE]: 0,
    [SENSOR_LIST.LIGHT]: 0,
};
describe("Toolbar component ", () => {
    it("should render correctly", () => {
        const component = testRenderer
            .create(
                <IntlProvider locale="en">
                    <Toolbar
                        buttonList={MOCK_TOOLBAR_BUTTONS}
                        onUpdateSensor={mockUpdateSensors}
                        sensorValues={mockInitialValues}
                    />
                </IntlProvider>
            )
            .toJSON();
        expect(component).toMatchSnapshot();
    });

    it("should render without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(
            <IntlProvider locale="en">
                <Toolbar
                    buttonList={MOCK_TOOLBAR_BUTTONS}
                    onUpdateSensor={mockUpdateSensors}
                    sensorValues={mockInitialValues}
                />
            </IntlProvider>,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
