import dispatcher from "../dispatcher";

export function submitNewProblem(problem) {
	dispatcher.dispatch({
		type: "SUBMIT_NEW_PROBLEM",
        payload: problem
	});
}