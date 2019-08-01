// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import * as React from "react";
import {
  LABEL_TO_MODAL_CONTENT,
  DEFAULT_MODAL_CONTENT,
  IModalContent
} from "./sensor_modal_utils";
import "../../styles/SensorModal.css";

class SensorModal extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    for (var label of LABEL_TO_MODAL_CONTENT.keys()) {
      if (
        this.props.showModal &&
        this.props.label === label &&
        LABEL_TO_MODAL_CONTENT.get(label)
      ) {
        const content = LABEL_TO_MODAL_CONTENT.get(label) as IModalContent;

        const component = content
          ? content["component"]
          : DEFAULT_MODAL_CONTENT.component;
        return (
          <div className="sensor_modal">
            <div className="description_area">
              <div className="title_group">
                <div className="title">{content["descriptionTitle"]}</div>
                <div className="tag">{content["tag"]}</div>
              </div>
              <br />
              <div className="description">{content["descriptionText"]}</div>
            </div>
            {/* make border visivle bottom */}
            <div className="try_area">
              <div className="title"> {content["tryItTitle"]}</div>
              <br />
              <div className="description">{content["tryItDescriptrion"]}</div>
              <div>{component}</div>
            </div>
          </div>
        );
      }
    }
    return null;
  }
}

export default SensorModal;
