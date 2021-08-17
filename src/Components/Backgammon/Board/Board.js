import './Board.css';
import GameSpot from '../GameSpot/GameSpot';
import Dice from '../Dice/Dice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AlertDialog } from 'UIKit';

const Board = (props) => {

    // ------ States ------
    const username = useSelector((state) => state.userState);
    const socket = useSelector((state) => state.socket);
    const history = useHistory();
    const location = useLocation();
    const { partner } = location.state || 'unknown';
    const [board, setBoard] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [diceRolls, setDiceRolls] = useState([]);
    const [partnerDicesRolls, setPartnerDicesRoll] = useState([]);
    const [isMyTurn, setIsMyTurn] = useState(true);
    const [isWhitePieces, setIsWhitePieces] = useState(false);
    const [chosenSpot, setChosenSpot] = useState(-1);
    const [targetSpot, setTargetSpot] = useState(-1);
    const [isGameOver, setIsGameOver] = useState(false);

    const [alert, setAlert] = useState({
        isAlert: false,
        header: "",
        message: "",
        isClosed: false
    });

    // ------ useEffects ------

    useEffect(() => {
        initSockets();
    }, []);

    useEffect(() => {
        // Relevant only for rolling dices for turns.
        if (!gameStarted) {
            if (diceRolls.length > 0 && partnerDicesRolls.length > 0) {
                const rollsResults = [
                    { username: username, roll: diceRolls },
                    { username: partner, roll: partnerDicesRolls }
                ];
                socket.emit("all_turns_rolled", rollsResults, username);
            }
        }
    }, [diceRolls]);

    useEffect(() => {
        // When a spot was chosen.
        if (chosenSpot > -1) {
            const data = {
                chosen_index: chosenSpot,
                rolls: diceRolls,
                board: board
            }
            socket.emit("calc_options", data);
        }
    }, [chosenSpot]);

    useEffect(() => {
        // When the player chose the index he wants to move to.
        if (targetSpot > -1) {
            const data = {
                start_index: chosenSpot,
                target_index: targetSpot,
                rolls: diceRolls,
                board: board
            }
            socket.emit("move_piece", data);
        }
    }, [targetSpot]);

    useEffect(() => {
        // Reset the dices for both players when the turn switchs.
        setDiceRolls([]);
        setPartnerDicesRoll([]);
    }, [isMyTurn]);

    useEffect(() => {
        // When the 'Ok' button in the alert window is clicked.
        // Will be called when game ends.
        if (isGameOver && alert.isClosed) {
            history.go(0);
        } else if (alert.isClosed) {
            // Will be called when need to re-roll turns.
            setAlert({
                isAlert: false,
                header: "",
                message: "",
                isClosed: false
            });
        }
    }, [alert]);

    // ------ Listeners ------

    const initSockets = () => {
        socket.once("joined_game", onJoinedGame);
        socket.on("turn_rolled", onTurnRolled);
        socket.on("roll_again", onRollAgain);
        socket.once("game_start", onGameStart);
        socket.on("switch_turn", onSwitchTurn);
        socket.on("dices_rolled", onDicesRolled);
        socket.on("chosen_spot", onChosenSpot);
        socket.on("show_options", onShowOptions);
        socket.on("chosen_target_spot", onChosenTarget);
        socket.on("piece_moved", onPieceMoved);
        socket.once("game_over", onGameOver);
        socket.on("game_request", onGameRequest);
    }

    const onJoinedGame = (board) => {
        setBoard(board);
    }

    const onTurnRolled = (rollData) => {
        // When a player rolls a dice to check if hes first or second, update the relevant state.
        if (rollData.user === username) {
            setDiceRolls([rollData.result]);
        } else {
            setPartnerDicesRoll([rollData.result]);
        }
    }

    const onRollAgain = (msg) => {
        // Notify players about a tie in the turn-rolls phase.
        setDiceRolls([]);
        setPartnerDicesRoll([]);
        setAlert({
            isAlert: true,
            header: "Roll Again!",
            message: msg,
            isClosed: false
        });
    }

    const onGameStart = (data) => {
        // Initialize the game by the turn-rolls results
        let isWhitePieces = undefined;
        if (data.winner === username) {
            setBoard(data.board);
            setIsWhitePieces(true);
            isWhitePieces = true;
        } else {
            setIsMyTurn(false);
            setIsWhitePieces(false);
            setBoard(data.board);
            isWhitePieces = false;
        }
        socket.emit("piece_color", isWhitePieces);
        isWhitePieces ? props.setColor("white") : props.setColor("black");
        setDiceRolls([]);
        setPartnerDicesRoll([]);
        setGameStarted(true);
    }

    const onDicesRolled = (rolls) => {
        if (isMyTurn) {
            setDiceRolls([...rolls]);
        }
    }

    const onSwitchTurn = () => {
        // will be activated when oponent emitted socket.emit("end_turn").
        setIsMyTurn(myTurn => !myTurn);
    }

    const onChosenSpot = (spotIndex) => {
        setChosenSpot(spotIndex);
    }

    const onShowOptions = (data) => {
        // Called when server sent optional spots to move to.
        setBoard(data.board);
        if (data.isBurnedNoOptions) {
            setIsMyTurn(myTurn => !myTurn);
            socket.emit("end_turn");
        }
    }

    const onChosenTarget = (targetIndex) => {
        setTargetSpot(targetIndex);
    }

    const onPieceMoved = (data) => {
        // Update dices and board after each piece movement for both players.
        if (isMyTurn) {
            setBoard(data.board);
            setDiceRolls(data.rolls);
            setTargetSpot(-1);
            setChosenSpot(-1);

            if (data.rolls.length === 0) {
                socket.emit("end_turn");
            }
        } else {
            setPartnerDicesRoll(data.rolls);
            setBoard(data.board);
        }
    }

    const onGameOver = (data) => {
        // Update the last moves of the player and pop up the AlertDialog Component.
        setIsGameOver(true);
        setDiceRolls(data.rolls);
        setBoard(data.board);
        socket.emit("game_over");
        setAlert({
            isAlert: true,
            header: "Game Over!",
            message: data.message,
            isClosed: false
        });
    }

    const onGameRequest = (oponent) => {
        // If another user sends a game request mid-game, notify him that the user is busy.
        socket.emit("partner_declined", oponent, true);
    }

    // ------ Helpers ------

    const checkPosition = (index) => {
        // checks if the spot's position is even / odd / middle.
        const isMiddle = index === 19 || index === 6;
        let position = undefined;
        if (isMiddle) {
            return position = "middle"
        }
        // If the index is between middle indexs - add 1 to index so it's colors will keep on order.
        if (index > 6 && index < 19) {
            index += 1;
        }
        let spot = index + 1 % 6;
        position = spot % 2 === 0 ? "even" : "odd";
        return position;
    }

    const checkIsClickable = (value, index) => {
        // Check if the Roll Button is clickable.
        const isBurnedPieces = isWhitePieces ? board[6].count > 0 : board[19].count > 0;
        if (isBurnedPieces) {
            if (isWhitePieces) {
                if (index === 6 && isMyTurn && diceRolls.length > 0) {
                    return true;
                }
            } else {
                if (index === 19 && isMyTurn && diceRolls.length > 0) {
                    return true;
                }
            }
            return false;
        } else {
            return value.isBlackOnTop === !isWhitePieces && isMyTurn && diceRolls.length > 0;
        }
    }

    const loadTopRow = () => {
        return board.map((value, index) => {
            const isClickable = checkIsClickable(value, index);
            const spotsOrder = isWhitePieces ? index < board.length / 2 : index >= board.length / 2;
            value.index = index;
            if (spotsOrder) {
                const position = checkPosition(index);
                return (
                    <div key={index} className="spot-container ltr-spot">
                        <GameSpot id={index} position={position} value={value} isClickable={isClickable} side="top"></GameSpot>
                    </div>
                )
            } else {
                return;
            }
        });
    }

    const loadBottomRow = () => {
        return board.map((value, index) => {
            const isClickable = checkIsClickable(value, index);
            const spotsOrder = isWhitePieces ? index >= board.length / 2 : index < board.length / 2;
            value.index = index;
            if (spotsOrder) {
                const position = checkPosition(index);
                return (
                    <div key={index} className="spot-container bot-row">
                        <GameSpot id={index} position={position} value={value} isClickable={isClickable} side="bottom" />
                    </div>
                )
            } else {
                return;
            }
        });
    }

    const handleRollClick = () => {
        // Setting a random value so the player wont be able to double click fast.
        setDiceRolls([0]);
        // Sending a request to the server to roll dices.
        if (gameStarted) {
            socket.emit("roll_dices");
        } else {
            socket.emit("roll_turn", username);
        }
    }

    const handleEndTurn = () => {
        // Switch turns for the player, and notify the oponent for turn switching.
        setIsMyTurn(myTurn => !myTurn);
        socket.emit("end_turn");
    }

    const loadButtons = () => {
        if (gameStarted) {
            const canRoll = diceRolls.length === 0;
            return (
                <div>
                    <div className="roll-turns-container">
                        <div className="cube1"><Dice dice={`${diceRolls[0]}`} /></div>
                        {isMyTurn
                            ? <div className={`board-button ${canRoll ? "" : "rolled-dices"}`} onClick={canRoll ? handleRollClick : undefined}>Roll</div>
                            : <div className="oponent-turn">
                                <div>{`${partner || 'oponent'}'s turn`}</div>
                                <div className="board-button not-my-turn">Roll</div>
                            </div>
                        }
                        <div className="cube2"><Dice dice={`${diceRolls[1]}`} /></div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="roll-turns-container">
                        <div className="oponent-dice">{`${partner || 'oponent'}'s dice`}</div>
                        <div className="oponent-roll-turn-dice"><Dice dice={`${partnerDicesRolls[0]}`} /></div>
                        {diceRolls.length > 0
                            ? <div className="board-button not-my-turn">Roll</div>
                            : <div className="board-button roll-turn" onClick={handleRollClick}>Roll</div>
                        }
                        <div className="my-dice">My Dice</div>
                        <div className="my-roll-turn-dice"><Dice dice={`${diceRolls[0]}`} /></div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="board-grid">
            <div className="inner-board-grid top-row-rtl">
                {loadTopRow()}
            </div>
            <div className="inner-board-grid">
                {loadBottomRow()}
            </div>
            <div>
                <div className="end-turn-container">
                    {gameStarted && isMyTurn && diceRolls.length > 0
                        ? <div className="board-button" onClick={handleEndTurn}>End Turn</div>
                        : <div className="board-button not-my-turn">End Turn</div>}
                </div>
                {loadButtons()}
            </div>
            {alert.isAlert
                ? <AlertDialog header={alert.header} content={alert.message} setResult={setAlert} />
                : ""
            }
        </div>
    )
}

export default Board;