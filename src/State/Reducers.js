import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import io from 'socket.io-client';

const socket_url = "https://backgammonserver.azurewebsites.net";
const socket = io(socket_url, { transports: ['websocket', 'polling', 'flashsocket'] });

const userStateReducer = (state = null, action) => {
    // Contains the username of the user, which indictates whether he's logged in or not.
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
        auth: "https://backgammonserver.azurewebsites.net/api/auth",
        users: "https://backgammonserver.azurewebsites.net/api/users"
    }
}

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    userState: userStateReducer,
    socket: socketReducer,
    apiUrls: apiReducer
});

export default rootReducer;