// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import CONSTANTS from "../constants";
import "../styles/Dropdown.css";

export interface IDropdownProps {
  label: string;
  textOptions: string[];
  lastChosen: string;
  styleLabel: string;
  width: number;
  onBlur: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<IDropdownProps> = props => {
  const parsedPath = parsePath(props.lastChosen);
  const defaultText =
    props.lastChosen !== ""
      ? `${parsedPath[1]} : ${parsedPath[0]}`
      : CONSTANTS.NO_FILES_AVAILABLE;
  return (
    <div>
      <select id={props.label} className={"dropdown"} onBlur={props.onBlur}>
        <option value="" disabled selected>
          {defaultText}
        </option>
        {renderOptions(props.textOptions)}
      </select>
    </div>
  );
};

const renderOptions = (options: string[]) => {
  return options.map((name, index) => {
    const key = `option-${index}`;
    const parsedPath = parsePath(name);
    return (
      <option key={key} value={name}>
        {`${parsedPath[1]} : ${parsedPath[0]}`}
      </option>
    );
  });
};

const parsePath = (filePath: string) => {
  const lastSlash =
    filePath.lastIndexOf("/") !== -1
      ? filePath.lastIndexOf("/")
      : filePath.lastIndexOf("\\");
  return [filePath.slice(0, lastSlash), filePath.substr(lastSlash + 1)];
};

export default Dropdown;
