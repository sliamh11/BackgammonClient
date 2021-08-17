import './ContactView.css';
import { Box } from "UIKit";
import { ContactsList } from 'Components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ConfirmDialog, AlertDialog } from 'UIKit';

const ContactView = (props) => {

    // --------- States ---------
    const username = useSelector((state) => state.userState);
    const socket = useSelector((state) => state.socket);
    const api_users = useSelector((state) => state.apiUrls.users);
    const [usersOnline, setUsersOnline] = useState([]);
    const [usersOffline, setUsersOffline] = useState([]);
    const history = useHistory();
    const [alert, setAlert] = useState({
        isAlert: false,
        message: "",
        isClosed: false
    });
    const [gameRequest, setGameRequest] = useState({
        isRequested: false,
        oponent: null,
        message: ''
    });
    const [requestResult, setRequestResult] = useState({
        isAccepted: false,
        isDeclined: false
    });

    // --------- useEffects ---------

    useEffect(() => {
        // constructor-like
        initSockets();
        socket.emit("user_connected", username);
    }, []);

    useEffect(() => {
        // Called whenever a user joins / leaves the site.
        loadUsers();
    }, [usersOnline]);

    useEffect(() => {
        // Handles the incoming game requests.
        if (gameRequest.isRequested) {
            if (requestResult.isAccepted) {
                socket.emit("partner_accepted", username, gameRequest.oponent)
            } else {
                socket.emit("partner_declined", gameRequest.oponent);
            }

            setGameRequest({
                isRequested: false,
                oponent: "",
                message: ""
            });
        }
    }, [requestResult]);

    useEffect(() => {
        // Changes the 'alert' state back to default when user clicks on 'Ok'.
        if (alert.isClosed) {
            setAlert({
                isAlert: false,
                message: "",
                isClosed: false
            });
        }
    }, [alert]);

    // --------- Socket Listeners ---------
    const initSockets = () => {
        socket.on("online_users", onOnlineUsers);
        socket.on("game_request", onGameRequest);
        socket.on("game_accepted", onGameAccepted);
        socket.on("game_request_failed", onRequestFailed);
        socket.on("server_error", onServerError);
    }

    const onGameRequest = (oponent) => {
        // Called for each incoming game request.
        // by setting the gameRequest state, the "Game Request" Dialog will pop up.
        setGameRequest({
            isRequested: true,
            oponent: oponent,
            message: `${oponent} has challenged you for a round, do you accept?`
        });
    }

    const onGameAccepted = (roomName, participants) => {
        socket.emit("join_game", roomName);
        // Get the partner's name from the participants.
        let partnerName = undefined;
        partnerName = participants[0].username === username
            ? participants[1].username
            : participants[0].username;

        // Navigates to the game page.
        history.push({
            pathname: '/game',
            state: {
                partner: partnerName
            }
        });
    }

    const onRequestFailed = (msg) => {
        // called when a game request failed, either because of availablity or decline.
        setAlert({
            isAlert: true,
            message: msg,
            isClosed: false
        });
    }

    const onOnlineUsers = (users) => {
        // Updates the Contact List with the updated users list.
        if (users.length > 0) {
            setUsersOnline(users);
        }
    }

    const onServerError = (msg) => {
        // Pops up an alert whenever theres a "server_error" emitted from server.
        setAlert({
            isAlert: true,
            header: "Server Error!",
            message: msg,
            isClosed: false
        });
    }

    // --------- Helpers ---------

    // Load online & offline users.
    const loadUsers = async () => {
        const allUsers = await axios.get(api_users);
        const offlineUsers = allUsers.data.filter((user) => {
            if (user !== username) {
                if (!(usersOnline.some(u => u.username === user))) {
                    return user;
                }
            }
        });
        setUsersOffline(offlineUsers);
    }

    return (
        <div className="contact-screen">
            <Box>
                <div className="contact-container">
                    <div className="contact-grid">
                        <div className="contact-title">
                            <h1>{username}</h1>
                        </div>
                        <div className="contacts online">
                            <div className="contacts-title">
                                Online Contacts
                            </div>
                            <ContactsList status="online" users={usersOnline} />
                        </div>
                        <div className="contacts offline">
                            <div className="contacts-title">
                                Offline Contacts
                            </div>
                            <ContactsList status="offline" users={usersOffline} />
                        </div>
                    </div>
                </div>
            </Box>
            {gameRequest.isRequested
                ? <ConfirmDialog
                    header="Game Request"
                    content={gameRequest.message}
                    setResult={setRequestResult} />
                : ""}
            {alert.isAlert
                ? <AlertDialog header="Message Received"
                    content={alert.message}
                    setResult={setAlert} />
                : ""}

        </div>
    )
}

export default ContactView;