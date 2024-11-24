import React, {useEffect, useState} from "react";
import logo from "../assets/logo.png"
import { PublicKey } from "@solana/web3.js";

const Header = () => {

  const [walletAddress, setWalletAddress] = useState(null);

  // Check if Phantom Wallet is installed
  const checkIfWalletIsConnected = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    } else {
      console.warn("Phantom Wallet not found. Please install it from https://phantom.app");
    }
  };

  // Connect Wallet Handler
  const connectWallet = async () => {
    if (window.solana?.isPhantom) {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      // Redirect mobile users to Phantom app
      window.location.href = "https://phantom.app/ul/v1/connect";
    } else {
      alert("Phantom Wallet not found. Please install it from https://phantom.app");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);













  return (
    <header className="glass-panel p-4 mb-8 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold text-blue-400"><img className="logo" src={logo}/></div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-blue-300">$1,234.56 (+5.67%)</span>
        
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 mb-4 md:mx-4 sm:mb-0 hover:bg-blue-700 px-8 py-3 rounded-full transition-all duration-300"
          >
            Connect Wallet
          </button>
        ) : (
          <span className="text-green-500">
            Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>
        )}

      </div>
    </header>
  );
};

export default Header;
