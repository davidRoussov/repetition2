import React from "react";

import { SplitButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

import TopicsStore from "../stores/TopicsStore.js";
import * as TopicActions from "../actions/TopicActions.js";

export default class Header extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.state.topics = [];
  }

  componentWillMount() {
    TopicsStore.fetchTopics(topics => {
      this.setState({topics: topics});
    });
  }

  topicClick(topicID) {
    TopicActions.chooseTopic(topicID);
  }

  render() {
    const topicSidebarStyle = {
      height: "100vh",
      width: "131.52px",
      backgroundColor: "#95a5a6",
      float: "left"
    };

    const topicButtonStyle = {
      borderRadius: "0px",
      width: "80%"
    };


    return (
      <div style={topicSidebarStyle}>

        {this.state.topics.map((topic, index) => {

          return (
            <div key={index}>
              <SplitButton id={index} title={topic.topicName} style={topicButtonStyle} className="btn-group" onClick={this.topicClick.bind(this, topic._id)}>
                <MenuItem href="#books">Books</MenuItem>
                <MenuItem href="#podcasts">Podcasts</MenuItem>
                <MenuItem href="#">Tech I Like</MenuItem>
                <MenuItem href="#">About me</MenuItem>
                <MenuItem href="#addBlog">Add a Blog</MenuItem>
              </SplitButton>  
              <br/>
            </div>
          )

        })}

      </div>
    );
  }
}


          /*return (

            <div key={index} className="btn-group">
              <button type="button" className="btn btn-default">{topic.topicName}</button>
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <span className="caret"></span>
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu">
                <li><a href="#">Delete</a></li>
                <li><a href="#">Edit</a></li>
              </ul>
            </div>


          )*/