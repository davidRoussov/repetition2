import dispatcher from "../dispatcher";

export function chooseTopic(topicID) {
	dispatcher.dispatch({
		type: "CHOOSE_TOPIC",
        topicID: topicID
	});
}