import './Message.css';

// This component displays the message in chat.
const Message = (props) => {
    const sender = props.sender;
    const message = props.msg;
    return (
        <div className="inner-message-container">
            <div className="sender">{sender}:</div>
            <div className="message">{message}</div>
        </div>
    )
}

export default Message;