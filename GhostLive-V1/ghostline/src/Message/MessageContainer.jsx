import React from "react";
import ReactionButton from "./ReactionButton";
import ReplyButton from "./ReplyButton";

const MessageContainer = ({
  avatar,
  nickname,
  messages,
  reversed,
}) => {
  return (
    <div
      className={`chat__conversation-board__message-container ${
        reversed ? "reversed" : ""
      }`}
    >
      <div className="chat__conversation-board__message__person">
        <div className="chat__conversation-board__message__person__avatar">
          <img src={avatar} alt={nickname} />
        </div>
        <span className="chat__conversation-board__message__person__nickname">
          {nickname}
        </span>
      </div>
      <div className="chat__conversation-board__message__context">
        {messages &&
          messages.map((msg, index) => (
            <div
              className="chat__conversation-board__message__bubble"
              key={index}
            >
              <p>
                <span style={{fontSize:'7px'}}>
                  {msg.time}
                </span>
                {msg.message}
              </p>

              <div className="chat__conversation-board__message__options">
                <ReactionButton />
                <ReplyButton />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageContainer;
