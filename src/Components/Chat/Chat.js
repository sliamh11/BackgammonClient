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
    const { partner } = location.state || 'unknown';
    const username = useSelector((state) => state.userState);
    const socket = useSelector((state) => state.socket);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [chatName, setChatName] = useState(null);
    const [isTextFocus, setIsTextFocus] = useState(false);

    // ------ useEffects ------
    useEffect(() => {
        connectToChat();
        initSockets();
    }, []);

    useEffect(() => {
        // Scrolls down whenever chat updated.
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    // ------ Sockets & Listeners ------
    const initSockets = () => {
        socket.once("joined_chat", onJoinedRoom);
        socket.on("receive_msg", onMsgReceived);
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
        if (message.trim() === "") {
            return;
        }
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

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && isTextFocus) {
            handleSendMessage();
        }
    }

    const loadChat = () => {
        if (chat) {
            return chat.map((content, index) => {
                return (
                    <div key={index} className="message-container">
                        <div ref={scrollRef} className={`message ${content.sender === username ? "myMsg" : "partnerMsg"}`}>
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
                    </div>
                </div>
                <div className="textarea-box">
                    <textarea value={message}
                        onKeyDown={handleKeyDown}
                        onFocus={e => setIsTextFocus(e)}
                        onBlur={e => setIsTextFocus(e)}
                        onChange={(e) => setMessage(e.target.value)}></textarea>
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
        </div>
    )
}

export default Chat;