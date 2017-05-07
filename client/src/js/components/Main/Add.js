import React from "react";

export default class Add extends React.Component {

  render() {

    const AddPaneStyle = {
      width: "100%",
      height: "100%",
      backgroundColor: "#f1f3f3"
    };

    const headingStyle = {
      margin: "0px",
      paddingTop: "10px",
      paddingBottom: "10px"
    }

    const inputStyle = {
      border: "none",
      borderRadius: "0",
      marginBottom: "10px"
    }

    const textareaStyle = {
      width: "100%",
      height: "70%",
      resize: "vertical",
      marginBottom: "10px",
      border: "none",
      borderRadius: "0"
    }

    return (

      <div style={AddPaneStyle}>

        <h1 style={headingStyle}>Add</h1>

        <input style={inputStyle} type="text" className="form-control" />

        <textarea id="studyTextarea" style={textareaStyle} className="form-control"></textarea>

        <button type="text" className="btn btn-success">Submit</button>

      </div>

    );
  }
}
