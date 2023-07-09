import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:3000"); // Replace with your server URL

const Chat1 = () => {
  const [roomID, setRoomID] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chat message", { message, roomID });
      setMessage("");
    }
  };

  const handleShareJoinLink = () => {
    const joinLink = window.location.origin + "?roomID=" + roomID;
    navigator.clipboard.writeText(joinLink);
    alert("Join link copied to clipboard!");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomID = urlParams.get("roomID");
    if (queryRoomID) {
      setRoomID(queryRoomID);
      handleRoomAction(queryRoomID);
    }

    socket.on("roomCreated", ({ roomID }) => {
      setRoomID(roomID);
      setIsJoined(true);
    });

    socket.on("roomJoined", ({ roomID, nickname }) => {
      setRoomID(roomID);
      setNickname(nickname);
      setIsJoined(true);
    });

    socket.on("chat message", (data) => {
      const { sender, message } = data;
      setChatLog((prevChatLog) => [...prevChatLog, { sender, message }]);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRoomAction = (customRoomID) => {
    const trimmedRoomID = customRoomID && customRoomID.trim();
    if (trimmedRoomID && trimmedRoomID !== "") {
      console.log(trimmedRoomID);
      socket.emit("joinRoom", trimmedRoomID);
    } else {
      socket.emit("createRoom");
    }
  };

  const handleKeyboardOpen = () => {
    if (isMobile) {
      const container = document.getElementById("chat-container");
      container.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <div
      id="chat-container"
      style={{
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        {isJoined ? (
          <div>
            <h3 style={{ marginBottom: "10px" }}>Room ID: {roomID}</h3>
            <h3 style={{ marginBottom: "20px" }}>Nickname: {nickname}</h3>
            <div style={{ marginBottom: "20px" }}>
              {chatLog.map((chat, index) => (
                <p
                  key={index}
                  style={{
                    margin: "5px 0",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    textAlign: chat.sender === nickname ? "right" : "left",
                  }}
                >
                  <strong>{chat.sender}: </strong> {chat.message}
                </p>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={handleKeyboardOpen}
                style={{
                  flex: "1",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginRight: "10px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
              <button
                onClick={handleShareJoinLink}
                style={{
                  marginLeft: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Share Join Link
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomID}
              onChange={handleRoomIDChange}
              onFocus={handleKeyboardOpen}
              style={{
                marginBottom: "10px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                width: "100%",
              }}
            />
            <button
              onClick={() => handleRoomAction(roomID)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {roomID !== "" ? "Join Room" : "Create Room"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat1;
