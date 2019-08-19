// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { IntlProvider } from "react-intl";

import "./index.css";

const locale = "en-US";

ReactDOM.render(
  <IntlProvider locale={locale}>
    <App />
  </IntlProvider>,
  document.getElementById("root")
);
