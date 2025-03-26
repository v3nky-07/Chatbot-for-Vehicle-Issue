import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/chat", {
                message: input,
                history: updatedMessages
            });
            
            const botMessage = { role: "assistant", content: response.data.response };
            setMessages([...updatedMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setLoading(false);
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Car Issue Chatbot</h2>
            <div className="h-64 overflow-y-auto p-2 bg-white border rounded-md">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role === "user" ? "text-right" : "text-left"}>
                        <p className={`p-2 inline-block rounded-lg ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    className="flex-grow p-2 border rounded-l-md"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the car symptoms..."
                />
                <button
                    className="p-2 bg-blue-500 text-white rounded-r-md"
                    onClick={sendMessage}
                    disabled={loading}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
