import React, { useEffect, useState } from "react";
import MessageContainer from "../Message/MessageContainer";
import ConversationPanel from "../Message/ConversationPanel";
import G1 from "../assets/G1.png";
import G2 from "../assets/G2.png";
import G3 from "../assets/G5.png";
import G4 from "../assets/G4.png";
import "./Chat.css";
import socket from "../Socket/Socket";

const Chat = () => {
  // Get current date and time
  // Output the formatted time

  // Define the conversation log
  const [recive, setRecive] = useState([]);
  const [usermessage, setUsermessage] = useState("");
  const [room, setRoom] = useState("");
  const [senderCkeck, setSenderCheck] = useState(false);
  const [reciverCheck, setReciverCheck] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    socket.on("connectedRoom", (data) => {
      // setUsername(data);
      setRoom(data);
    });
  }, []);
  const handleAddFileClick = () => {
    // Add file button click handler logic
  };

  const handleEmojiClick = () => {
    // Emoji button click handler logic
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessageClick();
    }
  };

  const handleSendMessageClick = () => {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    var formattedTime = hours + ":" + minutes + " " + ampm;
    
    socket.emit("chat message", {
      sender: username,
      message: usermessage,
      room,
      timestamp: formattedTime,
    });
    
    setRecive((prevRecive) => [
      ...prevRecive,
      {
        messages: [{ message: usermessage, time: formattedTime }],
        sender: username,
        reversed: true,
        avatar: G1,
      },
    ]);
    
    setUsermessage("");
  };

  socket.on("chat message", (data) => {
    const { sender, message, timestamp } = data;
   setRecive([
        ...recive,
        {
          messages: [{ message: message, time: timestamp }],
          sender: sender,
          avatar: G2,
        },
      ])
      
  });
  console.log(recive);

  const conversationLog = [
    {
      avatar: G1,
      nickname: "G1",
      messages: [
        {
          id: "011",
          time: "12:12",
          Response: [],
          message: "Hii",
        },
        {
          id: "012",
          time: "12:15",
          Response: [],
          message: "How Are You",
        },
      ],
    },
  ];
  return (
    <div className="--dark-theme" id="chat">
      {/* Chat conversation board */}
      <div className="chat__conversation-board">
         { recive && recive.map((message, index) => (
          <MessageContainer
            key={index}
            avatar={message.avatar}
            nickname={message.nickname}
            messages={message.messages} // Fix: Access `message.messages` directly
            reversed={message.reversed}
            time={message.messages.time}
          />
        ))}
      </div>

      <div className="chat__conversation-panel">
        <div className="chat__conversation-panel__container">
          <button
            className="chat__conversation-panel__button panel-item btn-icon add-file-button"
            onClick={handleAddFileClick}
          >
            <svg
              className="feather feather-plus sc-dnqmqq jxshSx"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            className="chat__conversation-panel__button panel-item btn-icon emoji-button"
            onClick={handleEmojiClick}
          >
            <svg
              className="feather feather-smile sc-dnqmqq jxshSx"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
          <input
            className="chat__conversation-panel__input panel-item"
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            onChange={(e) => setUsermessage(e.target.value)}
            value={usermessage}
            
          />
          <button
            className="chat__conversation-panel__button panel-item btn-icon send-message-button"
            onClick={handleSendMessageClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              data-reactid="1036"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
