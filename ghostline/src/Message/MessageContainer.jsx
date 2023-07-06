import React from "react";
import ReactionButton from "./ReactionButton";
import ReplyButton from "./ReplyButton";

const MessageContainer = ({
  avatar,
  nickname,
  message,
  messages,
  reversed,
  time,
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
        {message && (
          <div className="chat__conversation-board__message__bubble">
            <span>{message}</span>
            <p>{time}</p>
            <div className="chat__conversation-board__message__options">
              <ReactionButton />
              <ReplyButton />
            </div>
          </div>
        )}
        {messages &&
          messages.map((msg, index) => (
            <div
              className="chat__conversation-board__message__bubble"
              key={index}
            >
              <p>
                <span style={{fontSize:'7px'}}>
                  {time}
                </span>
                {msg}
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
