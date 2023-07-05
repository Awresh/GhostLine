import React from "react";
import MessageContainer from "../Message/MessageContainer";
import ConversationPanel from "../Message/ConversationPanel";
import G1 from '../assets/G1.png'
import G2 from '../assets/G2.png'
import G3 from '../assets/G3.png'
import G4 from '../assets/G4.png'
import "./Chat.css";
const Chat = () => {
  return (
    <div className="--dark-theme" id="chat">
      {/* Chat conversation board */}
      <div className="chat__conversation-board">
        {/* Message container 1 */}
        <MessageContainer
        avatar={G1}
          nickname="G1"
          message="Somewhere stored deep, deep in my memory banks is the phrase 'It really whips the llama's ass'."
        />
        {/* Message container 2 */}
        <MessageContainer
          avatar={G3}
          nickname="G3"
          message="Think the guy that did the voice has a Twitter?"
        />
        {/* Message container 3 */}
        <MessageContainer
          avatar={G2}
          nickname="G2"
          messages={["WE MUST FIND HIM!!", "Wait ..."]}
        />
        {/* Message container 4 */}
        <MessageContainer
          reversed
          avatar={G4}
          nickname="G4"
          message="Winamp's still an essential."
        />
      </div>
      {/* Conversation panel */}
      <ConversationPanel />
    </div>
  );
};

export default Chat;
