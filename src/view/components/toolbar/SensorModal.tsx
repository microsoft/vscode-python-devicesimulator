// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import {
  LABEL_TO_MODAL_CONTENT,
  DEFAULT_MODAL_CONTENT,
  IModalContent
} from "../component_utils";

class SensorModal extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    for (var label of LABEL_TO_MODAL_CONTENT.keys()) {
      console.log(`label is  ${label} against ${this.props.label}`);

      if (
        this.props.showModal &&
        this.props.label === label &&
        LABEL_TO_MODAL_CONTENT.get(label)
      ) {
        const content = LABEL_TO_MODAL_CONTENT.get(label) as IModalContent;

        console.log(`we have ${this.props.label} ${content}`);

        const component = content
          ? content["component"]
          : DEFAULT_MODAL_CONTENT.component;
        return (
          <div className="sensor_modal">
            <div className="description_area">
              <div className="title">{content["descriptionTitle"]}</div>
              <div className="tag">{content["tag"]}</div>
              <div className="description">{content["descriptionText"]}</div>
            </div>
            {/* make border visivle bottom */}
            <div className="try_area">
              <div className="title"> {content["tryItTitle"]}</div>
              <div className="description">{content["tryItDescriptrion"]}</div>
              <div>{component}</div>
            </div>
          </div>
        );
      }
    }
    console.log(`was false`);
    return null;
  }
}

export default SensorModal;
