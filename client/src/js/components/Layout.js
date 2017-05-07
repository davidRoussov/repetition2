import React from "react";

import Menu from "./Menu";
import Topics from "./Topics";

export default class Layout extends React.Component {

  render() {

    const location = this.props.location.pathname;
  
    return (
      <div id="appContainer">
        <Menu location={location}/>        
        <Topics/>
      </div>
    );
  }
}
