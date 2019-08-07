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
    return (
      <div>
        <RedirectModal />
      </div>
    );
  }
}
export default RedirectLink;
