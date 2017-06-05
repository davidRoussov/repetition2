import React from "react";

import BrowseStore from "../../stores/BrowseStore";

export default class Layout extends React.Component {

  constructor() {
    super();
    this.state = {
      ["currentTopicID"]: "",
      ["currentQuestions"]: []
    };
  }

  componentWillMount() {
    this.getProblems();
  }

  async getProblems() {
    const problems = await BrowseStore.fetchProblems(this.state.currentTopicID);
    console.log(JSON.stringify(problems, null, 2));
  }

  render() {

    const tableStyle = {
      marginLeft: "131.52px",
      display: "inherit",
      padding: "20px"
    };

    return (
      <div>

        <table style={tableStyle} className="table table-hover">

          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>why?</td>
              <td>yes</td>
            </tr>
            <tr>
              <td>how?</td>
              <td>so</td>
            </tr>
          </tbody>

        </table>
        
      </div>
    );
  }
}
