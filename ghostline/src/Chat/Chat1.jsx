import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:3000"); // Replace with your server URL

const Chat1 = () => {
  const [roomID, setRoomID] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [nickname, setNickname] = useState("");

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

  const handleRoomAction = (customRoomID) => {
    const trimmedRoomID = customRoomID && customRoomID.trim();
    if (trimmedRoomID && trimmedRoomID !== "") {
      console.log(trimmedRoomID);
      socket.emit("joinRoom", trimmedRoomID);
    } else {
      socket.emit("createRoom");
    }
  };

  return (
    <div>
      {isJoined ? (
        <div>
          <h3>Room ID: {roomID}</h3>
          <h3>Nickname: {nickname}</h3>
          <div>
            {chatLog.map((chat, index) => (
              <p key={index}>
                <strong>{chat.sender}: </strong> {chat.message}
              </p>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={handleShareJoinLink}>Share Join Link</button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomID}
            onChange={handleRoomIDChange}
          />
          <button onClick={() => handleRoomAction(roomID)}>
            {roomID !== "" ? "Join Room" : "Create Room"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat1;
