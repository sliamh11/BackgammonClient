import './User.css';
import { Line, Icon } from 'UIKit';
import { faDice, faComments } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const User = ({ user, status }) => {

    // ------ States ------
    const username = useSelector((state) => state.userState);
    const socket = useSelector((state) => state.socket);
    const history = useHistory();

    // ------ Helpers ------
    const handleChatClicked = () => {
        // Navigate to chat page.
        history.push({
            pathname: '/chat',
            state: {
                partner: user
            }
        });
    }

    const handleGameClicked = () => {
        // Send a game request to the chosen user.
        socket.emit("request_game", username, user);
    }

    return (
        <div className="user-container">
            <Line justify="between">
                <Line justify="start">
                    <div className={`status ${status}`}></div>
                    <div className="user-name">{user}</div>
                </Line>
                {status !== "offline"
                    ?
                    <Line justify="end">
                        <div className="icon-container" onClick={handleGameClicked}>
                            <Icon i={faDice} />
                        </div>
                        <div className="icon-container" onClick={handleChatClicked}>
                            <Icon i={faComments} />
                        </div>
                    </Line>
                    :
                    <></>}
            </Line>
        </div>
    )
}

export default User;