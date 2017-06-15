
import {Store} from './Store';

export class ReduceStore extends Store {
    constructor(dispatcher) {
        super(dispatcher);
    }

    reduce(state, action) {
        throw new Error("Subclasses should implement reduces(state, action) methis of a Flux ReduceStore.");
    }

    __onDispatch(action) {
        const newState = this.reduce(this.__state, action);

        if (newState===this.__state) {
            return;
        }

        this.__state = newState;
        this.__emitChange();
    }
}