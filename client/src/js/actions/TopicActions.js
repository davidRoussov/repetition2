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