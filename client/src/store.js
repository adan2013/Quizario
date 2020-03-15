import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const loadState = () => {
    try {
        const serializedState = window.localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        window.localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};

const prevState = loadState();
const store = createStore(
    reducers,
    prevState,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);

store.subscribe(() => {
    saveState({
        game: store.getState().game
    });
});

export default store