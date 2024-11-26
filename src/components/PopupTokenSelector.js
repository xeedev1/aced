import React, { useState } from "react";
import TokenSelector from "./TokenSelector";

const TokenDropdown = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("modal")
  return (
    <div>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full px-4 py-2 border rounded-md text-left"
      >
        {selectedToken ? selectedToken.name : "Select a Token"}
      </button>

      {/* Token Selector Modal */}
      {isModalOpen && (
        <TokenSelector
          tokens={tokens}
          onTokenSelect={(token) => setSelectedToken(token)} // Set selected token
          onClose={() => setIsModalOpen(false)} // Close modal
        />
      )}
    </div>
  );
};

export default TokenDropdown;
