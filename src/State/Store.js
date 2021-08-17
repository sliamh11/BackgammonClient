import { createStore } from 'redux';
import rootReducer from 'State/Reducers';
import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();

// Creating Redux's middlewares & implementing in store. 
const middlewareEnhancer = applyMiddleware(thunkMiddleware,routerMiddleware(history))
const store = createStore(rootReducer(history), middlewareEnhancer);

export default store;