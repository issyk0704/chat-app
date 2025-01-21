import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

// Connect to the backend server
const socket = io.connect("http://localhost:5001");

function App() {
  const [username, setUsername] = useState(""); // Username for the user
  const [message, setMessage] = useState(""); // Current message input
  const [messages, setMessages] = useState([]); // List of all messages

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received message from backend:", data); // Debug log
      setMessages((prevMessages) => [...prevMessages, data]); // Update messages
    });
  
    return () => socket.off("receive_message");
  }, []);
  
  
  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      const msgData = { username, message };
      console.log("Sending message:", msgData); // Log sent message
      socket.emit("send_message", msgData);
      setMessages((prevMessages) => [...prevMessages, msgData]);
      setMessage("");
    }
  };
  
  

  return (
    <div className="App">
      <div className="chat-container">
        <div className="header">Chat App</div>

        {/* Message Display */}
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.username === username ? "self" : ""}`}
            >
              <strong>{msg.username}</strong>: {msg.message}
            </div>
          ))}
        </div>

        {/* Input Fields */}
        <div className="input-container">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!username} // Disable after username is set
          />
          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          {/* Send Button */}
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
