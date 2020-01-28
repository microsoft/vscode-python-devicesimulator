import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import Device from "./Device";
import * as testRenderer from "react-test-renderer";

it("renders correctly", () => {
    const component = testRenderer
        .create(
            <IntlProvider locale="en">
                <Device />
            </IntlProvider>
        )
        .toJSON();
    expect(component).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <IntlProvider locale="en">
            <Device />
        </IntlProvider>,
        div
    );
    ReactDOM.unmountComponentAtNode(div);
});
