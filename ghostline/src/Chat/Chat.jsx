import React from "react";
import MessageContainer from "../Message/MessageContainer";
import ConversationPanel from "../Message/ConversationPanel";
import "./Chat.css";
const Chat = () => {
  return (
    <div className="--dark-theme" id="chat">
      {/* Chat conversation board */}
      <div className="chat__conversation-board">
        {/* Message container 1 */}
        <MessageContainer
          avatar="https://randomuser.me/api/portraits/women/44.jpg"
          nickname="Monika Figi"
          message="Somewhere stored deep, deep in my memory banks is the phrase 'It really whips the llama's ass'."
        />
        {/* Message container 2 */}
        <MessageContainer
          avatar="https://randomuser.me/api/portraits/men/32.jpg"
          nickname="Thomas Rogh"
          message="Think the guy that did the voice has a Twitter?"
        />
        {/* Message container 3 */}
        <MessageContainer
          avatar="https://randomuser.me/api/portraits/women/44.jpg"
          nickname="Monika Figi"
          messages={["WE MUST FIND HIM!!", "Wait ..."]}
        />
        {/* Message container 4 */}
        <MessageContainer
          reversed
          avatar="https://randomuser.me/api/portraits/men/9.jpg"
          nickname="Dennis Mikle"
          message="Winamp's still an essential."
        />
      </div>
      {/* Conversation panel */}
      <ConversationPanel />
    </div>
  );
};

export default Chat;
