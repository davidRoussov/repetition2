import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class AddStore extends EventEmitter {

    handleActions(action) {
        if (action.type === "CHOOSE_TOPIC") {
            this.emit("change", action.topicID);
        }
    }
}

const addStore = new AddStore();
dispatcher.register(addStore.handleActions.bind(addStore));
window.dispatcher = dispatcher;

export default addStore;