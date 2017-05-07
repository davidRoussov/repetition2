import React from "react";
import { Link } from "react-router-dom";

export default class Header extends React.Component {

  render() {
    const navbarStyle = {
      margin: "0px",
      height: "20px"
    };

    const searchInputStyle = {
      "border": "none",
      marginRight: "2px"
    };

    const brandStyling = {
      width: "131.52px",
      textAlign: "center"
    };

    const location = this.props;
    const mainClass = location.location === "/" ? "active" : "";
    const browseClass = location.location === "/browse" ? "active": "";

    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top" style={navbarStyle}>
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#" style={brandStyling}>Repetition</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li className={mainClass}><Link to="/">Main</Link></li>
                <li className={browseClass}><Link to="/browse">Browse</Link></li>
              </ul>
              <form className="navbar-form navbar-left" role="search">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Search" style={searchInputStyle}/>
                </div>
                <button type="submit" className="btn btn-default">Submit</button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
