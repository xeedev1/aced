import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import axios from "axios";

const SwapCard = () => {
  const [loading, setLoading] = useState(true);
  const [rotated, setRotated] = useState(false);
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("AceD");
  const [availableTokens, setAvailableTokens] = useState([]); 
  const [displayedTokens, setDisplayedTokens] = useState([]); 
  const [fromAmount, setFromAmount] = useState(""); 
  const [error, setError] = useState(""); 
  const [currentPage, setCurrentPage] = useState(0); // Current page for token pagination
  const [searchTerm, setSearchTerm] = useState(""); // Current search term

  const TOKEN_BATCH_SIZE = 100; // Number of tokens to fetch per batch
  const API_URL = "http://localhost:5001/raydium-pairs";

  // Fetch tokens (paginated)
  useEffect(() => {
    fetchTokens(currentPage);
  }, [currentPage]);

  const fetchTokens = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?offset=${page * TOKEN_BATCH_SIZE}&limit=${TOKEN_BATCH_SIZE}`);
      if (response.data && Array.isArray(response.data)) {
        const tokens = response.data.map((pair) => ({
          name: pair.name.split("/")[0],
          address: pair.amm_id,
          ticker: pair.name.split("/")[1],
        }));

        // Prevent duplicates by using a Set
        const uniqueTokens = [...new Map([...availableTokens, ...tokens].map((item) => [item.name, item])).values()];

        setAvailableTokens(uniqueTokens);
        setDisplayedTokens(uniqueTokens);
      } else {
        throw new Error("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      setError("Failed to fetch tokens.");
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  if (searchTerm.trim()) {
    const filteredTokens = availableTokens
      .filter((token) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const searchLower = searchTerm.toLowerCase();
        const aStartsWith = a.name.toLowerCase().startsWith(searchLower);
        const bStartsWith = b.name.toLowerCase().startsWith(searchLower);

        // Prioritize tokens starting with the search term
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // For tokens containing the term elsewhere, sort alphabetically
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

    setDisplayedTokens(filteredTokens);
  } else {
    setDisplayedTokens(availableTokens); // Reset if no search term
  }
}, [searchTerm, availableTokens]);


  const handleTokenChange = (tokenType, value) => {
    if (tokenType === "from") {
      setFromToken(value);
    } else {
      setToToken(value);
    }
  };

  const handleScrollEnd = () => {
    if (!loading && !searchTerm) {
      setCurrentPage((prevPage) => prevPage + 1); // Load next batch of tokens only if not searching
    }
  };

  if (loading && !availableTokens.length) {
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
          amount={fromAmount}
          balance="N/A"
          token={fromToken}
          tokens={displayedTokens}
          onChangeAmount={(value) => setFromAmount(value)}
          onChangeToken={(value) => handleTokenChange("from", value)}
          onSearch={(value) => setSearchTerm(value)}
          onScrollEnd={handleScrollEnd}
        />
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div
          className="swap-arrow"
          onClick={() => {
            setRotated(!rotated);
            const temp = fromToken;
            setFromToken(toToken);
            setToToken(temp);
          }}
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
          amount={""} // Amount for "To" token is not needed
          balance="N/A"
          token={toToken}
          tokens={displayedTokens}
          onChangeToken={(value) => handleTokenChange("to", value)}
          onSearch={(value) => setSearchTerm(value)}
          onScrollEnd={handleScrollEnd}
        />
      </div>

      <button className="bg-blue-600 mt-4 hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300 w-full">
        Swap Now
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
};

const TokenInput = ({
  label,
  amount,
  balance,
  token,
  tokens,
  onChangeAmount,
  onChangeToken,
  onSearch,
  onScrollEnd,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard: " + text);
  };

  const Row = ({ index, style }) => {
    const tokenData = tokens[index];
  
    // Safeguard against undefined or missing properties
    const fullName = tokenData?.name?.split("/")?.[0] || "Unknown Token";
    console.log(tokenData);
    
    const ticker = tokenData?.ticker || "Unknown Ticker";
    const truncatedAddress =
      tokenData?.address
        ? tokenData.address.slice(0, 6) + "..." + tokenData.address.slice(-6)
        : "N/A";
  
    return (
      <div
        style={style}
        className="px-4 py-2 flex items-center justify-between hover:bg-black color-white cursor-pointer"
        onClick={() => {
          if (tokenData?.name) {
            onChangeToken(tokenData.name); // Pass token name back
            setDropdownOpen(false);
          }
        }}
      >
        <div>
          <p className="font-bold">{fullName}</p>
          <p className="text-sm text-gray-500">{ticker}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-500">{truncatedAddress}</span>
          {tokenData?.pair_id && (
            <button
              className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the dropdown item click
                copyToClipboard(tokenData.pair_id);
              }}
            >
              Copy
            </button>
          )}
        </div>
      </div>
    );
  };
  

  return (
    <div className="token-input-container">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-blue-400">{label}</span>
        <span className="text-sm">Balance: {balance}</span>
      </div>
      <div className="flex space-x-4 relative">
        <input
          type="text"
          className="input-field flex-grow"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => onChangeAmount(e.target.value)}
        />
        <button
          className="token-select flex items-center gap-2"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{token}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute z-20 bg-[#121D33] border border-[#111D33] rounded-md shadow-lg mt-1 w-full max-h-48 overflow-hidden">
            <div className="sticky top-0 bg-[#121D33] p-2 border-[#111D33] border-b">
              <input
                type="text"
                placeholder="Search token..."
                className="bg-black input-search w-full p-2 border border-[#111D33] rounded"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <List
              height={200}
              itemCount={tokens.length}
              itemSize={60} // Increased for larger rows
              onItemsRendered={onScrollEnd}
            >
              {Row}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};


export default SwapCard;
