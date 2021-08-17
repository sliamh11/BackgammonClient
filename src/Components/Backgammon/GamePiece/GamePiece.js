import './GamePiece.css';
import { useSelector } from 'react-redux';

const GamePiece = (props) => {

    // ------ States ------
    const socket = useSelector((state) => state.socket);

    // ------ Properties ------
    const { color, isClickable, spotIndex, isMoveable, isRemoveable } = props;

    // ------ Helpers ------
    const handlePieceClicked = () => {
        // Only if the player doesn't want to move a piece to this spot, emit a "spot_chosen" event.
        if (!isMoveable && !isRemoveable) {
            socket.emit("spot_chosen", spotIndex);
        }
    }

    return (
        <div
            className={`game-piece ${color} ${isClickable ? "clickable" : ''}`}
            onClick={isClickable ? handlePieceClicked : undefined}>
        </div>
    )
}

export default GamePiece;