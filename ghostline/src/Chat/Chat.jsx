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
        "Somewhere stored deep, deep in my memory banks is the phrase 'It really whips the llama's ass'.",
      ],
    },
    {
      avatar: G3,
      nickname: "G3",
      messages: ["Think the guy that did the voice has a Twitter?"],
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
      messages: ["Winamp's still an essential."],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["Are U From", "Wait ..."],
    },
    {
      avatar: G3,
      nickname: "G3",
      messages: ["I am from Kanpur"],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["And I am from Lucknow"],
    },
    {
      reversed: true,
      avatar: G4,
      messages: ["Ok Ok i got it", "I am from Gorakhpur"],
    },
    // Additional messages
    {
      avatar: G1,
      nickname: "G1",
      messages: ["Do you have any favorite music genres?"],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: [
        "I enjoy listening to various genres like pop, rock, and electronic music.",
      ],
    },
    {
      avatar: G3,
      nickname: "G3",
      messages: ["I'm a fan of hip-hop and R&B."],
    },
    {
      reversed: true,
      avatar: G4,
      nickname: "G4",
      messages: ["I love classical music and jazz."],
    },
    // More additional messages
    {
      avatar: G1,
      nickname: "G1",
      messages: ["That's cool! Music is so diverse and wonderful."],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["Absolutely! It's a universal language that connects people."],
    },
    {
      avatar: G3,
      nickname: "G3",
      messages: [
        "I completely agree. Music has the power to evoke emotions and memories.",
      ],
    },
    {
      reversed: true,
      avatar: G4,
      nickname: "G4",
      messages: ["Indeed. Each genre has its own unique charm."],
    },
    {
      avatar: G1,
      nickname: "G1",
      messages: ["By the way, do any of you play any musical instruments?"],
    },
    {
      avatar: G2,
      nickname: "G2",
      messages: ["I play the guitar. What about you guys?"],
    },
    {
      
      avatar: G3,
      nickname: "G3",
      messages: [
        "I'm learning to play the piano. It's challenging, but I love it.",
      ],
    },
    {
      reversed: true,
      avatar: G4,
      nickname: "G4",
      messages: [
        "I used to play the violin when I was younger. It's been a while though.",
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
