import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class BrowseStore extends EventEmitter {

    fetchProblems(topicID) {
        return fetch('/api/all-questions?topic=' + topicID)
            .then((response) => response.json())
            .then((response) => console.log(JSON.stringify(response)))
    }

    handleActions(action) {
        console.log("browse store action:", action);
    }
}

const browseStore = new BrowseStore();
dispatcher.register(browseStore.handleActions.bind(browseStore));
window.dispatcher = dispatcher;

export default browseStore;