import React, { useState } from 'react';
import axios from 'axios';

const NumberMerger = () => {
  const [urls, setUrls] = useState('');
  const [mergedNumbers, setMergedNumbers] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchNumbers = async () => {
    try {
      const urlArray = urls.split('&url=').map((url) => encodeURI(url));
      const requests = urlArray.map((url) => axios.get(url));

      const responses = await Promise.allSettled(requests);
      const validResponses = responses
        .filter((response) => response.status === 'fulfilled' && response.value.data.numbers)
        .map((response) => response.value.data.numbers)
        .flat();

      const uniqueNumbers = [...new Set(validResponses)].sort((a, b) => a - b);
      setMergedNumbers(uniqueNumbers);
      setError(null);
    } catch (err) {
      setError('An error occurred while fetching and merging numbers.');
      setMergedNumbers([]);
    }
  };

  return (
    <div>
      <h1>Number Management Service</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter URLs separated by &url="
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      ></textarea>
      <button onClick={handleFetchNumbers}>Fetch and Merge Numbers</button>
      {error && <p>{error}</p>}
      <div>
        <h2>Merged Unique Integers (Ascending Order)</h2>
        <ul>
          {mergedNumbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NumberMerger;
