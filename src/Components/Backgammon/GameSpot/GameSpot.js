import './GameSpot.css';
import GamePiece from '../GamePiece/GamePiece';
import { useSelector } from 'react-redux';

const GameSpot = (props) => {

    // ------ States ------
    const socket = useSelector((state) => state.socket);

    // ------ Properties ------
    const { index, count, isBlackOnTop, isMoveable, isRemoveable } = props.value;
    const { isClickable } = props;

    // ------ Helpers ------
    const handleTargetChosen = () => {
        socket.emit("target_spot_chosen", index);
    }

    const loadByStatus = () => {
        // Load the spot by it's status - Default / Moveable / Removeable. 
        if (isRemoveable) {
            return (
            <div className={`${props.side} removeable`} onClick={handleTargetChosen}>
                <div className="piece-stack">
                    {loadGamePieces()}
                </div>
            </div>
            )
        } else if (isMoveable) {
            return (
                <div className={`${props.side} moveable`} onClick={handleTargetChosen}>
                    <div className="piece-stack">
                        {loadGamePieces()}
                    </div>
                </div>
            )
        } else {
            return (
                <div className={`${props.side}`}>
                    <div className="piece-stack">
                        {loadGamePieces()}
                    </div>
                </div>
            )
        }
    }

    const loadGamePieces = () => {
        const pieces = [];
        const color = isBlackOnTop ? "black" : "white";

        for (let i = 0; i < count; i++) {
            pieces.push(<GamePiece spotIndex={index} isClickable={isClickable} isMoveable={isMoveable} isRemoveable={isRemoveable} color={color} />)
        }

        return pieces.map((value, index) => {
            return <div key={index}>{value}</div>
        });
    }

    return (
        <div id={props.id} className={`inner-spot-container ${props.position}`}>
            {loadByStatus()}
        </div>
    )
}

export default GameSpot;