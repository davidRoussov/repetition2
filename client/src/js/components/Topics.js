import React from "react";

import { SplitButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

export default class Header extends React.Component {

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

    var topics = [
      {topicName: "one"},
      {topicName: "two"},
      {topicName: "three"}
    ];

    return (
      <div style={topicSidebarStyle}>

        {topics.map((item, index) => {

          return (
            <div key={index}>
              <SplitButton id={index} title="Dropdown" style={topicButtonStyle}>
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
