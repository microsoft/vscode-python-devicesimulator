import * as React from "react";
import "../styles/Button.css";

export interface IDropdownProps {
  label: string;
  textOptions: string[];
  lastChosen: string;
  styleLabel: string;
  width: number;
  onBlur: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<IDropdownProps> = props => {
  const defaultText =
    props.lastChosen !== ""
      ? `${parsePath(props.lastChosen)[1]}: ${parsePath(props.lastChosen)[0]}`
      : "Choose a .py file to run on the Simulator";
  return (
    <div>
      <select id={props.label} onBlur={props.onBlur}>
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
    const filePath = parsePath(name);
    return (
      <option key={key} value={name}>
        {`${filePath[1]}: ${filePath[0]}`}
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

const styleDropdownOptions = (classA:string, classB:string, pathToParse:string) => {
  const parsedPath = parsePath(pathToParse);
  return (
    <p className={classA}>{parsedPath[1]}</p> <p className={classB}>{parsedPath[0]}</p> 
  );
};

export default Dropdown;
