import React from "react";
import MessageContainer from "../Message/MessageContainer";
import ConversationPanel from "../Message/ConversationPanel";
import G1 from "../assets/G1.png";
import G2 from "../assets/G2.png";
import G3 from "../assets/G5.png";
import G4 from "../assets/G4.png";
import "./Chat.css";

const Chat = () => {
  // Define the conversation log
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
    {
      avatar: G2,
      nickname: "G2",
      reversed: true,
      messages: [
        {
          id: "021",
          time: "12:18",
          Response: [],
          message: "Hello",
        },
        {
          id: "022",
          time: "12:18",
          Response: [],
          message: "I am Fine",
        },
        {
          id: "023",
          time: "12:19",
          Response: [],
          message: "How about you?",
        },
      ],
    },
    {
      avatar: G3,
      nickname: "G3",
      messages: [
        {
          id: "031",
          time: "12:19",
          Response: [],
          message: "Hey, I am also fine",
        },
      ],
    },
    {
      avatar: G4,
      nickname: "G4",
      messages: [
        {
          id: "032",
          time: "12:22",
          Response: [],
          message: "I am also fine",
        },
        {
          id: "035",
          time: "12:30",
          Response: [],
          message: "Thank You",
        },
      ],
    },
    {
      avatar: G1,
      nickname: "G1",
      messages: [
        {
          id: "041",
          time: "12:35",
          Response: [],
          message: "That's good to hear!",
        },
      ],
    },
    {
      avatar: G2,
      nickname: "G2",
      reversed: true,
      messages: [
        {
          id: "042",
          time: "12:40",
          Response: [],
          message: "Yeah, things are going well.",
        },
      ],
    },
    {
      avatar: G3,
      nickname: "G3",
      messages: [
        {
          id: "051",
          time: "12:45",
          Response: [],
          message: "I have some exciting news to share!",
        },
        {
          id: "052",
          time: "12:46",
          Response: [],
          message: "I just got a promotion at work!",
        },
      ],
    },
    {
      avatar: G4,
      nickname: "G4",
      messages: [
        {
          id: "061",
          time: "12:50",
          Response: [],
          message: "Congratulations! That's amazing!",
        },
        {
          id: "062",
          time: "12:52",
          Response: [],
          message: "You've worked hard for it.",
        },
      ],
    },
  ];
  return (
    <div className="--dark-theme" id="chat">
      {/* Chat conversation board */}
      <div className="chat__conversation-board">
        {conversationLog.map((message, index) => (
          <MessageContainer
            key={index}
            avatar={message.avatar}
            nickname={message.nickname}
            message={message.message}
            messages={message.messages} // Fix: Access `message.messages` directly
            reversed={message.reversed}
            time={message.messages.time}
          />
        ))}
      </div>
      {/* Conversation panel */}
      <ConversationPanel />
    </div>
  );
};

export default Chat;
