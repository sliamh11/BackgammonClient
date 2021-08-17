import "./ChatView.css";
import Chat from "Components/Chat/Chat";
import { AlertDialog } from "UIKit";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// This component is in charge of the Chat's page, chat's location and design.
const ChatView = (props) => {

    // ------ States ------
    const socket = useSelector((state) => state.socket);
    const [alert, setAlert] = useState({
        isAlert: false,
        header: "",
        message: "",
        isClosed: false
    });

    // ------ useEffects ------
    useEffect(() => {
        socket.on("server_error", onServerError);
    }, []);

    useEffect(() => {
        // If user clicked 'Ok' in the alert pop up.
        if (alert.isClosed) {
            setAlert({
                isAlert: false,
                header: "",
                message: "",
                isClosed: false
            });
        }
    }, [alert]);

    // ------ Listeners ------
    const onServerError = (msg) => {
        setAlert({
            isAlert: true,
            header: "Server Error!",
            message: msg,
            isClosed: false
        });
    }

    return (
        <div className="container">
            <Chat />
            {alert.isAlert
                ? <AlertDialog header={alert.header} content={alert.message} setResult={setAlert} />
                : ""
            }
        </div>
    )
}

export default ChatView;