import {createStore} from 'redux';
import Message from './Message';

const ONLINE = 'ONLINE';
const AWAY = 'AWAY';
const OFFLINE = 'OFFLINE';

const UPDATE_STATUS = 'UPDATE_STATUS';
const NEW_MESSAGE = 'NEW_MESSAGE';

const createUpdateStatusEvent = status => ({
    type: UPDATE_STATUS,
    value: status
});

const createNewMessageEvent = (message, user) => ({
    type: NEW_MESSAGE,
    value: new Message(message, user)
});

const defaultState = {
    messages: [
        new Message('Redux vs Flux', 'Shme', new Date("2017-02-01 11:12:13")),
        new Message('Flux  is the precursor of Redux', 'Bongo', new Date("2017-02-01 12:10:45"))
    ],
    userStatus: ONLINE
};

const reducer = (state = defaultState, {type, value}) => {
    let newState;
    switch (type) {
        case UPDATE_STATUS:
            newState = {...state, userStatus: value};

            return newState;

        case NEW_MESSAGE:
            newState = {...state, messages: [...state.messages]};
            newState.messages.push(value);

            return newState;
    }

    return state;
}

const store = createStore(reducer);

const render = () => {
    const messagesElement = document.getElementById('messages');
    const newMessageElement = document.forms.newMessage.newMessage;
    const {messages, userStatus} = store.getState();

    const messagesTemplate = messages
        .sort(({date : a}, {date : b}) => a - b)
        .map(({date, author, content}) => `
            <div>
                <em>${author}</em>
                :
                ${content}
            </div>
        `)
        .join('');

    messagesElement.innerHTML = messagesTemplate;
    newMessageElement.disabled = (userStatus===OFFLINE);
};

store.subscribe(render);

render();

document.forms.newMessage.addEventListener('submit', e => {
    e.preventDefault();
    const messageInput = document.getElementById('newMessageInput');

    if (!messageInput.value.length) {
        return;
    }

    store.dispatch(createNewMessageEvent(messageInput.value));
    messageInput.value = '';
});


document.forms.userStatus.status.addEventListener('change', e => {
    e.preventDefault();

    store.dispatch(createUpdateStatusEvent(e.target.value));
});
