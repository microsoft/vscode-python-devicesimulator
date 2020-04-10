import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import * as testRenderer from "react-test-renderer";
import { Cpx } from "./Cpx";

describe("CPX component", () => {
    it("should render correctly", () => {
        const component = testRenderer
            .create(
                <IntlProvider locale="en">
                    <Cpx />
                </IntlProvider>
            )
            .toJSON();
        expect(component).toMatchSnapshot();
    });

    it("should render without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(
            <IntlProvider locale="en">
                <Cpx />
            </IntlProvider>,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
