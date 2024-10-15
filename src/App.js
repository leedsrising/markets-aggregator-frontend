import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    fetchMarkets();
    // Refresh markets every 5 minutes
    const interval = setInterval(fetchMarkets, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarkets = async () => {
    try {
      const response = await axios.get('https://markets-aggregator-backend.onrender.com/api/markets');
      if (response.data && Array.isArray(response.data.markets)) {
        setMarkets(response.data.markets);
      } else {
        console.error('Unexpected data structure:', response.data);
        setMarkets([]);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
      setMarkets([]);
    }
  };

  return (
    <div className="App">
      <h1>Prediction Market Comparison</h1>
      {markets && markets.length > 0 ? (
        <div className="market-container">
          {markets.map((marketPair, index) => (
            <div key={index} className="market-item">
              <div className="market-side">
                <h2>Kalshi</h2>
                <p><strong>{marketPair.kalshi.description}</strong></p>
                <p>Yes Price: {marketPair.kalshi.yes_contract.price}</p>
                <p>No Price: {marketPair.kalshi.no_contract.price}</p>
              </div>
              <div className="market-side">
                <h2>Polymarket</h2>
                <p><strong>{marketPair.polymarket.question}</strong></p>
                <p>Yes Price: {marketPair.polymarket.prices['0']}</p>
                <p>No Price: {marketPair.polymarket.prices['1']}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No markets available. Please try again later.</p>
      )}
    </div>
  );
}

export default App;
