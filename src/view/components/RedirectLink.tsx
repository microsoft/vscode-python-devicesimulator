import * as React from "react";
import RedirectModal from "./RedirectModal";

class RedirectLink extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  render() {
    return this.state.showModal ? (
      <div>
        <RedirectModal />
      </div>
    ) : null;
  }
}
export default RedirectLink;
