import React, { useState, useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter, Input } from "reactstrap";
import { connect } from "react-redux";
import SimpleBar from "simplebar-react";
import { io } from "socket.io-client";
import withRouter from "../../../components/withRouter";
import { nanoid } from 'nanoid'
//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";

//actions
import { openUserSidebar, setFullUser } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';
const socket = io("http://ghostline.webperfection.in:8081");

let userID = localStorage.getItem("userID");

if (!userID) {
    userID = nanoid(5);
    localStorage.setItem("userID", userID);
}

function UserChat(props) {

    const ref = useRef();
    const [intres, setIntrest] = useState("")
    const [modal, setModal] = useState(false);
    const [matchUSer, setMatchUser] = useState(false)
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    //demo conversation messages
    //userType must be required  { id: 1, message: "hi", time: "01:05", userType: "receiver", isImageMessage : false, isFileMessage : false }
    const [allUsers] = useState(props.recentChatList);
    const [chatMessages, setchatMessages] = useState([]);
    useEffect(() => {
        // ('submitInterest', (userId, roomid, interests)
        socket.emit("identify", userID)
        console.log("socket", socket)
    }, [])
    // useEffect(() => {
    //     setchatMessages(props.recentChatList[props.active_user].messages);
    //     ref.current.recalculate();
    //     if (ref.current.el) {
    //         ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
    //     }
    // }, [props.active_user, props.recentChatList]);

    useEffect(() => {
        const handleMatchedInterests = (data) => {
            console.log(`Private message from ${data.roomId}`);
            setMatchUser(data.roomId)
        };

        socket.on("matchedInterests", handleMatchedInterests);

        // Cleanup function to remove the listener
        return () => {
            socket.off("matchedInterests", handleMatchedInterests);
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        const handleMatchedInterests = (data) => {
            let d = new Date();
            let seconds = d.getSeconds();
            const messageObj = {
                id: chatMessages.length + 1,
                message: data.message,
                time: `00:${seconds}`,
                userType: "receiver",
                image: avatar1,
                isFileMessage: false,
                isImageMessage: false
            };
    
            // Use functional update to ensure latest state is used
            setchatMessages((prevMessages) => [...prevMessages, messageObj]);
    
            console.log(`Private message from ${data.message}`, messageObj);
        };
    
        socket.on("private_message", handleMatchedInterests);
    
        // Cleanup function to remove the listener
        return () => {
            socket.off("private_message", handleMatchedInterests);
            socket.disconnect();
        };
    }, [avatar1, socket]); // Include dependencies like `avatar1` and `socket`
    
    
    const toggle = () => setModal(!modal);
    console.log("matchUser", matchUSer)
    const addMessage = (message, type) => {
        var messageObj = null;

        let d = new Date();
        var n = d.getSeconds();
        messageObj = {
            id: chatMessages.length + 1,
            message: message,
            time: "00:" + n,
            userType: "sender",
            image: avatar4,
            isFileMessage: false,
            isImageMessage: false
        }
        setchatMessages((prevMessages) => [...prevMessages, messageObj]);
        console.log("massage",chatMessages)
        socket.emit("private_message",matchUSer,message)
        //matches the message type is text, file or image, and create object according to it
        // switch (type) {
        //     case "textMessage":
        //         messageObj = {
        //             id: chatMessages.length + 1,
        //             message: message,
        //             time: "00:" + n,
        //             userType: "sender",
        //             image: avatar4,
        //             isFileMessage: false,
        //             isImageMessage: false
        //         }
        //         break;

        //     case "fileMessage":
        //         messageObj = {
        //             id: chatMessages.length + 1,
        //             message: 'file',
        //             fileMessage: message.name,
        //             size: message.size,
        //             time: "00:" + n,
        //             userType: "sender",
        //             image: avatar4,
        //             isFileMessage: true,
        //             isImageMessage: false
        //         }
        //         break;

        //     case "imageMessage":
        //         var imageMessage = [
        //             { image: message },
        //         ]

        //         messageObj = {
        //             id: chatMessages.length + 1,
        //             message: 'image',
        //             imageMessage: imageMessage,
        //             size: message.size,
        //             time: "00:" + n,
        //             userType: "sender",
        //             image: avatar4,
        //             isImageMessage: true,
        //             isFileMessage: false
        //         }
        //         break;

        //     default:
        //         break;
        // }

        //add message object to chat        
        

        // let copyallUsers = [...allUsers];
        // copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
        // copyallUsers[props.active_user].isTyping = false;
        // props.setFullUser(copyallUsers);

        scrolltoBottom();
    }
    const handleChange = (e) => {
        setIntrest(e.target.value)
        console.log(e.target.value)
    }
    const submitInt = () => {
        console.log("emi")
        const emi = socket.emit("submitInterest", userID, "", [intres])
        console.log(emi)
    }
    function scrolltoBottom() {
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        var filtered = conversation.filter(function (item) {
            return item.id !== id;
        });

        setchatMessages(filtered);
    }


    return (
        <React.Fragment>
            <div className="user-chat w-100">

                <div className="d-lg-flex">

                    <div className={props.userSidebar ? "w-70" : "w-100"}>

                        {/* render user head */}
                        {matchUSer && <UserHead />}

                        <SimpleBar
                            style={{ maxHeight: "100%" }}
                            ref={ref}
                            className="chat-conversation p-3 p-lg-4"
                            id="messages">



                            {matchUSer ? <ul className="list-unstyled mb-0">


                                {
                                    chatMessages.map((chat, key) =>
                                        chat.isToday && chat.isToday === true ? <li key={"dayTitle" + key}>
                                            <div className="chat-day-title">
                                                <span className="title">Today</span>
                                            </div>
                                        </li> :
                                            (props.recentChatList[props.active_user].isGroup === true) ?
                                                <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                    <div className="conversation-list">

                                                        <div className="chat-avatar">
                                                            {chat.userType === "sender" ? <img src={avatar1} alt="chatvia" /> :
                                                                props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                    <div className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {chat.userName && chat.userName.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    : <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                            }
                                                        </div>

                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                <div className="ctext-wrap-content">
                                                                    {
                                                                        chat.message &&
                                                                        <p className="mb-0">
                                                                            {chat.message} ashiq
                                                                        </p>
                                                                    }
                                                                    {
                                                                        chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                    }
                                                                    {
                                                                        chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} />
                                                                    }
                                                                    {
                                                                        chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </p>
                                                                    }
                                                                    {
                                                                        !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                    }
                                                                </div>
                                                                {
                                                                    !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                }

                                                            </div>
                                                            {
                                                                <div className="conversation-name">{chat.userType === "sender" ? "Patricia Smith" : chat.userName}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </li>
                                                :
                                                <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                    <div className="conversation-list">
                                                        {
                                                            //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                            chatMessages[key + 1] ? chatMessages[key].userType === chatMessages[key + 1].userType ?

                                                                <div className="chat-avatar">
                                                                    <div className="blank-div"></div>
                                                                </div>
                                                                :
                                                                <div className="chat-avatar">
                                                                    {chat.userType === "sender" ? <img src={avatar1} alt="chatvia" /> :
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                            <div className="chat-user-img align-self-center me-3">
                                                                                <div className="avatar-xs">
                                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                        {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            : <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                                    }
                                                                </div>
                                                                : <div className="chat-avatar">
                                                                    {chat.userType === "sender" ? <img src={avatar1} alt="chatvia" /> :
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                            <div className="chat-user-img align-self-center me-3">
                                                                                <div className="avatar-xs">
                                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                        {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            : <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                                    }
                                                                </div>
                                                        }


                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                <div className="ctext-wrap-content">
                                                                    {
                                                                        chat.message &&
                                                                        <p className="mb-0">
                                                                            {chat.message}
                                                                        </p>
                                                                    }
                                                                    {
                                                                        chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                    }
                                                                    {
                                                                        chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} />
                                                                    }
                                                                    {
                                                                        chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </p>
                                                                    }
                                                                    {
                                                                        !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                    }
                                                                </div>
                                                                {
                                                                    !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                }

                                                            </div>
                                                            {
                                                                chatMessages[key + 1] ?
                                                                    chatMessages[key].userType === chatMessages[key + 1].userType ? null :

                                                                        <div className="conversation-name">{chat.userType === "sender" ?

                                                                            "Patricia Smith" : props.recentChatList[props.active_user].name}</div> :

                                                                    <div className="conversation-name">{chat.userType === "sender" ?

                                                                        "Admin" : props.recentChatList[props.active_user].name}</div>
                                                            }

                                                        </div>
                                                    </div>
                                                </li>
                                    )
                                }
                            </ul> : <div>
                                <Input type="text" value={intres} onChange={handleChange} className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." />
                                <Button onClick={submitInt}>Submit Intrest</Button>
                            </div>}
                        </SimpleBar>

                        <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                            <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                            <ModalBody>
                                <CardBody className="p-2">
                                    <SimpleBar style={{ maxHeight: "200px" }}>
                                        <SelectContact handleCheck={() => { }} />
                                    </SimpleBar>
                                    <ModalFooter className="border-0">
                                        <Button color="primary">Forward</Button>
                                    </ModalFooter>
                                </CardBody>
                            </ModalBody>
                        </Modal>

                        {matchUSer && <ChatInput onaddMessage={addMessage} />}
                    </div>

                    <UserProfileSidebar activeUser={props.recentChatList[props.active_user]} />

                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user, userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, setFullUser })(UserChat));

