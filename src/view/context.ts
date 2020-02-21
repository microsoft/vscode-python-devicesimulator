import * as React from "react";
import { VIEW_STATE } from "./constants";

// View is running by default

export const ViewStateContext = React.createContext(
    VIEW_STATE.RUNNING )