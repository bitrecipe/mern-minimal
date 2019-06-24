import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import DevTools from './components/DevTools.js';
import rootReducer from './reducers';

export function configureStore(initialState = {}) {

    let middlewares = [thunk];

    if (process.env.NODE_ENV == 'development') {
        middlewares.push(logger);
    }

    const enhancers = [
        applyMiddleware(...middlewares)
    ];

    if (process.env.NODE_ENV == 'development') {
        enhancers.push((typeof window == "object" && window.__REDUX_DEVTOOLS_EXTENSION__) ? window.__REDUX_DEVTOOLS_EXTENSION__() : DevTools.instrument());
    }

    const store = createStore(rootReducer, initialState, compose(...enhancers));

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}