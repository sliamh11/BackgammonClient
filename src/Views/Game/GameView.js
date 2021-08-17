import './GameView.css';
import { Grid, AlertDialog } from 'UIKit';
import Chat from "Components/Chat/Chat";
import Board from "Components/Backgammon/Board/Board";
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// This component is in charge of the page itself, containing both the Board and Chat components.
const GameView = (props) => {

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
        <div className="game-view-screen">
            <Grid className="game-view">
                <div className="board-screen">
                    <Board></Board>
                </div>
                <Chat></Chat>
            </Grid>
            {alert.isAlert
                ? <AlertDialog header={alert.header} content={alert.message} setResult={setAlert} />
                : ""
            }
        </div>
    )
}

export default GameView;