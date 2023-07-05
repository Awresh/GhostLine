import React from "react";

const MessageContainer = ({
  avatar,
  nickname,
  message,
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
        {message && (
          <div className="chat__conversation-board__message__bubble">
            <span>{message}</span>
          </div>
        )}
        {messages &&
          messages.map((msg, index) => (
            <div
              className="chat__conversation-board__message__bubble"
              key={index}
            >
              <span>{msg}</span>
            </div>
          ))}
      </div>
      <div className="chat__conversation-board__message__options">
        <button className="btn-icon chat__conversation-board__message__option-button option-item emoji-button">
          {/* Emoji button icon */}
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
        <button className="btn-icon chat__conversation-board__message__option-button option-item more-button">
          {/* More button icon */}
          <svg
            className="feather feather-more-horizontal sc-dnqmqq jxshSx"
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
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageContainer;
