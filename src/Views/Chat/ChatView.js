import "./ChatView.css";
import Chat from "Components/Chat/Chat";

// This component is in charge of the Chat's page, chat's location and design.
const ChatView = (props) => {
    return (
        <div className="container">
            <Chat/>
        </div>
    )
}

export default ChatView;