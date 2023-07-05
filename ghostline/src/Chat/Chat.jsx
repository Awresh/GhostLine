import React from "react";
import MessageContainer from "../Message/MessageContainer";
import ConversationPanel from "../Message/ConversationPanel";
import G1 from '../assets/G1.png'
import G2 from '../assets/G2.png'
import G3 from '../assets/G5.png'
import G4 from '../assets/G4.png'
import "./Chat.css";

const Chat = () => {
  // Define the conversation log
  const conversationLog = [
    {
      avatar: G1,
      nickname: "G1",
      message: ["Somewhere stored deep, deep in my memory banks is the phrase 'It really whips the llama's ass'."],
    },
    {
      avatar: G3,
      nickname: "G3",
      message: ["Think the guy that did the voice has a Twitter?"],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["WE MUST FIND HIM!!", "Wait ..."],
    },
    {
      reversed: true,
      avatar: G4,
      nickname: "G4",
      message: ["Winamp's still an essential."],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["Are U From", "Wait ..."],
    },
    {
      avatar: G3,
      nickname: "G3",
      message:[ "I am from Kanpur"],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["And I am from Lucknow"],
    },
    {
      reversed: true,
      avatar: G4,
      nickname: "G4",
      messages: ["Ok Ok i got it", "I am from Gorakhpur"],
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
            messages={message.messages}
            reversed={message.reversed}
          />
        ))}
      </div>
      {/* Conversation panel */}
      <ConversationPanel />
    </div>
  );
};

export default Chat;
