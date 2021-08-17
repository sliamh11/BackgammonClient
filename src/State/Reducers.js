import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import io from 'socket.io-client';

const socket_url = "http://localhost:5555";
const socket = io(socket_url, { transports: ['websocket', 'polling', 'flashsocket'] });

const userStateReducer = (state = null, action) => {
    if (action.type === 'userState') {
        return action.payload;
    }
    return state;
}

const socketReducer = () => {
    return socket;
}

const apiReducer = () => {
    return {
        chat: socket_url,
        auth: "http://localhost:5555/api/auth",
        users: "http://localhost:5555/api/users"
    }
}

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    userState: userStateReducer,
    socket: socketReducer,
    apiUrls: apiReducer
});

export default rootReducer;