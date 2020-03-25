import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import * as testRenderer from "react-test-renderer";
import { Accelerometer } from "./Accelerometer";

describe("Accelerometer component ", () => {
    const mockProps = {
        axisValues: {
            X_AXIS: 1,
            Y_AXIS: 0,
            Z_AXIS: 1,
        },
        onUpdateValue: () => {},
    };

    it("should render correctly", () => {
        const component = testRenderer
            .create(
                <IntlProvider locale="en">
                    <Accelerometer
                        axisValues={mockProps.axisValues}
                        onUpdateValue={mockProps.onUpdateValue}
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
                <Accelerometer
                    axisValues={mockProps.axisValues}
                    onUpdateValue={mockProps.onUpdateValue}
                />
            </IntlProvider>,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
