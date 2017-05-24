import dispatcher from "../dispatcher";

export function chooseTopic(topicID) {
	dispatcher.dispatch({
		type: "CHOOSE_TOPIC",
        topicID: topicID
	});
};

export function newTopicSubmitted() {
	dispatcher.dispatch({
		type: "NEW_TOPIC_SUBMITTED"
	});
};

export function topicDeleted() {
	dispatcher.dispatch({
		type: "TOPIC_DELETED"
	});
}

export function topicNameChanged() {
	dispatcher.dispatch({
		type: "TOPIC_NAME_CHANGE"
	});
}