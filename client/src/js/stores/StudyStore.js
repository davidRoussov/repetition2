import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class StudyStore extends EventEmitter {
	fetchQuestion(callback) {
		return fetch('/api/question?topic=sBnmbJJgygxda8Sud', {
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

	submitResponse(userResponse) {
		fetch('/api/question/response?topic=sBnmbJJgygxda8Sud', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify( {userResponse: userResponse} )
		})
		.then(response => {
			this.emit("change");
		})
	}

	handleActions(action) {
		this.submitResponse(action);
	}
}

const studyStore = new StudyStore();
dispatcher.register(studyStore.handleActions.bind(studyStore));
window.dispatcher = dispatcher;

export default studyStore;
