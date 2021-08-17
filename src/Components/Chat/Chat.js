import './Chat.css';
import { Message } from 'Components';
import { Button } from "UIKit";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Chat = (props) => {

    // ------ States ------
    const location = useLocation();
    const scrollRef = useRef();
    const username = useSelector((state) => state.userState);
    const socket = useSelector((state) => state.socket);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [chatName, setChatName] = useState(null);
    const { partner } = location.state || 'unknown';

    // ------ useEffects ------
    useEffect(() => {
        connectToChat();
        initSockets();
    }, []);

    useEffect(() => {
        // Scrolls down whenever chat updated.
        scrollRef?.current.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    // ------ Sockets & Listeners ------

    const initSockets = () => {
        socket.once("joined_chat", onJoinedRoom);
        socket.on("receive_msg", onMsgReceived)
    }

    const onJoinedRoom = (data) => {
        // Initialize chat states.
        setChatName(data.chat_name);
        setChat(data.history);
    }

    const onMsgReceived = (msg) => {
        setChat(chat => [...chat, msg]);
    }

    // ------ Helpers ------
    const connectToChat = () => {
        const participants = [username, partner];
        socket.emit('join_chat', participants);
    }

    const handleSendMessage = () => {
        // When the player sends a message, send it to the other user and update states.
        let msgInfo = {
            chat_name: chatName,
            content: {
                sender: username,
                msg: message
            }
        };
        socket.emit("send_msg", msgInfo);
        setChat(chat => [...chat, msgInfo.content]);
        setMessage('');
    }

    const loadChat = () => {
        if (chat) {
            return chat.map((content, index) => {
                return (
                    <div key={index} className="message-container" ref={scrollRef}>
                        <div className={`message ${content.sender === username ? "myMsg" : "partnerMsg"}`}>
                            <Message msg={content.msg} sender={content.sender} />
                        </div>
                    </div>
                );
            });
        }
    }

    return (
        <div className="screen">
            <div className="chat-container">
                <div className="chat-title">
                    {`Chat with ${partner}`}
                </div>
                <div className="chat-body-wrapper">
                    <div className="chat-body">
                        {loadChat()}
                        <div ref={scrollRef}></div>
                    </div>
                </div>
                <div className="textarea-box">
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
        </div>
    )
}

export default Chat;