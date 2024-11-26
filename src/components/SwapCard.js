import React, { useState, useEffect } from "react";
import { FaEthereum, FaBitcoin, FaDollarSign } from "react-icons/fa";
import { SiBinance, SiSolana } from "react-icons/si";
import AcedTicker from "../assets/aced-ticker.png";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import axios from "axios";

// SOLANA MAINNET ENDPOINT
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
console.log("Connection = ", connection);

const SwapCard = () => {
  const [loading, setLoading] = useState(true);
  const [rotated, setRotated] = useState(false);
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("AceD");
  const [availableTokens, setAvailableTokens] = useState([]); // Available tokens for swapping
  const [fromAmount, setFromAmount] = useState(""); // User input for the from token amount
  const [error, setError] = useState(""); // Error message for user
  const [solBalance, setSolBalance] = useState("0.00"); // Store Solana balance

  // Static example of tokens (for initial display)
  const allTokens = [
    { label: "ETH", icon: <FaEthereum />, balance: "2,345.67", address: "ETH_Address" },
    { label: "BTC", icon: <FaBitcoin />, balance: "1.23", address: "BTC_Address" },
    { label: "USDT", icon: <FaDollarSign />, balance: "10,000", address: "USDT_Address" },
    { label: "USDC", icon: <FaDollarSign />, balance: "9,000", address: "USDC_Address" },
    { label: "BNB", icon: <SiBinance />, balance: "45", address: "BNB_Address" },
    { label: "SOL", icon: <SiSolana />, balance: solBalance, address: "SOL_Address" }, // Use the dynamic Solana balance
    { label: "AceD", icon: <img className="aced-ticker" src={AcedTicker} />, balance: "150,000", address: "AceD_Address" },
  ];

  useEffect(() => {
    console.log("Available tokens for dropdown:", availableTokens[0]);
  }, [availableTokens]);

  useEffect(() => {
    // Fetch Solana balance on component mount or when fromToken changes
    if (fromToken === "SOL") {
      fetchSolanaBalance();
    }
  }, [fromToken]);

  // Fetch available tokens from the backend (like Raydium API)
  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/raydium-pairs");
        const tokens = response.data.map(pair => ({
          name: pair.name.split('/')[0], // Extract the first token's name (e.g., 'HappyMusk')
          address: pair.amm_id, // Use 'amm_id' as the unique address
        }));
        console.log("Transformed tokens:", tokens); // Debugging: Check the transformed data
        // Set tokens and stop loading
        setAvailableTokens(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch tokens.");
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);


  // Fetch Solana balance for the wallet (simplified to fetch SOL balance)
  const fetchSolanaBalance = async () => {
    if (window.solana && window.solana.publicKey) {
      try {
        const publicKey = window.solana.publicKey.toString();
        const balance = await connection.getBalance(new PublicKey(publicKey));
        const solBalance = balance / 1000000000; // Convert lamports to SOL
        setSolBalance(solBalance.toFixed(2)); // Set balance with 2 decimal places
        setFromAmount(solBalance.toFixed(2)); // Set the amount to the available balance
      } catch (error) {
        console.error("Error fetching Solana balance:", error);
        setSolBalance("0.00");
      }
    }
  };

  // Handle token change (from / to)
  const handleTokenChange = (tokenType, value) => {
    if (tokenType === "from") {
      setFromToken(value);
    } else {
      setToToken(value);
    }
  };

  const handleSwapArrowClick = () => {
    setRotated(!rotated);
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSwap = async () => {
    if (!fromAmount || isNaN(fromAmount) || fromAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!toToken) {
      setError("Please select a valid token to swap.");
      return;
    }

    try {
      // Perform token swap
      const swapTransaction = await swapTokens(fromAmount, toToken);
      alert('Swap successful! Transaction hash: ' + swapTransaction);
    } catch (err) {
      console.error(err);
      setError('Swap failed. Please try again.');
    }
  };

  const swapTokens = async (amount, toTokenAddress) => {
    const fromAmount = parseFloat(amount); // Amount of SOL
    const fromToken = new PublicKey("So11111111111111111111111111111111111111112"); // SOL address
    const toToken = new PublicKey(toTokenAddress);  // Replace with the actual token address
    const walletPublicKey = new PublicKey(window.solana.publicKey.toString());  // Phantom wallet

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: toToken,
        lamports: fromAmount * 1000000000, // Convert SOL to lamports
      })
    );

    const signature = await window.solana.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature);

    return signature; // Return the transaction signature
  };

  const handleTokenSelect = (selectedToken) => {
    setToToken(selectedToken); // Set the selected token name or identifier
  };

  if (loading) {
    return <div>Loading tokens...</div>;
  }

  return (
    <div className="neo-card p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Swap Tokens</h2>
      </div>

      {/* From Token */}
      <div className={`glass-panel p-4 mb-2 ${rotated ? "order-last" : "order-first"}`}>
        <TokenInput
          label="From"
          balance={allTokens.find((t) => t.label === fromToken)?.balance}
          token={fromToken}
          tokens={[]}  // No other tokens available for "From" input
          fromAmount={fromAmount} // Pass fromAmount as a prop
          setFromAmount={setFromAmount} // Pass setFromAmount as a prop
          onChange={(value) => handleTokenChange("from", value)}
        />
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div
          className="swap-arrow"
          onClick={handleSwapArrowClick}
          style={{ transform: rotated ? "rotate(180deg)" : "rotate(0)" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>

      {/* To Token */}
      <div className={`glass-panel p-4 mt-2 ${rotated ? "order-first" : "order-last"}`}>
        <TokenInput
          label="To"
          balance={allTokens.find((t) => t.label === toToken)?.balance}
          token={toToken}
          tokens={availableTokens}  // Dynamically pass availableTokens
          onChange={(value) => handleTokenChange("to", value)}
        />


      </div>

      <button
        onClick={handleSwap}
        className="bg-blue-600 mt-4 hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 w-full"
      >
        Swap Now
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
};

const TokenInput = ({ label, balance, token, fromAmount, setFromAmount, tokens, onChange }) => {
  console.log("Tokens passed to TokenInput:", tokens);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    console.log(tokens.length)
    if (tokens.length > 0) {
      setDropdownOpen(!dropdownOpen);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-blue-400">{label}</span>
        <span className="text-sm">Balance: {balance}</span>
      </div>
      <div className="flex space-x-4 relative">
        <input
          type="text"
          value={fromAmount}
          placeholder="0.0"
          className="input-field flex-grow"
          onChange={(e) => setFromAmount(e.target.value)}
        />
        <div className="relative">
          <button
            className="token-select flex items-center gap-2"
            onClick={handleDropdownToggle}
          >
            <span>{token}</span> {/* Display the selected token */}
            <svg
              className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>


          {dropdownOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
              {tokens.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No tokens available</div>
              ) : (
                tokens.map((token, index) => (
                  <div
                    key={token.amm_id || index} // Use amm_id for the unique key
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      onChange(token.name); // Update the selected token
                      setDropdownOpen(false); // Close the dropdown
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{token.name}</span> {/* Show token name */}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}




        </div>
      </div>
    </div>
  );
};


export default SwapCard;
