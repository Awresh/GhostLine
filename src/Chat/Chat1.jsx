import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import MessageContainer from "../Message/MessageContainer";
import { FaTimes } from "react-icons/fa";
import { RiShareFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import "./Home.css";
import "./Chat.css";
import isTypingIconDark from "../assets/typingLight1.gif";
import isTypingIconLight from "../assets/typingDark1.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const socket = socketIOClient("https://test-k2nu.onrender.com");

const Chat1 = () => {
  const [roomID, setRoomID] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [interests, setInterests] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [Connecting, setConnecting] = useState(false);
  const [heading, setHeading] = useState("Welcome to ghost Line 👻");
  const [typingStatus, setTypingStatus] = useState(false);
  const [room, setRoom] = useState({});

  const [matchedInterests, setMatchedInterests] = useState([
    "Connecting to Ghost 👻",
  ]);
  const [buttonText, setButtonText] = useState("Stop");
  const [buttonColor, setButtonColor] = useState("#0352c9");
  const avatars = {
    G1: "https://res.cloudinary.com/dlcn4rghm/image/upload/v1701324618/G5_rkgc4b.png",
    G2: "https://res.cloudinary.com/dlcn4rghm/image/upload/v1701078154/de83nkstflk829jphvnr.png",
    G3: "https://res.cloudinary.com/dlcn4rghm/image/upload/v1701078154/nzp5urrm0vvdicyaaamn.png",
    G4: "https://res.cloudinary.com/dlcn4rghm/image/upload/v1701324645/nosciphgrgtlmhvea1m5.png",
  };
  const [mounted, setMounted] = useState(false);
  const updateURL = () => {
    const newURL = `${window.location.origin}`;
    window.history.pushState({ path: newURL }, '', newURL);
  };
  
  const clearURL = () => {
    const newURL = `${window.location.origin}`;
    window.history.pushState({ path: newURL }, '', newURL);
  };
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomID = urlParams.get("roomID");
  
    if (queryRoomID && !mounted) {
      handleRoomAction(queryRoomID);
      setMounted(true);
      updateURL(queryRoomID); // Change the entire URL
    }
  
    // Check if roomID becomes null and clear the entire URL
    if (roomID === null) {
      clearURL();
    }
  }, [roomID, mounted]);
  

  useEffect(() => {
    // Retrieve interests from localStorage when the component mounts
    const storedInterests = localStorage.getItem("userInterests");
    if (storedInterests) {
      setInterests(JSON.parse(storedInterests));
    }
    socket.on("roomCreated", ({ roomID }) => {
      setRoomID(roomID);
      setIsJoined(true);
      console.log(roomID);
    });
    socket.on("roomJoined", ({ roomID, nickname }) => {
      console.log(roomID);
      setRoomID(roomID);
      setNickname(nickname);
      setIsJoined(true);
      console.log(roomID);
    });
    // Listening for "roomFull" event from the server
    socket.on("roomFull", () => {
      toast.info(`Room is full!`, { autoClose: 1000 });
    });
    socket.on("roomNotFound", () => {
      toast.info(`Room Not found!`, { autoClose: 1000 });
    });
    socket.on("chat message", (data) => {
      const { sender, message, timestamp } = data;

      // Check if the sender's nickname has an associated avatar
      const avatar = avatars[sender] || ""; // If sender's avatar is not found, default to an empty string
      console.log(avatar);
      const newMessage = {
        messages: [{ message: message, time: timestamp }],
        sender: sender,
        avatar: avatar, // Assign the avatar based on the sender's nickname
      };
      // Update chatLog state by adding the new message to the existing messages
      setChatLog((prevChatLog) => [...prevChatLog, newMessage]);
      console.log("New message received:", newMessage); // Log the received message
      vibrate(sender);
      setIsTyping(false);
    });
    socket.on("updateCurrentRoom", (room) => {
      setRoom(room);
      socket.emit("updateCurrentRoom", roomID);
    });
    // When receiving matched interests from the server
    socket.on("matchedInterests", (interest) => {
      // Update state to display all matched interests/tags
      setMatchedInterests(interest);
      console.log(interest);
      setConnecting(true);
    });
    socket.on("roomClosed", () => {
      //setChatLog([]);
      setMessage("");
      //setNickname("");
      //setIsJoined(false);
      //setConnecting(false);
      setMatchedInterests(["Ghost lost 😢"]);
      //setHeading("Ghost 👻 Lost Finde Again");
      setInputValue("");
      setRoomID("");
      setTypingStatus(false);
      setButtonText("Start");
      setButtonColor("green");
    });
    socket.on("participantLeft", (participantID) => {
      handleParticipantLeft(participantID.name);
      console.log(participantID);
      console.log("leftCheck");
    });
    socket.on("participantJoined", ({ nickname }) => {
      handleParticipantJoined(nickname);
      setTypingStatus(true);
      console.log(matchedInterests);
      if (matchedInterests[0] == "Connecting to Ghost 👻") {
        setMatchedInterests(["You are in ghost room!"]);
      }
      setConnecting(true);
    });
    socket.on("enableKeyboard", () => {
      setTypingStatus(true);
    });
    let typingTimeout;
    socket.on("typing", (data) => {
      const { typing } = data;
      console.log(typing);
      setIsTyping(typing);

      if (typing) {
        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    });
    return () => {
      // Clean up socket events when the component unmounts
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("chat message");
      socket.off("matchedInterests");
      socket.off("roomClosed");
      socket.off("participantLeft");
      socket.off("participantJoined");
      socket.off("typing");
      socket.off("roomNotFound");
      socket.off("roomFull");
      socket.off("enableKeyboard");
      socket.off("updateCurrentRoom");
    };
  }, [nickname, matchedInterests, roomID]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const chatBoard = document.querySelector(".chat__conversation-board");
    if (chatBoard) {
      // Scroll to the bottom of the chat board when chatLog updates
      chatBoard.scrollTop = chatBoard.scrollHeight;
    }
  }, [chatLog]);

  const handleToggleRoom = () => {
    if (buttonText === "Stop") {
      setButtonText("Sure");
      setButtonColor("red");
    } else if (buttonText === "Sure") {
      setButtonText("Start");
      setButtonColor("green");
      if (roomID) {
        console.log("stop:", roomID);
        socket.emit("stop", roomID); // Emit the 'stop' event with the roomID to the server
      }
      // Reset state after stopping the room
      setMessage("");
      setMatchedInterests(["Ghost lost 😢"]);
      setConnecting(true);
      setInputValue("");
      setRoomID("");
      setTypingStatus(false);
      const chatBoard = document.querySelector(".chat__conversation-board");
      if (chatBoard) {
        // Scroll to the bottom of the chat board when chatLog updates
        chatBoard.scrollTop = chatBoard.scrollHeight;
      }
    } else {
      setButtonText("Stop");
      setButtonColor("#0352c9");
      setConnecting(false);
      setMatchedInterests(["Connecting to Ghost 👻"]);
      setNickname("");
      setChatLog([]);
      handleSubmitInterests();
    }
  };
  const handleAddInterest = () => {
    if (inputValue.trim() !== "") {
      const formattedInterest =
        inputValue.trim().charAt(0).toUpperCase() +
        inputValue.trim().slice(1).toLowerCase();
      setInterests([...interests, formattedInterest]);
      // Save the updated interests array in localStorage
      localStorage.setItem(
        "userInterests",
        JSON.stringify([...interests, formattedInterest])
      );
      setInputValue(""); // Clear the inputValue after adding an interest
    }
  };
  const handleRemoveInterest = (interestToRemove) => {
    const updatedInterests = interests.filter(
      (interest) => interest !== interestToRemove
    );
    setInterests(updatedInterests);
    // Update the stored interests in localStorage
    localStorage.setItem("userInterests", JSON.stringify(updatedInterests));
  };
  const handleSubmitInterests = () => {
    // Remove empty strings and duplicates from interests array
    const filteredInterests = [
      ...new Set(interests.filter((interest) => interest.trim() !== "")),
    ];
    if (filteredInterests.length > 0) {
      setChatLog([]);
      socket.emit("submitInterest", filteredInterests);
      // Emit the filtered interests array to the server
      // setInterests([]); // Clear the interests array after submission
    } else {
      const RandomMatch = ["Random", "Match"];
      setChatLog([]);
      socket.emit("submitInterest", RandomMatch);
    }
  };
  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value);
  };
  const handleSendMessage = () => {
    if (message.trim() === "") {
      return; // Clear the message after sending
    }
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedTime = formattedHours + ":" + formattedMinutes + " " + ampm;
    socket.emit("chat message", {
      sender: nickname,
      message: message,
      timestamp: formattedTime,
      roomID: roomID,
    });
    // Clear the message input field after sending the message
    setMessage("");
  };
  const handleShareJoinLink = () => {
    if (!roomID) {
      return;
    }
    const joinLink = window.location.origin + "?roomID=" + roomID;

    if (navigator.share) {
      navigator
        .share({
          title: "Share Room Link",
          text: "Join this room",
          url: joinLink,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers/devices that do not support Web Share API
      const textField = document.createElement("textarea");
      textField.innerText = joinLink;

      document.body.appendChild(textField);
      textField.select();
      textField.setSelectionRange(0, 99999); /* For mobile devices */

      document.execCommand("copy");
      document.body.removeChild(textField);

      alert("Join link copied to clipboard!");
    }
  };

  const vibrate = (sender) => {
    if (navigator.vibrate && sender !== nickname) {
      console.log("vibrate:", sender, nickname);
      navigator.vibrate(150); // Vibrate for 200ms
    }
  };
  const handleParticipantLeft = (name) => {
    let num = "";
    if (name) {
      num = name[1];
    }
    if (nickname === name) {
      toast.info(`You left the room!`, { autoClose: 1000 });
    } else {
      toast.info(`Ghost ${num} left the room!`, { autoClose: 1000 });
    } // Set a flag reset timeout (adjust duration as needed)
  };
  const handleParticipantJoined = (name) => {
    console.log(name);
    if (name) {
      let num = name[1];
      toast.info(`Ghost ${num} joined the room!`, { autoClose: 1000 });
    } else {
      toast.info(`Ghost joined the room!`, { autoClose: 1000 });
    }
  };
  const handleRoomAction = (customRoomID) => {
    const trimmedRoomID = customRoomID && customRoomID.trim();
    setChatLog([]);
    if (trimmedRoomID && trimmedRoomID !== "") {
      console.log(trimmedRoomID);
      socket.emit("joinRoom", trimmedRoomID);
      setMatchedInterests(["You are in ghost room"]);
      setConnecting(true);
    } else {
      socket.emit("createRoom");
      setMatchedInterests(["You are in ghost room"]);
      setConnecting(true);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && message.trim() !== "") {
      event.preventDefault();
      handleSendMessage();
    }
  };
  const onChengHendel = (e) => {
    socket.emit("typing", { typing: true, roomID });
    setMessage(e.target.value);
    setButtonText("Stop");
    setButtonColor("#0352c9");
  };
  const commingSoon = () => {
    toast.info(`Comming Soon`, { autoClose: 1000 });
  };
  const resetState = () => {
    setRoomID("");
    setMessage("");
    setChatLog([]);
    setIsJoined(false);
    setIsTyping(false);
    setNickname("");
    setIsMobile(false);
    setInterests([]);
    setInputValue("");
    setConnecting(false);
    setHeading("Welcome to ghost Line 👻");
    setTypingStatus(false);
    setRoom({});
    setMatchedInterests(["Connecting to Ghost 👻"]);
    setButtonText("Stop");
    setButtonColor("#0352c9");
  };
  const handleHomeClick = () => {
    if (!roomID) {
      // Call the function to reset the state to default values
      resetState();
    } else {
      toast.error("Cannot Exit while in a room!"); // Display error notification
    }
  };

  return (
    <div>
      {isJoined && (
        <div
          style={{
            backgroundColor: "var(--chat-panel-background)",
            maxWidth: "600px",
            margin: "auto",
            padding: "5px",
            borderRadius: "0 0px 10px 10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            position: "sticky",
            zIndex: "1",
          }}
        >
          <div
            onClick={handleShareJoinLink}
            className="navText"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Room ID: {roomID}{" "}
            <RiShareFill
              style={{ cursor: "pointer", color: "#0352c9", marginLeft: "5px" }}
            />
          </div>
          <FaHome
            onClick={handleHomeClick}
            style={{ cursor: "pointer", color: "#0352c9" }}
          />
        </div>
      )}

      <ToastContainer />
      {!isJoined && (
        <div
          className="SectionTag"
          style={{
            backgroundColor: "rgb(255 255 255 / 89%)",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: "20px" }}>{heading}</h2>
            <h3>Add Interests</h3>
            <div className="tag-container">
              <div className="tag-input">
                <input
                  type="text"
                  placeholder="Enter an interest (Optional)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleAddInterest}>Add</button>
              </div>
              <div className="tags">
                {interests.map((interest, index) => (
                  <div key={index} className="tag">
                    <span>{interest}</span>
                    <FaTimes
                      onClick={() => handleRemoveInterest(interest)}
                      className="remove-icon"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                style={{ color: "#fff", marginBottom: "15px", width: "100%" }}
                onClick={handleSubmitInterests}
                className="start-button"
              >
                Start chat 👻
              </button>
              {/* <button
                style={{ color: "#fff", marginBottom: "15px", width: "45%" }}
                onClick={commingSoon}
                className="start-button"
              >
                Start video chat 👻
              </button> */}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomID}
              onChange={handleRoomIDChange}
              //onFocus={handleKeyboardOpen}
              style={{
                marginBottom: "10px",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                width: "100%",
              }}
            />
            <button
              onClick={() => handleRoomAction(roomID)}
              className="start-button"
              style={{
                padding: "10px 16px",
                color: "#fff",
                width: "100%",
              }}
            >
              {roomID !== "" ? "Join Ghost 👻 Room" : "Create Ghost 👻 Room"}
            </button>
          </div>
        </div>
      )}
      {isJoined && (
        <div id="chat">
          <div className="chat__conversation-board">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* {isJoined && (<h3> Matched Interests:</h3>)} */}
                <p
                  className="matchedInterests"
                  style={{
                    marginLeft: "5px",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {matchedInterests.join(". ")}
                </p>
              </div>
              {!Connecting && (
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </div>
            {chatLog &&
              chatLog.map((message, index) => (
                <MessageContainer
                  key={index}
                  avatar={message.avatar}
                  nickname={message.sender}
                  messages={message.messages} // Access `message.messages` directly
                  reversed={message.sender == nickname} // Set reversed based on nickname match
                />
              ))}
            {Connecting &&
              chatLog.length > 12 &&
              matchedInterests.includes("Ghost lost 😢") && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p
                    className="matchedInterests"
                    style={{ marginLeft: "5px", textAlign: "center" }}
                  >
                    {matchedInterests.join(". ")}
                  </p>
                </div>
              )}
          </div>
          <div
            className={`isTypingIconsContainer ${isTyping ? "visible" : ""}`}
          >
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
                style={{
                  padding: "8px 16px",
                  backgroundColor: buttonColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
                onClick={handleToggleRoom}
              >
                {buttonText}
              </button>
              <input
                className="chat__conversation-panel__input panel-item"
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                onChange={onChengHendel}
                value={message}
                disabled={!typingStatus}
              />
              <button
                className="chat__conversation-panel__button panel-item btn-icon send-message-button"
                onClick={handleSendMessage}
                disabled={!typingStatus}
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
      )}
    </div>
  );
};

export default Chat1;
