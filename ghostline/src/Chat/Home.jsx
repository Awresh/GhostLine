import React, { useState } from 'react';
import './Home.css';
import { FaTimes } from 'react-icons/fa'; // Import cross icon from react-icons library

const Home = () => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <div className="container">
      <h1 style={{color:"#F2E626"}}>Ghost Tag</h1>
      <div className="tag-container">
        <div className="tag-input">
          <input
            type="text"
            placeholder="Enter a tag"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleAddTag}>Add</button>
        </div>
        <div className="tags">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              <span>{tag}</span>
              <FaTimes onClick={() => handleRemoveTag(tag)} className="remove-icon" />
            </div>
          ))}
        </div>
      </div>
      <button className="start-button">Start</button>
    </div>
  );
};

export default Home;
