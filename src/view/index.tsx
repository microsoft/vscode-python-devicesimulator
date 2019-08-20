// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { IntlProvider } from "react-intl";

import "./index.css";

const messageEn = require("./translations/en.json");
const locale = "en";

ReactDOM.render(
  <IntlProvider locale={locale} messages={messageEn}>
    <App />
  </IntlProvider>,
  document.getElementById("root")
);
