import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import * as testRenderer from "react-test-renderer";
import { DEVICE_LIST_KEY } from "../../constants";
import { Device } from "./Device";

describe("Device component", () => {
    it("renders correctly", () => {
        const component = testRenderer
            .create(
                <IntlProvider locale="en">
                    <Device currentSelectedDevice={DEVICE_LIST_KEY.MICROBIT} />
                </IntlProvider>
            )
            .toJSON();
        expect(component).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(
            <IntlProvider locale="en">
                <Device currentSelectedDevice={DEVICE_LIST_KEY.MICROBIT} />
            </IntlProvider>,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
