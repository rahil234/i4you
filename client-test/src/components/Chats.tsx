import {useState} from 'react';

const Chats = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <div>
                <input value={message} onChange={(e) => setMessage(e.target.value)}/>
                <button onClick={() => {
                    if (message.length > 0) {
                        setMessages([...messages, message])
                        setMessage("");
                    }
                }}>Send
                </button>
            </div>
        </div>
    );
};

export default Chats;
