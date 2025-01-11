import React from "react";

const ReplyButton = () => {
  return (
    <button className="btn-icon chat__conversation-board__message__option-button option-item more-button reply">
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
  );
};

export default ReplyButton;
