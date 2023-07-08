import React, { useEffect, useRef, useState } from "react";
import MessageContainer from "../Message/MessageContainer";
import G1 from "../assets/G1.png";
import G2 from "../assets/G2.png";
import "./Chat.css";
import socket from "../Socket/Socket";
import isTypingIconDark from "../assets/typingLight1.gif";
import isTypingIconLight from "../assets/typingDark1.gif";

const Chat = () => {
  const [receive, setReceive] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const containerRef = useRef(null);
  const [isTyping, setIsTypind] = useState(false);

  const scrollToBottom = () => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [receive]);

  useEffect(() => {
    socket.on("connectedRoom", (data) => {
      setRoom(data);
    });

    socket.on("chat message", (data) => {
      const { sender, message, timestamp } = data;
      const newMessage = {
        messages: [{ message: message, time: timestamp }],
        sender: sender,
        avatar: G2,
      };
      setReceive((prevReceive) => [...prevReceive, newMessage]);
      vibrate();
      setIsTypind(false); // Trigger vibration when a new message is received
    });
    let typingTimeout;
    socket.on("typing", (data) => {
      const { typing } = data;
      setIsTypind(typing);
      if (typing) {
        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
          setIsTypind(false);
        }, 1000);
      }
    });
  }, []);
  console.log(isTyping);
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

    const newMessage = {
      messages: [{ message: userMessage, time: formattedTime }],
      sender: username,
      reversed: true,
      avatar: G1,
    };

    setReceive((prevReceive) => [...prevReceive, newMessage]);

    socket.emit("chat message", {
      sender: username,
      message: userMessage,
      room,
      timestamp: formattedTime,
    });

    setUserMessage("");
  };

  const onChengHendel = (e) => {
    socket.emit("typing", { typing: true, room });
    setUserMessage(e.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessageClick();
    }
  };

  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200); // Vibrate for 200ms
    }
  };

  return (
    <div id="chat">
      {/* Chat conversation board */}
      {/* Chat conversation board */}
      <div className="chat__conversation-board" ref={containerRef}>
        {receive &&
          receive.map((message, index) => (
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
      <div className={`isTypingIconsContainer ${isTyping ? "visible" : ""}`}>
        <img
          src={isTypingIconLight}
          style={{ width: "2.5rem" }}
          className="isTypingIconLight"
        />
        <img
          src={isTypingIconDark}
          style={{ width: "2.5rem" }}
          className="isTypingIconDark"
        />
      </div>
      <div className="chat__conversation-panel">
        <div className="chat__conversation-panel__container">
          <button
            className="chat__conversation-panel__button panel-item btn-icon add-file-button"
            // onClick={handleAddFileClick}
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
          <button className="chat__conversation-panel__button panel-item btn-icon emoji-button">
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
            onChange={onChengHendel}
            value={userMessage}
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
