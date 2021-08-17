import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import io from 'socket.io-client';

const socket_url = "http://localhost:8080";
// const socket_url = "https://backgammonserver.azurewebsites.net";
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
        auth: "http://localhost:8080/api/auth",
        users: "http://localhost:8080/api/users"
    }
}
// const apiReducer = () => {
//     return {
//         chat: socket_url,
//         auth: "https://backgammonserver.azurewebsites.net/api/auth",
//         users: "https://backgammonserver.azurewebsites.net/api/users"
//     }
// }

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    userState: userStateReducer,
    socket: socketReducer,
    apiUrls: apiReducer
});

export default rootReducer;