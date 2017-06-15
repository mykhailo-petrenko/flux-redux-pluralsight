import {generate} from 'shortid';
import {Dispatcher, ReduceStore} from './flux';

const tasksDispatcher = new Dispatcher();

class TasksStore extends ReduceStore {
    getInitialState() {
        return {
            tasks: [
                {
                    id: generate(),
                    content: "Setup env",
                    completed: true
                },
                {
                    id: generate(),
                    content: "Add boilerplate code",
                    completed: false
                },
                {
                    id: generate(),
                    content: "Write demo unit tests",
                    completed: false
                },
                {
                    id: generate(),
                    content: "Create git repo",
                    completed: true
                }
            ],
            showCompleted: true
        };
    }

    reduce(state, action) {
        console.log('Reducing ', state, action);

        return state;
    }

    getState() {
        return this.__state;
    }
}

const tasksStore = new TasksStore(tasksDispatcher);

tasksDispatcher.dispatch('TEST_ACTION');