import React, { useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Carousel, SearchBar } from "@giphy/react-components";

export const GifPicker = ({ onSelect }) => {
    const apiKey = "C6mXn63e82ubxGpGJEgLdFFHmfck0VTZ"; // Replace with your Giphy API key
    const giphyFetch = new GiphyFetch(apiKey);

    const [gifs, setGifs] = useState([]);
    const [selectedGif, setSelectedGif] = useState(null);

    const handleGifSearch = async (searchTerm) => {
        try {
            const { data } = await giphyFetch.search(searchTerm, { limit: 5 });
            const gifData = data.map((gif) => ({
                url: gif.images.original.url,
                width: gif.images.original.width,
                height: gif.images.original.height,
            }));
            setGifs(gifData);
        } catch (error) {
            console.error("Error fetching GIFs:", error);
            setGifs([]);
        }
    };

    const handleSelectGif = (gif) => {
        setSelectedGif(gif);
        onSelect(gif);
    };

    return (
        <div>
            <SearchBar
                apiKey={apiKey} // Pass the API key directly
                onSearch={(searchTerm) => handleGifSearch(searchTerm)}
            />
            <Carousel gifFetcher={giphyFetch} gifs={gifs} onGifClick={handleSelectGif} />
            {selectedGif && (
                <div>
                    <h4>Selected GIF:</h4>
                    <img src={selectedGif.url} alt="Selected GIF" />
                </div>
            )}
        </div>
    );
};
