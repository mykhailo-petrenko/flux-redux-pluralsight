import {Dispatcher} from './flux';
import {Store} from './flux';

const controlPanelDispatcher = new Dispatcher();

document
    .getElementById('userNameInput')
    .addEventListener('input', ({target}) => {
        const name = target.value;
        
        console.log('dispatch: ', name);

        controlPanelDispatcher.dispatch('TODO__NAMEINPUTACTION');
    });

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({target}) => {
        const fontSize = target.value;

        console.log('dispatch: ', fontSize);

        controlPanelDispatcher.dispatch('TODO__FONTUPDATEACTION');
    });
});


class UserPreferencesStore extends Store {
    getInitialState() {
        return {
            userName: "Jim",
            fontSize: 'small'
        }
    }

    __onDispatch(action) {
        console.log('Store receive dispatch', action);
        this.__emitChange();
    }

    getUserPreferences() {
        return this.__state;
    }
}

const userPreferencesStore = new UserPreferencesStore(controlPanelDispatcher);

userPreferencesStore.addListener(state => {
    console.info(`current state is: `, state);
});

controlPanelDispatcher.register(action=>{
    console.log('Receive: ', action);
});