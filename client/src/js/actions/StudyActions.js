import dispatcher from "../dispatcher";

export function submitResponse(response, topicID) {
	dispatcher.dispatch({
		type: response,
		topicID: topicID
	});
}

export function modifyStudyQuestion() {
	dispatcher.dispatch({
		type: "MODIFY_STUDY_QUESTION"
	});
}