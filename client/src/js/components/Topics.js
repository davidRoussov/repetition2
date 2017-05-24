import React from "react";

import { SplitButton, Modal, Button, FormControl } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

import TopicsStore from "../stores/TopicsStore.js";
import * as TopicActions from "../actions/TopicActions.js";

const $ = require('jquery');

export default class Header extends React.Component {

  constructor() {
    super();
    this.state = {
      ["topics"]: [], 
      ["showModal"]: false,
      ["showModalEdit"]: false
    };
  }

  componentWillMount() {
    this.getCurrentTopics();
    TopicsStore.on('change', () => {
      this.getCurrentTopics();
    })
  }

  getCurrentTopics() {
    TopicsStore.fetchTopics(topics => {
      this.setState({topics: topics});
    });
  }

  topicClick(topicID, event) {

    $(".selected-topic").removeClass("selected-topic");
    $(event.target).addClass("selected-topic");
    $(event.target).next().addClass("selected-topic");

    TopicActions.chooseTopic(topicID);
  }

  submitNewTopic() {
    
    const newTopicName = $("#newTopicName").val();
    
    fetch('/api/submit-new-topic', {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify( {newTopic: newTopicName})
    })
    .then((response) => {
      TopicActions.newTopicSubmitted();
      this.close();
    });

  }

  submitTopicEdit(topicID) {
    const newTopicName = $("#newTopicNameEdit-" + topicID).val();

    fetch('/api/edit-topic-name', {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify( {newTopicName: newTopicName, topicID: topicID})
    })
    .then((response) => {
      TopicActions.topicNameChanged();
      this.closeEditModal();
    })
  }

  open() {
    this.setState({showModal: true});
  }

  openEditModal() {
    this.setState({showEditModal: true});
  }

  close() {
    this.setState({showModal: false});  
  }

  closeEditModal() {
    this.setState({showEditModal: false});
  }

  detectEnterSubmit = (e) => {
    if (e.keyCode === 13) {
      this.submitNewTopic();
    }
  }

  detectEnterSubmitEdit(topicID, e) {
    if (e.keyCode === 13) {
      this.submitTopicEdit(topicID);
    }
  }

  deleteTopic(topicID) {
    fetch('/api/topics/delete', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "DELETE",
      body: JSON.stringify( {topicID: topicID} )
    })
    .then(response => {
      TopicActions.topicDeleted();
    })
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

    const addNewTopicButtonStyle = {
      borderRadius: "0px",
      width: "100%"
    }


    return (
      <div style={topicSidebarStyle}>

        {this.state.topics.map((topic, index) => {

          return (
            <div key={index}>
              <SplitButton id={index} title={topic.topicName} style={topicButtonStyle} className="btn-group" onClick={this.topicClick.bind(this, topic._id)}>
                <MenuItem onClick={this.openEditModal.bind(this)}>Edit</MenuItem>
                <MenuItem onClick={this.deleteTopic.bind(this, topic._id)}>Delete</MenuItem>
              </SplitButton>  
              <br/>

              <Modal show={this.state.showEditModal} onHide={this.closeEditModal.bind(this)}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter new topic name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <FormControl
                    id={"newTopicNameEdit-" + topic._id}
                    type="text"
                    placeholder="Enter new topic"
                    onKeyUp={this.detectEnterSubmitEdit.bind(this, topic._id)}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeEditModal.bind(this)}>Close</Button>
                  <Button
                    bsStyle="primary"
                    onClick={this.submitTopicEdit.bind(this, topic._id)}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>

            </div>
       
          )

        })}

        <Button
          bsStyle="info"
          bsSize="xs"
          onClick={this.open.bind(this)}
          style={addNewTopicButtonStyle}
        >
          Add new topic
        </Button>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Enter new topic name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormControl
              id="newTopicName"
              type="text"
              placeholder="Enter new topic"
              onKeyUp={this.detectEnterSubmit}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>Close</Button>
            <Button
              bsStyle="primary"
              onClick={this.submitNewTopic.bind(this)}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}