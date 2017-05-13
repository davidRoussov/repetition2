import React from "react";

import StudyStore from "../../stores/StudyStore";
import * as StudyActions from "../../actions/StudyActions";

const $ = require("jquery");

export default class Study extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.state.currentTopicID = "";
  }

  componentWillMount() {
    this.setCurrentProblem();
    StudyStore.on('change', topicID => {
      this.setCurrentProblem.bind(this, topicID);
    });
  }

  setCurrentProblem(topicID) {
    this.setState({currentTopicID: topicID}, function() {

      StudyStore.fetchQuestion(this.state.currentTopicID, question => {
        this.setState({
          questionHidden: true,
          current: question
        });
      });

    });

  }

  flipQuestion(event) {
    let button = $(event.target);
    let textarea = $("#studyTextarea");
    let isObscured = textarea.hasClass("study-textarea-obscured");
    if (isObscured) {
      textarea.removeClass("study-textarea-obscured");
      this.setState({questionHidden: false});
      button.text("Hide");
    } else {
      textarea.addClass("study-textarea-obscured");
      this.setState({questionHidden: true});
      button.text("Reveal");
    }
  }

  modifyQuestion(event) {
    let newProblem = {
      question: event.target.value,
      answer: this.state.current.answer
    };
    this.setState({current: newProblem});
  }

  modifyAnswer(event) {
    let newProblem = {
      question: this.state.current.question,
      answer: event.target.value
    };
    this.setState({current: newProblem});    
  }

  responseSubmission(response) {
    StudyActions.submitResponse(response, this.state.currentTopicID);
  }

  render() {

    const StudyPaneStyle = {
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

    let currentQuestion = this.state.current ? this.state.current.question : "";
    let currentAnswer = this.state.current ? this.state.current.answer : "";

    return (

      <div style={StudyPaneStyle}>

        <h1 style={headingStyle}>Study</h1>

        <input id="studyInput" style={inputStyle} type="text" className="form-control" value={currentQuestion} onChange={this.modifyQuestion.bind(this)}/>

        <textarea id="studyTextarea" style={textareaStyle} className="form-control study-textarea-obscured" disabled={this.state.questionHidden} value={currentAnswer} onChange={this.modifyAnswer.bind(this)}></textarea>

        <div className="btn-group" role="group" aria-label="...">
          <button type="button" className="btn btn-primary" onClick={this.flipQuestion.bind(this)}>Reveal</button>
          <button type="button" className="btn btn-success" onClick={this.responseSubmission.bind(this, "good")}>Good</button>
          <button type="button" className="btn btn-warning" onClick={this.responseSubmission.bind(this, "pass")}>Pass</button>
          <button type="button" className="btn btn-danger" onClick={this.responseSubmission.bind(this, "bad")}>Bad</button>
        </div>

      </div>

    );
  }
}
