import React from "react";

import { SplitButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

import TopicsStore from "../stores/TopicsStore.js";

export default class Header extends React.Component {

  constructor() {
    super();
    this.state = {};
    this.state.topics = [];
  }

  componentWillMount() {
    this.getTopics();
  }

  getTopics() {
    TopicsStore.fetchTopics(topics => {
      this.setState({topics: topics});
    });
  }

  render() {
    const topicSidebarStyle = {
      height: "100vh",
      width: "131.52px",
      backgroundColor: "#95a5a6",
      float: "left"
    };

    const topicButtonStyle = {
      borderRadius: "0px"
    };


    return (
      <div style={topicSidebarStyle}>

        {this.state.topics.map((topic, index) => {

          return (
            <div key={index}>
              <SplitButton id={index} title={topic.topicName} style={topicButtonStyle} className="btn-group">
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
