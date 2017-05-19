import React from "react";

import * as AddActions from "../../actions/AddActions";
import AddStore from "../../stores/AddStore";

export default class Add extends React.Component {

  constructor() {
    super();
    this.state = {["currentTopicID"]: ""};
  }

  componentWillMount() {
    AddStore.on('change', topicID => {
      console.log("hi there", topicID);
      this.setState({currentTopicID: topicID});
    });
  }

  submitNewQuestion() {
    let question = document.getElementById("questionInput").value;
    let answer = document.getElementById("answerInput").value;

    AddActions.submitNewProblem({question: question, answer: answer});


    const newProblem = {
      topicID: this.state.currentTopicID,
      question: question,
      answer: answer
    }

    fetch('/api/submitnewproblem', {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify( newProblem )
    })
    .then(checkAndUpdate)

    function checkAndUpdate(response) {
      console.log("update complete");
      console.log(response);
    }
  }

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

        <input id="questionInput" style={inputStyle} type="text" className="form-control" />

        <textarea id="answerInput" style={textareaStyle} className="form-control"></textarea>

        <button type="text" className="btn btn-success" onClick={this.submitNewQuestion.bind(this)}>Submit</button>

      </div>

    );
  }
}
