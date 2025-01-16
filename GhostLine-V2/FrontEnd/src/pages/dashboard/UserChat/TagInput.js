import React, { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
    Button,
    Input,
    FormGroup,
    Label,
} from "reactstrap";
import ForumIcon from '@mui/icons-material/Forum';
import "./TagInput.css";

const TagInput = ({intrsHandler}) => {
    const [selected, setSelected] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [nearestMatching, setNearestMatching] = useState(false);
    const [waitingTime, setWaitingTime] = useState(5);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);

    const hintInterests = ["TikTok", "YouTube", "Instagram", "Sports", "Dance", "Gaming"];
console.log("intres",selected)
    useEffect(() => {
        if (selected.length === 0) {
            const interval = setInterval(() => {
                setCurrentHintIndex((prevIndex) => (prevIndex + 1) % hintInterests.length);
            }, 2000); // Change hint every 2 seconds
            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [selected]);

    const handleKeyDown = (event) => {
        if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            const trimmedValue = inputValue.trim();
            if (trimmedValue && !selected.includes(trimmedValue)) {
                const capitalizedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);
                setSelected((prev) => [...prev, capitalizedValue]);
                setInputValue("");
            }
        }
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleRemoveTag = (tagToRemove) => {
        setSelected((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    const toggleNearestMatching = () => {
        setNearestMatching((prev) => !prev);
    };

    const handleWaitingTimeChange = (time) => {
        setWaitingTime(time);
    };

    return (
        <div className="tag-input-container">
            <h1 className="tag-input-header">Your Interest</h1>
            <div className="tag-input-box">
                {selected.map((tag, index) => (
                    <span key={index} className="tag-chip">
                        <span>{tag}</span>
                        <button
                            onClick={() => handleRemoveTag(tag)}
                            className="tag-remove-button"
                        >
                            &times;
                        </button>
                    </span>
                ))}
                {selected.length === 0 && (
                    <div className="tag-hints">
                        <span key={currentHintIndex} className="tag-chip hint-chip">
                            {hintInterests[currentHintIndex]}
                        </span>
                    </div>
                )}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your interest"
                    className="tag-input-field"
                />
            </div>
            <em className="tag-input-instruction">
                Press space or enter to add a new tag.
            </em>
            <div className="tag-input-controls">
                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            checked={nearestMatching}
                            onChange={toggleNearestMatching}
                        />
                        Enable Nearest Matching
                    </Label>
                </FormGroup>
                <UncontrolledDropdown>
                    <DropdownToggle caret color="primary">
                        Waiting Time: {waitingTime === 999 ? "Forever" : `${waitingTime}s`}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleWaitingTimeChange(5)}>5s</DropdownItem>
                        <DropdownItem onClick={() => handleWaitingTimeChange(10)}>10s</DropdownItem>
                        <DropdownItem onClick={() => handleWaitingTimeChange(30)}>30s</DropdownItem>
                        <DropdownItem onClick={() => handleWaitingTimeChange(999)}>Forever</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                <Button color="primary" className="start-chat-button" onClick={()=>intrsHandler(selected)}>
                    <ForumIcon /> Start Chat
                </Button>
            </div>
        </div>
    );
};

export default TagInput;
