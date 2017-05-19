import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class StudyStore extends EventEmitter {
	fetchQuestion(topicID, callback) {
		return fetch('/api/question?topic=' + topicID, {
			accept: 'application/json'
		})
		.then(checkStatus)
		.then(parseJSON)

		function parseJSON(response) {
			callback(response);
		}

		function checkStatus(response) {
			if (response.status >= 200 && response.status < 300) {
				return response.json();
			}
		}
	}

	submitResponse(userResponse, topicID) {
		fetch('/api/question/response?topic=' + topicID, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify( {userResponse: userResponse} )
		})
		.then(response => {
			this.emit("change", topicID);
		})
	}

	handleActions(action) {
		if (action.type === "good" || action.type === "bad" || action.type === "pass") {
			this.submitResponse(action.type, action.topicID);
		} else if (action.type === "CHOOSE_TOPIC") {
			this.emit("change", action.topicID);
		} else if (action.type === "SUBMIT_NEW_PROBLEM") {
			this.emit("change");
		}
	}
}

const studyStore = new StudyStore();
dispatcher.register(studyStore.handleActions.bind(studyStore));
window.dispatcher = dispatcher;

export default studyStore;
