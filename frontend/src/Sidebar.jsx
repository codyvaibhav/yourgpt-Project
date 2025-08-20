import { useContext, useEffect } from "react";
import "./Sidebar.css"
import MyContext from "./MyContext";
import {v1 as uuidv1} from 'uuid';

function SideBar() {
    const {allThreads,setAllThreads,currThreadId,setPrompt,setReply,setCurrThreadId,setNewChat,setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/thread`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const res = await response.json();
            const filteredData = res.map((thread) => ({threadId: thread.threadId ,title: thread.title}));
            setAllThreads(filteredData);
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/thread/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res.messages || []);
            setNewChat(false);
            setReply(null);
        }catch(err){
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            setAllThreads(prev => prev.filter((thread) => thread.threadId !== threadId));

            if(threadId === currThreadId) createNewChat();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button className="button" onClick={createNewChat}>
                <img className="logo" src="src/assets/gptlogo.png" alt="gpt-logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ''}
                        >   
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>Made by Vaibhav &hearts;</p>
            </div>
        </section>
    )
}

export default SideBar;