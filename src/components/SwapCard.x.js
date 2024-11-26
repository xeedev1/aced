import React, { useState, useEffect } from "react";
import { FaEthereum, FaBitcoin, FaDollarSign } from "react-icons/fa";
import { SiBinance, SiSolana } from "react-icons/si";
import AcedTicker from "../assets/aced-ticker.png";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";

// SOLANA MAINNET ENDPOINT
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

const SwapCard = () => {
    const [loading, setLoading] = useState(true);
    const [rotated, setRotated] = useState(false);
    const [fromToken, setFromToken] = useState("SOL");
    const [toToken, setToToken] = useState("AceD");
    const [availableTokens, setAvailableTokens] = useState([]); // Available tokens for swapping
    const [fromAmount, setFromAmount] = useState(""); // User input for the from token amount
    const [error, setError] = useState(""); // Error message for user
    const [solBalance, setSolBalance] = useState("0.00"); // Store Solana balance
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state

    const allTokens = [
        { label: "ETH", icon: <FaEthereum />, balance: "2,345.67", address: "ETH_Address" },
        { label: "BTC", icon: <FaBitcoin />, balance: "1.23", address: "BTC_Address" },
        { label: "USDT", icon: <FaDollarSign />, balance: "10,000", address: "USDT_Address" },
        { label: "USDC", icon: <FaDollarSign />, balance: "9,000", address: "USDC_Address" },
        { label: "BNB", icon: <SiBinance />, balance: "45", address: "BNB_Address" },
        { label: "SOL", icon: <SiSolana />, balance: solBalance, address: "SOL_Address" },
        { label: "AceD", icon: <img className="aced-ticker" src={AcedTicker} />, balance: "150,000", address: "AceD_Address" },
    ];

    useEffect(() => {
        // Fetch Solana balance on component mount or when fromToken changes
        if (fromToken === "SOL") {
            fetchSolanaBalance();
        }
    }, [fromToken]);

    useEffect(() => {
        // Fetch available tokens from the backend
        const fetchTokens = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5001/raydium-pairs");
                const tokens = response.data.map((pair) => ({
                    name: pair.name.split('/')[0],
                    address: pair.amm_id,
                }));
                setAvailableTokens(tokens);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch tokens.");
                setLoading(false);
            }
        };
        fetchTokens();
    }, []);

    const fetchSolanaBalance = async () => {
        if (window.solana && window.solana.publicKey) {
            try {
                const publicKey = window.solana.publicKey.toString();
                const balance = await connection.getBalance(new PublicKey(publicKey));
                const solBalance = balance / 1000000000;
                setSolBalance(solBalance.toFixed(2));
                setFromAmount(solBalance.toFixed(2));
            } catch (error) {
                console.error("Error fetching Solana balance:", error);
                setSolBalance("0.00");
            }
        }
    };

    const handleSwapArrowClick = () => {
        setRotated(!rotated);
        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);
    };

    const handleTokenChange = (type, selectedToken) => {
        if (type === "to") {
            setToToken(selectedToken.name); // Set the selected token for "To"
        }
        // Add other conditions for other token fields if needed
    };

    const handleTokenSelect = (selectedToken) => {
        setToToken(selectedToken.name); // Set the selected token name
        setIsModalOpen(false); // Close the modal
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
                    fromAmount={fromAmount}
                    setFromAmount={setFromAmount}
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

            {/* To Token Section */}
            <div className={`glass-panel p-4 mt-2 ${rotated ? "order-first" : "order-last"}`}>
                {/* Trigger Modal */}
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => {
                        console.log("To token clicked, opening modal...");
                        setIsModalOpen(true); // Open modal on click
                    }}
                >
                    <TokenInput
                        label="To"
                        token={toToken} // Just passing the selected token (not the balance here)
                        tokens={availableTokens} // This is your list of available tokens for the dropdown
                        onChange={(value) => handleTokenChange("to", value)} // Call `handleTokenChange`
                    />

                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <TokenSelectorModal
                    tokens={availableTokens}
                    onSelect={handleTokenSelect}
                    onClose={() => setIsModalOpen(false)} // Close modal
                />
            )}

            <button
                onClick={() => alert("Swap initiated!")}
                className="bg-blue-600 mt-4 hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 w-full"
            >
                Swap Now
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
    );
};


// Token Selector Modal
const TokenSelectorModal = ({ tokens, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-96 max-h-[80%] rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Select a Token</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        ✕
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {tokens.length === 0 ? (
                        <div className="text-gray-500">No tokens available</div>
                    ) : (
                        tokens.map((token, index) => (
                            <div
                                key={token.address || index}
                                className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-gray-100"
                                onClick={() => onSelect(token)}
                            >
                                <span>{token.name}</span>
                                <span className="text-gray-500 text-sm">{token.address.slice(0, 6)}...</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Token Input Component
const TokenInput = ({ label, token, tokens, onChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [balance, setBalance] = useState(null); // Local state for the selected token balance
  
    // Handle token selection
    const handleTokenSelect = (selectedToken) => {
      onChange(selectedToken);  // Update the parent state
      setBalance(selectedToken.balance); // Set the balance for the selected token
      setDropdownOpen(false); // Close dropdown/modal
    };
  
    const handleDropdownToggle = () => {
      setDropdownOpen(!dropdownOpen); // Toggle the dropdown visibility
    };
  
    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-400">{label}</span>
          <span className="text-sm">Balance: {balance ? balance : "Select a token"}</span> {/* Display balance only after selection */}
        </div>
        <div className="flex space-x-4 relative">
          <button
            className="token-select flex items-center gap-2"
            onClick={handleDropdownToggle}
          >
            <span>{token}</span> {/* Display selected token name */}
            <svg
              className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
  
          {/* Display dropdown modal only when it's open */}
          {dropdownOpen && (
            <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
              {tokens.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No tokens available</div>
              ) : (
                tokens.map((token, index) => (
                  <div
                    key={token.amm_id || index} // Use amm_id for the unique key
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleTokenSelect(token)} // Call handleTokenSelect when token is clicked
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
    );
  };
  

export default SwapCard;
