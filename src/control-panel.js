import {Dispatcher} from './flux';
import {Store} from './flux';

const controlPanelDispatcher = new Dispatcher();

const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_FONTSIZE = 'UPDATE_FONTSIZE';

const userNameUpdateAction = (name) => {
    return {
        type: UPDATE_USERNAME,
        value: name
    };
};

const fontSizeUpdateAction = (fontSize) => {
    return {
        type: UPDATE_FONTSIZE,
        value: fontSize
    };
};

document
    .getElementById('userNameInput')
    .addEventListener('input', ({target}) => {
        const name = target.value;    

        controlPanelDispatcher.dispatch(userNameUpdateAction(name));
    });

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({target}) => {
        const fontSize = target.value;

        controlPanelDispatcher.dispatch(fontSizeUpdateAction(fontSize));
    });
});


class UserPreferencesStore extends Store {

    get storageName() {
        return 'userPreferences';
    }

    getInitialState() {
        const defaultState = {
            userName: "Jim",
            fontSize: 'small'
        };

        return this.getStoredState() || defaultState;
    }

    __onDispatch(action) {
        console.log('Store receive dispatch', action);
        
        switch(action.type) {
            case UPDATE_USERNAME:
                this.__state.userName = action.value;
                this.__emitChange();
                break;
            case UPDATE_FONTSIZE:
                this.__state.fontSize = action.value;
                this.__emitChange();
                break;
        }
    }

    getUserPreferences() {
        return this.__state;
    }

    getStoredState() {
        return localStorage[this.storageName] && JSON.parse(localStorage[this.storageName]);
    }

    updateStoredState(state) {
        localStorage[this.storageName] = JSON.stringify(state);
    }
}

const userPreferencesStore = new UserPreferencesStore(controlPanelDispatcher);

const render = ({userName, fontSize}) => {
    document.getElementById('userName').innerHTML = userName;
    document.getElementById('userNameInput').value = userName;
    document.getElementById('mainContainer').style.fontSize = (fontSize=='small') ? '14px' : '18px';
    document.forms.fontSizeForm.fontSize.value = fontSize;
};

userPreferencesStore.addListener(state => {
    render(state);
    userPreferencesStore.updateStoredState(state);
});

render(userPreferencesStore.getUserPreferences());