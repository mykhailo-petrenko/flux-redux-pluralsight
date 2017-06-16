import {CreateStore} from 'redux';

const defaultState = {
    messages: [
        {
            date: new Date("2017-02-01 11:12:13"),
            author: 'Shme',
            content: 'Redux vs Flux'
        },
        {
            date: new Date("2017-02-01 12:10:45"),
            author: 'Bongo',
            content: 'Flux  is the precursor of Redux'
        }
    ],
    userStatus: undefined
};