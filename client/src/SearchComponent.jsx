import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Get user's geolocation
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);

  // Debounced search function
  const fetchSuggestions = _.debounce(async (searchText) => {
    if (!searchText || !location.lat) return;

    try {
      const res = await axios.get('http://localhost:3000/search', {
        params: {
          food: searchText,
          lat: location.lat,
          lng: location.lng
        }
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, 300); // Debounce delay: 300ms

  // Trigger search on input change
  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Find Food Near You 🍽️</h2>
      <input
        type="text"
        placeholder="Type a food item..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />

      <ul style={{ marginTop: '20px' }}>
        {suggestions.map((stall) => (
          <li key={stall._id}>
            <strong>{stall.name}</strong> – Offers: {stall.food_items.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
