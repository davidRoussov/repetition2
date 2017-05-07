import React from "react";
import SplitLayout from "react-split-layout";

import Study from "./Study";
import Add from "./Add";

export default class Main extends React.Component {

  render() {

    const mainContentStyling = {
      height: "100%",
      textAlign: "center"
    };

    const splitLayoutStyling = {
      paddingLeft: "131.52px",
      zIndex: -1,
      backgroundColor: "#95a5a6"
    }

    return (

      <div style={mainContentStyling}>
        <SplitLayout style={splitLayoutStyling} direction="vertical">
          <Study />
          <Add />
        </SplitLayout>
      </div>

    );
  }
}
