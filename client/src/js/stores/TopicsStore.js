import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class TopicsStore extends EventEmitter {
	fetchTopics(callback) {
		return fetch('/api/topics', {
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

	handleActions(action) {
		if (action.type === "CHOOSE_TOPIC") {
			
		}
		else if (action.type === "NEW_TOPIC_SUBMITTED") {
			this.emit("change");
		}
		else if (action.type === "TOPIC_DELETED") {
			this.emit("change");
		}
		else if (action.type === "TOPIC_NAME_CHANGE") {
			this.emit("change");
		}
	}
}

const topicsStore = new TopicsStore();
dispatcher.register(topicsStore.handleActions.bind(topicsStore));
window.dispatcher = dispatcher;

export default topicsStore;
