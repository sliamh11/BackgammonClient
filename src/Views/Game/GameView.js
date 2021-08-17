import './GameView.css';
import { Grid } from 'UIKit';
import Chat from "Components/Chat/Chat";
import Board from "Components/Backgammon/Board/Board";

// This component is in charge of the page itself, containing both the Board and Chat components.
const GameView = (props) => {
    return (
        <Grid className="game-view">
            <div className="board-screen">
                <Board></Board>
            </div>
            <Chat></Chat>
        </Grid>
    )
}

export default GameView;