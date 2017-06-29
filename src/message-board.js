import {createStore, combineReducers, applyMiddleware} from 'redux';
import {get} from './http';
import logger from 'redux-logger';

import Message from './Message';

const ONLINE = 'ONLINE';
const AWAY = 'AWAY';
const OFFLINE = 'OFFLINE';

const UPDATE_STATUS = 'UPDATE_STATUS';
const NEW_MESSAGE = 'NEW_MESSAGE';
const NEW_MESSAGE_SERVER_ACCEPTED = 'NEW_MESSAGE_SERVER_ACCEPTED';

export const COMMUNICATION_STATUS = {
    READY: 'READY',
    WAITING: 'WAITING'
};

const updateStatusAction = status => ({
    type: UPDATE_STATUS,
    value: status
});

const newMessageAction = (message, userName) => {
    const date = new Date();

    get('/api/create', id => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED
        });
    });

    return {
        type: NEW_MESSAGE,
        value: message,
        author: userName,
        date
    };
};

const defaultState = {
    messages: [
        new Message('Redux vs Flux', 'Shme', new Date("2017-02-01 11:12:13")),
        new Message('Flux  is the precursor of Redux', 'Bongo', new Date("2017-02-01 12:10:45"))
    ],
    userStatus: ONLINE,
    apiCommunicationStatus: COMMUNICATION_STATUS.READY
};

const messagesReducer = (state = defaultState.messages, {type, value, author, date}) => {
    switch(type) {
        case NEW_MESSAGE:
            return [...state, new Message(value, author, date)];
    }
    return state;
}

const stateReducer = (state = defaultState.userStatus, {type, value}) => {
    switch (type) {
        case UPDATE_STATUS: 
            return value;
    }
    return state;
};

const apiCommunicationStatusReducer = (state = defaultState.apiCommunicationStatus, {type, value}) => {
    switch (type) {
        case NEW_MESSAGE:
            return COMMUNICATION_STATUS.WAITING;

        case NEW_MESSAGE_SERVER_ACCEPTED:
            return COMMUNICATION_STATUS.READY;
    }

    return state;
}

const rootReducer = combineReducers({
    messages: messagesReducer,
    userStatus: stateReducer,
    apiCommunicationStatus: apiCommunicationStatusReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(logger())
);

const render = () => {
    const messagesElement = document.getElementById('messages');
    const newMessageElement = document.forms.newMessage.newMessage;
    const {messages, userStatus, apiCommunicationStatus} = store.getState();

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
    newMessageElement.disabled = (
                                    (userStatus===OFFLINE)
                                    ||
                                    (apiCommunicationStatus===COMMUNICATION_STATUS.WAITING)
                                );
};

store.subscribe(render);

render();

document.forms.newMessage.addEventListener('submit', e => {
    e.preventDefault();
    const messageInput = document.getElementById('newMessageInput');

    if (!messageInput.value.length) {
        return;
    }

    const userName = localStorage['userPreferences'] && JSON.parse(localStorage['userPreferences']).userName;

    store.dispatch(newMessageAction(messageInput.value, userName));
    messageInput.value = '';
});


document.forms.userStatus.status.addEventListener('change', e => {
    e.preventDefault();

    store.dispatch(updateStatusAction(e.target.value));
});
