// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "../styles/Dropdown.css";

export interface IDropdownProps {
    options: string[];
    // styleLabel: string;
    name: string;
    onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Dropdown: React.FC<IDropdownProps> = props => {
    return (
        <select
            className="dropdown"
            onChange={props.onSelect}
            title={props.name}
            name={props.name}
        >
            {renderOptions(props.options)}
        </select>
    );
};

const renderOptions = (options: string[]) => {
    return options.map((name, index) => {
        return (
            <option key={name} value={name}>
                {name}
            </option>
        );
    });
};
