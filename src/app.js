import React, { useState, useRef, useEffect } from "react";
import "./app.css";

function Bubble({ text, sender }) {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] p-3 rounded-2xl shadow-lg mb-2 text-white 
        ${sender === "user" ? "bg-gradient-to-r from-indigo-400 to-purple-500" : "bg-gradient-to-r from-blue-400 to-cyan-400"}`}>
        {text}
      </div>
    </div>
  );
}

function FancyLoader() {
  return (
    <div className="flex justify-center items-center py-3">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([{ sender: "bot", text: "👋 Hi! Ask me anything." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const chatHistory = [...messages, userMsg].map(m => m.text);
    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Error contacting Gemini API." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-sky-200 to-purple-100 min-h-screen flex flex-col items-center">
      <div className="mt-10 w-full max-w-xl rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg p-7">
        <div className="text-3xl font-bold text-center text-gradient mb-6">Gemini 2.0 Flash Chatbot ✨</div>
        <div className="h-[400px] overflow-auto px-2 mb-4 flex flex-col">
          {messages.map((m, i) => <Bubble key={i} text={m.text} sender={m.sender} />)}
          {loading && <FancyLoader />}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border-2 border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
      <footer className="mt-10 text-sm text-gray-500">Powered by Gemini 2.0 Flash · © 2025</footer>
    </div>
  );
}

export default App;
