import React, { useState } from "react";
import { FaEthereum, FaBitcoin, FaDollarSign } from "react-icons/fa";
import { SiBinance, SiSolana } from "react-icons/si";
import AcedTicker from "../assets/aced-ticker.png"



const SwapCard = () => {
  const [rotated, setRotated] = useState(false);
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("AceD");

  const tokens = [
    { label: "ETH", icon: <FaEthereum />, balance: "2,345.67" },
    { label: "BTC", icon: <FaBitcoin />, balance: "1.23" },
    { label: "USDT", icon: <FaDollarSign />, balance: "10,000" },
    { label: "USDC", icon: <FaDollarSign />, balance: "9,000" },
    { label: "BNB", icon: <SiBinance />, balance: "45" },
    { label: "SOL", icon: <SiSolana />, balance: "2.23" },
    { label: "AceD", icon: <img className="aced-ticker" src={AcedTicker}/>, balance: "150,000" }
  ];
  

  const handleTokenChange = (tokenType, value) => {
    if (tokenType === "from") {
      setFromToken(value);
    } else {
      setToToken(value);
    }
  };

  const handleSwapArrowClick = () => {
    setRotated(!rotated);
    // Swap the tokens
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="neo-card p-6 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Swap Tokens</h2>
      </div>

      {/* From Token */}
      <div
        className={`glass-panel p-4 mb-2 ${rotated ? "order-last" : "order-first"}`}
      >
        <TokenInput
          label="From"
          balance={tokens.find((t) => t.label === fromToken)?.balance}
          token={fromToken}
          tokens={tokens}
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
      <div
        className={`glass-panel p-4 mt-2 ${rotated ? "order-first" : "order-last"}`}
      >
        <TokenInput
          label="To"
          balance={tokens.find((t) => t.label === toToken)?.balance}
          token={toToken}
          tokens={tokens}
          onChange={(value) => handleTokenChange("to", value)}
        />
      </div>

      {/* Swap Details */}
      <div className="mt-6 space-y-3">
        <Detail label="1 SOL " value="= 250,000 AceD" highlight="green" />
        <Detail label="Minimum Received" value="234.56 AceD" />
        <Detail label="Network Fee" value="~$4.20" />
      </div>

      <button className="bg-blue-600 mt-4 hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 w-full">Swap Now</button>
    </div>
  );
};

const TokenInput = ({ label, balance, token, tokens, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-blue-400">{label}</span>
        <span className="text-sm">Balance: {balance}</span>
      </div>
      <div className="flex space-x-4 relative">
        <input type="text" placeholder="0.0" className="input-field flex-grow" />
        <div className="relative">
          <button
            className="token-select flex items-center gap-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {tokens.find((t) => t.label === token)?.icon}
            <span>{token}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <ul className="absolute left-0 mt-2 bg-gray-800 text-white rounded-lg shadow-lg w-full z-10">
              {tokens.map((t) => (
                <li
                  key={t.label}
                  className="px-4 py-2 hover:bg-blue-600 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    onChange(t.label);
                    setDropdownOpen(false);
                  }}
                >
                  {t.icon}
                  {t.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, highlight }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className={highlight ? `text-${highlight}-400` : ""}>{value}</span>
  </div>
);

export default SwapCard;
