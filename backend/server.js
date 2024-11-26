const express = require('express');
const cors = require('cors');
const axios = require("axios");

const app = express();
app.use(cors()); // Allow all origins by default

// In-memory cache
let cachedData = null; // Store API response
let lastFetchTime = null; // Track the last fetch time
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes (in milliseconds)

app.get('/raydium-pairs', async (req, res) => {
  try {
    const now = Date.now();

    // If cached data exists and is still valid, return it
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Serving from cache');
      return res.json(cachedData);
    }

    // Otherwise, fetch new data
    console.log('Fetching new data');
    const response = await axios.get("https://api.raydium.io/pairs");
    const tokenPairs = response.data;
    console.log(tokenPairs[0])

    // Filter pairs where the base token is WSOL
    const solPairs = tokenPairs.filter(pair => {
      const [base, quote] = pair.name.split('/');
      return base === "WSOL" || quote === "WSOL"; // Include pairs where WSOL is either the base or quote
    });

    // Update the cache
    cachedData = solPairs;
    lastFetchTime = now;

    res.json(solPairs);
  } catch (error) {
    console.error('Error fetching Raydium pairs:', error.message);
    res.status(500).send('Failed to fetch data');
  }
});

app.listen(5001, () => {
  console.log('Proxy server running on http://localhost:5001');
});
