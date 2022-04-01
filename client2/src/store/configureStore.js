import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './rootReducer';

let store;

const configureStore = (initialState) => {
  const middleware = [];
  // const enhancers = [];

  // THUNK
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });
  middleware.push(logger);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middleware)
  ));

}


if (!store) {
  configureStore();
}

export default store;
