import {generate} from 'shortid';
import {Dispatcher, ReduceStore} from './flux';

const tasksDispatcher = new Dispatcher();

const CREATE_TASK = 'CREATE_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';
const SHOW_TASK = 'SHOW_TASK';

const createNewTaskAction = content => ({
    type: CREATE_TASK,
    value: content
});

const completeTaskAction = (id, isCompleted) => ({
    type: COMPLETE_TASK,
    id: id,
    value: isCompleted
});

const showTaskAction = show => ({
    type: SHOW_TASK,
    value: show
});

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
        var newState;

        switch(action.type) {
            case CREATE_TASK:
                newState = {...state, tasks: [...state.tasks]};
                newState.tasks.push({
                    id: generate(),
                    content: action.value,
                    completed: false
                });
                return newState;

            case SHOW_TASK:
                newState = {...state, tasks: [...state.tasks]};
                newState.showCompleted = action.value;
                return newState;

            case COMPLETE_TASK:
                newState = {...state, tasks: [...state.tasks]};

                const taskIndex = newState.tasks.findIndex(task => task.id==action.id);
                const task = newState.tasks[taskIndex];
                newState.tasks[taskIndex] = {
                    ...task,
                    completed: action.value
                }

                return newState;
        }

        return state;
    }

    getState() {
        return this.__state;
    }
}

const TaskComponent = ({content, completed, id}) => (`
    <section>
        ${content} <input
                        type="checkbox"
                        name="taskCompleteCheckbox"
                        data-taskid="${id}"
                        ${completed ? 'checked="checked"' : ''}
                    />
    </section>
`);

const render = () => {
    const tasksSection = document.getElementById('tasks');
    const state = tasksStore.getState();
    const rendered = state
        .tasks
        .filter(task=>state.showCompleted || !task.completed)
        .map(TaskComponent)
        .join('');

    tasksSection.innerHTML = rendered;

    document.getElementsByName('taskCompleteCheckbox').forEach(element => {
        element.addEventListener('change', onTaskCompleteChange);
    });
};

document.forms.newTask.addEventListener('submit', onNewTaskSubmit);
document.getElementById('showComplete').addEventListener('change', onShowCompleteChange);
document.forms.undo.addEventListener('submit', onUndoSubmit);

const tasksStore = new TasksStore(tasksDispatcher);
tasksStore.addListener(render);
render();

function onNewTaskSubmit(e) {
    e.preventDefault();
    
    const input = e.target.newTaskName;
    const name = input.value;

    if (!name) {
        return;
    }

    tasksDispatcher.dispatch(createNewTaskAction(name));
    input.value = '';
}

function onTaskCompleteChange(e) {
    e.preventDefault();
    
    const id = e.target.attributes['data-taskid'].value;
    const isCompleted = e.target.checked;

    tasksDispatcher.dispatch(completeTaskAction(id, isCompleted));
}

function onShowCompleteChange({target}) {
    const showCompleted = target.checked;
    tasksDispatcher.dispatch(showTaskAction(showCompleted));
}

function onUndoSubmit(e) {
    e.preventDefault();

    tasksStore.revertLastState();
}