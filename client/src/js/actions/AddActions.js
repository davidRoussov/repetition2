import dispatcher from "../dispatcher";

export function submissionComplete() {
	dispatcher.dispatch({
		type: "NEW_PROBLEM_SUBMISSION_COMPLETE"
	});
}