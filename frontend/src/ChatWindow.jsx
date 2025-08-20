import "./ChatWindow.css"
import Chat from "./Chat.jsx"
import { useContext, useState } from "react";
import MyContext from "./MyContext";
import { ScaleLoader } from 'react-spinners'

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        setPrevChats(prev => [...prev, { role: "user", content: prompt }]);
        setPrompt("");

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, options);
            const res = await response.json();
            setReply(res.reply || "Error: No reply from server.");

            // push assistant message (blank first, Chat.jsx will animate latestReply)
            setPrevChats(prev => [...prev, { role: "assistant", content: res.reply }]);

        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <div className="ChatWindow">

            <div className="navbar">
                <span>Yourgpt<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIcon">
                    <span><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask Anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : null}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>

                <div className="info">
                    <p>Yourgpt can make mistakes. Check important info.</p>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;
