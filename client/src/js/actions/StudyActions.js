import dispatcher from "../dispatcher";

export function submitResponse(response) {
	dispatcher.dispatch({
		type: response
	});
}

export function modifyStudyQuestion() {
	dispatcher.dispatch({
		type: "MODIFY_STUDY_QUESTION"
	});
}